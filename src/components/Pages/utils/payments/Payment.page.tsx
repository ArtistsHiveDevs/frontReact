import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import CryptoJS from 'crypto-js';
import { useEffect, useRef, useState } from 'react';
import Flag from 'react-world-flags';
import './Payment.page.scss';

// Tasa fija usada únicamente para calcular el equivalente en COP cuando el monto se registra en otra moneda.
let EUR_TO_COP_RATE = 3900;

// Precio por gramo: el monto en EUR se calcula a partir del peso de la pieza.
let GRAM_TO_EUR_RATE = 15;

const groupThousands = (digits: string): string => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// Agrupa la parte entera con espacios como separador de miles, preservando el punto decimal tal cual se escribe.
const formatAmountDisplay = (raw: string): string => {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const dotIndex = cleaned.indexOf('.');
  const intPart = dotIndex === -1 ? cleaned : cleaned.slice(0, dotIndex);
  const decPart = dotIndex === -1 ? '' : cleaned.slice(dotIndex + 1).replace(/\./g, '');
  const groupedInt = groupThousands(intPart.replace(/^0+(?=\d)/, ''));
  return dotIndex === -1 ? groupedInt : `${groupedInt}.${decPart}`;
};

const parseAmountDisplay = (raw: string): number | undefined => {
  const cleaned = raw.replace(/[^\d.]/g, '');
  if (cleaned === '' || cleaned === '.') return undefined;
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const roundTo2 = (value: number): number => Math.round(value * 100) / 100;

// Campo numérico con separador de miles visual; el valor almacenado sigue siendo number | undefined.
// Si vale 0 o está vacío se muestra en blanco, para no obligar a borrar un "0" antes de escribir.
const useThousandsField = (value: number | undefined, onChange: (value: number | undefined) => void) => {
  const toDisplay = (v: number | undefined) => (v === undefined || v === 0 ? '' : formatAmountDisplay(String(v)));
  const [display, setDisplay] = useState(() => toDisplay(value));
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      setDisplay(toDisplay(value));
      lastEmitted.current = value;
    }
  }, [value]);

  const handleChange = (raw: string) => {
    const formatted = formatAmountDisplay(raw);
    const parsed = parseAmountDisplay(formatted);
    setDisplay(formatted);
    lastEmitted.current = parsed;
    onChange(parsed);
  };

  return { display, handleChange };
};

interface PaymentData {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
}

// Campos solo informativos para nuestro registro interno: a Wompi siempre se le envía `amount`/`currency` (PaymentData) en COP.
interface WorldPaymentData extends PaymentData {
  otherCurrency: 'COP' | 'EUR';
  amountOtherCurrency?: number;
  weightGrams?: number;
}

interface WompiWidgetConfig {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  signature: string;
  redirectUrl?: string;
  customerData?: {
    email?: string;
    fullName?: string;
  };
}

const PaymentPage = (props: any) => {
  // Generate unique reference
  const generateReference = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `ref-${timestamp}-${random}`;
  };

  const [paymentData, setPaymentData] = useState<WorldPaymentData>({
    amount: 0,
    currency: 'COP',
    reference: generateReference(),
    description: 'ExpoArtesano Madrid 2026',
    customerEmail: '@gmail.com',
    customerName: '',
    otherCurrency: 'EUR',
    amountOtherCurrency: undefined,
    weightGrams: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Wompi configuration from environment variables
  const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY || 'pub_test_your_public_key';
  const WOMPI_INTEGRITY_SECRET = import.meta.env.VITE_WOMPI_INTEGRITY_SECRET || 'test_integrity_your_secret';
  const WOMPI_REDIRECT_URL =
    import.meta.env.VITE_WOMPI_REDIRECT_URL || `${window.location.origin}/payment/confirmation`;

  // Load Wompi widget script
  useEffect(() => {
    if (document.getElementById('wompi-widget-script')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'wompi-widget-script';
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      setError('Error al cargar el widget de Wompi. Por favor, intenta de nuevo.');
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('wompi-widget-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Initialize widget automatically when script loads and payment data changes
  useEffect(() => {
    if (scriptLoaded && paymentData.description && paymentData.amount > 0) {
      const reference = paymentData.reference || generateReference();
      const amountInCents = Math.round(paymentData.amount * 100);
      const signature = generateSignature(reference, amountInCents, paymentData.currency);

      renderWompiWidget({
        publicKey: WOMPI_PUBLIC_KEY,
        currency: paymentData.currency,
        amountInCents,
        reference,
        signature,
        redirectUrl: WOMPI_REDIRECT_URL,
        customerData: {
          email: paymentData.customerEmail,
          fullName: paymentData.customerName,
        },
      });
    }
  }, [scriptLoaded, paymentData.amount, paymentData.description, paymentData.customerEmail, paymentData.customerName]);

  // Generate integrity signature
  const generateSignature = (reference: string, amountInCents: number, currency: string): string => {
    const concatenatedString = `${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`;
    return CryptoJS.SHA256(concatenatedString).toString();
  };

  // Render Wompi widget
  const renderWompiWidget = (config: WompiWidgetConfig) => {
    if (!widgetContainerRef.current) return;

    // Clear previous widget
    widgetContainerRef.current.innerHTML = '';

    // Create form
    const form = document.createElement('form');

    // Create script tag for widget
    const widgetScript = document.createElement('script');
    widgetScript.src = 'https://checkout.wompi.co/widget.js';
    widgetScript.setAttribute('data-render', 'button');
    widgetScript.setAttribute('data-public-key', config.publicKey);
    widgetScript.setAttribute('data-currency', config.currency);
    widgetScript.setAttribute('data-amount-in-cents', config.amountInCents.toString());
    widgetScript.setAttribute('data-reference', config.reference);
    widgetScript.setAttribute('data-signature:integrity', config.signature);

    if (config.redirectUrl) {
      widgetScript.setAttribute('data-redirect-url', config.redirectUrl);
    }

    if (config.customerData?.email) {
      widgetScript.setAttribute('data-customer-data:email', config.customerData.email);
    }

    if (config.customerData?.fullName) {
      widgetScript.setAttribute('data-customer-data:full-name', config.customerData.fullName);
    }

    form.appendChild(widgetScript);
    widgetContainerRef.current.appendChild(form);
  };

  // Handle input changes
  const handleInputChange = (field: keyof PaymentData, value: string | number) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  // Moneda en la que el usuario registra el monto (solo para nuestro control interno)
  const handleOtherCurrencyChange = (value: 'COP' | 'EUR') => {
    setPaymentData((prev) => ({
      ...prev,
      otherCurrency: value,
      amountOtherCurrency: value === 'EUR' ? prev.amountOtherCurrency ?? 0 : undefined,
      amount: value === 'EUR' ? Math.round((prev.amountOtherCurrency ?? 0) * EUR_TO_COP_RATE) : prev.amount,
    }));
  };

  // Cuál de los tres campos (peso, EUR, COP) editó el usuario por última vez, para saber qué recalcular si cambia alguna tasa
  const [lastEdited, setLastEdited] = useState<'PESO' | 'EUR' | 'COP'>('PESO');

  // Peso de la pieza en gramos; determina el monto en EUR (y por lo tanto en COP)
  const handleWeightChange = (value: number | undefined) => {
    const eur = roundTo2((value ?? 0) * GRAM_TO_EUR_RATE);
    setPaymentData((prev) => ({
      ...prev,
      weightGrams: value,
      amountOtherCurrency: eur,
      amount: Math.round(eur * EUR_TO_COP_RATE),
    }));
    setLastEdited('PESO');
  };

  // Monto en EUR; se sincroniza siempre con su equivalente en peso y en COP, que es el que efectivamente se cobra en Wompi
  const handleOtherCurrencyAmountChange = (value: number | undefined) => {
    setPaymentData((prev) => ({
      ...prev,
      amountOtherCurrency: value,
      amount: Math.round((value ?? 0) * EUR_TO_COP_RATE),
      weightGrams: roundTo2((value ?? 0) / GRAM_TO_EUR_RATE),
    }));
    setLastEdited('EUR');
  };

  // Monto en COP; se sincroniza siempre con su equivalente en EUR y en peso
  const handleAmountChange = (value: number | undefined) => {
    const eur = roundTo2((value ?? 0) / EUR_TO_COP_RATE);
    setPaymentData((prev) => ({
      ...prev,
      amount: value ?? 0,
      amountOtherCurrency: eur,
      weightGrams: roundTo2(eur / GRAM_TO_EUR_RATE),
    }));
    setLastEdited('COP');
  };

  const [numClics, setNumClics] = useState(0);
  const [currencyVisible, setVisible] = useState(false);
  const [rateInput, setRateInput] = useState<number | undefined>(EUR_TO_COP_RATE);
  const [gramRateInput, setGramRateInput] = useState<number | undefined>(GRAM_TO_EUR_RATE);

  const rateField = useThousandsField(rateInput, setRateInput);
  const gramRateField = useThousandsField(gramRateInput, setGramRateInput);
  const weightField = useThousandsField(paymentData.weightGrams, handleWeightChange);
  const copAmountField = useThousandsField(paymentData.amount, handleAmountChange);
  const eurAmountField = useThousandsField(paymentData.amountOtherCurrency, handleOtherCurrencyAmountChange);

  const handleCurrencyExchange = () => {
    setNumClics(numClics + 1);
    if (numClics + 1 >= 4) {
      setRateInput(EUR_TO_COP_RATE);
      setGramRateInput(GRAM_TO_EUR_RATE);
      setVisible(true);
    }
  };

  const handleSaveRate = () => {
    if (rateInput) {
      EUR_TO_COP_RATE = rateInput;
    }
    if (gramRateInput) {
      GRAM_TO_EUR_RATE = gramRateInput;
    }
    setPaymentData((prev) => {
      if (lastEdited === 'PESO') {
        const eur = roundTo2((prev.weightGrams ?? 0) * GRAM_TO_EUR_RATE);
        return { ...prev, amountOtherCurrency: eur, amount: Math.round(eur * EUR_TO_COP_RATE) };
      }
      if (lastEdited === 'COP') {
        const eur = roundTo2((prev.amount ?? 0) / EUR_TO_COP_RATE);
        return { ...prev, amountOtherCurrency: eur, weightGrams: roundTo2(eur / GRAM_TO_EUR_RATE) };
      }
      return {
        ...prev,
        amount: Math.round((prev.amountOtherCurrency ?? 0) * EUR_TO_COP_RATE),
        weightGrams: roundTo2((prev.amountOtherCurrency ?? 0) / GRAM_TO_EUR_RATE),
      };
    });
    setVisible(false);
    setNumClics(0);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '20px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%', padding: '20px' }}>
        <CardContent>
          <Typography
            variant="h4"
            sx={{ marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}
            onClick={handleCurrencyExchange}
          >
            Pasarela de Pagos
          </Typography>

          {currencyVisible && (
            <>
              <TextField
                label="Tasa EUR → COP"
                variant="outlined"
                fullWidth
                type="text"
                inputMode="decimal"
                value={rateField.display}
                onChange={(e) => rateField.handleChange(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <TextField
                label="Precio por gramo (EUR)"
                variant="outlined"
                fullWidth
                type="text"
                inputMode="decimal"
                value={gramRateField.display}
                onChange={(e) => gramRateField.handleChange(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <button onClick={handleSaveRate}>Guardar</button>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ marginBottom: '20px' }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {!scriptLoaded && (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </Box>
          )}

          {scriptLoaded && (
            <>
              <Box sx={{ marginBottom: '20px' }}>
                <TextField
                  label="Descripción del pago *"
                  variant="outlined"
                  fullWidth
                  value={paymentData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  sx={{ marginBottom: '15px' }}
                  placeholder="Ej: Suscripción Premium"
                />

                <TextField
                  label="Peso (g) *"
                  variant="outlined"
                  fullWidth
                  type="text"
                  inputMode="decimal"
                  value={weightField.display}
                  onChange={(e) => weightField.handleChange(e.target.value)}
                  sx={{ marginBottom: '15px' }}
                  placeholder="250"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">g</InputAdornment>,
                  }}
                />

                <TextField
                  select
                  label="Moneda en la que registras el monto"
                  variant="outlined"
                  fullWidth
                  value={paymentData.otherCurrency}
                  onChange={(e) => handleOtherCurrencyChange(e.target.value as 'COP' | 'EUR')}
                  sx={{ marginBottom: '15px', display: 'none' }}
                >
                  <MenuItem value="COP">
                    <Flag code="CO" height="15" style={{ marginRight: '0.4rem' }} />
                    COP$ - COP
                  </MenuItem>
                  <MenuItem value="EUR">
                    {' '}
                    <Flag code="EU" height="15" style={{ marginRight: '0.4rem' }} />€ - EUR
                  </MenuItem>
                </TextField>

                {paymentData.otherCurrency === 'EUR' && (
                  <TextField
                    label="Monto (EUR) *"
                    variant="outlined"
                    fullWidth
                    type="text"
                    inputMode="decimal"
                    value={eurAmountField.display}
                    onChange={(e) => eurAmountField.handleChange(e.target.value)}
                    sx={{ marginBottom: '15px' }}
                    placeholder="10"
                    // helperText={`Equivalente: ${paymentData.amount.toLocaleString('es-CO')} COP (1 EUR = ${EUR_TO_COP_RATE} COP)`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Flag code="EU" height="15" style={{ marginRight: '0.4rem' }} />
                        </InputAdornment>
                      ),
                      endAdornment: <InputAdornment position="end">€</InputAdornment>,
                    }}
                  />
                )}

                <TextField
                  label="Monto (COP) *"
                  variant="outlined"
                  fullWidth
                  type="text"
                  inputMode="decimal"
                  value={copAmountField.display}
                  onChange={(e) => copAmountField.handleChange(e.target.value)}
                  sx={{ marginBottom: '15px' }}
                  placeholder="10000"
                  // disabled={paymentData.otherCurrency === 'EUR'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Flag code="CO" height="15" style={{ marginRight: '0.4rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">$ COP</InputAdornment>,
                  }}
                />

                <TextField
                  label="Email del cliente"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={paymentData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  sx={{ marginBottom: '15px' }}
                  placeholder="cliente@example.com"
                />

                <TextField
                  label="Nombre del cliente"
                  variant="outlined"
                  fullWidth
                  value={paymentData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  sx={{ marginBottom: '15px' }}
                  placeholder="Juan Pérez"
                />

                {paymentData.reference && (
                  <TextField
                    label="Referencia de transacción"
                    variant="outlined"
                    fullWidth
                    value={paymentData.reference}
                    disabled
                    sx={{ marginBottom: '15px' }}
                  />
                )}
              </Box>

              {/* Wompi Widget Container */}
              <Box
                ref={widgetContainerRef}
                sx={{
                  minHeight: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              />
            </>
          )}

          <Box sx={{ marginTop: '30px', padding: '15px', borderRadius: '8px' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', marginBottom: '10px' }}>
              Información de prueba:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace' }}>
              Tarjeta: 4242 4242 4242 4242
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace' }}>
              Vencimiento: Cualquier fecha futura
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace' }}>
              CVV: Cualquier 3 dígitos
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentPage;
