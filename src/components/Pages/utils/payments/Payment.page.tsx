import { Alert, Box, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import CryptoJS from 'crypto-js';
import { useEffect, useRef, useState } from 'react';
import './Payment.page.scss';

interface PaymentData {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
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

  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 1500, // Default: 10,000 COP
    currency: 'COP',
    reference: generateReference(),
    description: 'Test',
    customerEmail: 'test@test.com',
    customerName: 'Pepito Pérez',
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
          <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>
            Pasarela de Pagos
          </Typography>

          <Typography variant="body2" sx={{ marginBottom: '20px', textAlign: 'center', color: 'text.secondary' }}>
            Integración con Wompi - Pagos seguros en línea
          </Typography>

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
                  label="Monto (COP) *"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  sx={{ marginBottom: '15px' }}
                  placeholder="10000"
                  inputProps={{ min: 1000, step: 1000 }}
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
