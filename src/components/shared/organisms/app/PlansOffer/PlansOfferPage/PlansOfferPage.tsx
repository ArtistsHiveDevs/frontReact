import React, { useEffect, useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import BadgeExplainer from '~/components/shared/molecules/domain/pricing/Badgeexplainer';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import { VerificationStatus } from '~/constants';
import { convertFromUSD, CURRENCIES, formatCurrency, getCurrencyConfig } from './currencies.config';
import './PlansOfferPage.scss';

// ============================================
// TYPES
// ============================================
const Phase = {
  MVP: 'MVP',
  Phase2: 'Phase2',
  Phase3: 'Phase3',
  Phase4: 'Phase4',
  Phase5: 'Phase5',
  Phase6: 'Phase6',
  Phase7: 'Phase7',
  Phase8: 'Phase8',
} as const;

const PHASES = Object.values(Phase);

type Phase = typeof Phase[keyof typeof Phase];

type Feature = {
  description: string;
  availableFrom: Phase;
};

type Plan = {
  id: string;
  name: string;
  icon?: string;
  iconRI?: string;
  basePrice: number;
  recommended?: boolean;
  badge: 'ESSENTIAL' | 'STARTER' | 'PROFESSIONAL' | 'EXPERT' | 'PREMIUM';
  valueProposition: string;
  features: Feature[];
  availableFrom: Phase;
};

type CrewSize = 1 | 2 | 3 | 4 | 5;

// ============================================
// DATA: PLANES SEGÚN ESTRATEGIA
// ============================================
const validationPlan: Plan = {
  id: 'validation',
  name: 'Validación de Perfil',
  iconRI: 'md MdVerifiedUser',
  basePrice: 5,
  badge: 'ESSENTIAL',
  valueProposition: 'Diferénciate con ⭐. Venues priorizan perfiles verificados. 1 show paga el año completo.',
  features: [
    { description: 'Badge de perfil verificado ⭐', availableFrom: 'MVP' },
    { description: 'EPK / Perfil Profesional', availableFrom: 'MVP' },
    { description: 'Búsqueda de agentes y eventos de la industria musical', availableFrom: 'MVP' },
    { description: 'Recepción de solicitudes', availableFrom: 'Phase2' },
    { description: 'Dashboard básico', availableFrom: 'Phase2' },
    // { description: 'Perfil público visible', availableFrom: 'MVP' },
  ],
  availableFrom: 'MVP',
};

const plans: Plan[] = [
  {
    id: 'fa',
    name: 'Clave de Fa',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/FClef.svg/18px-FClef.svg.png',
    basePrice: 59,
    badge: 'STARTER',
    valueProposition: 'Ahorra 5+ horas por show preparando la documentación.',
    features: [
      { description: '✨ Todo lo de Validación', availableFrom: 'MVP' },
      { description: 'Rider Técnico automático', availableFrom: 'Phase3' },
      { description: 'Stage Plot automático por show', availableFrom: 'Phase3' },
      { description: 'Calendario de disponibilidad', availableFrom: 'Phase2' },
      { description: 'Estadísticas básicas', availableFrom: 'MVP' },
      // { description: 'Almacenamiento ilimitado', availableFrom: 'MVP' },
      { description: 'Setlists', availableFrom: 'MVP' },
      { description: 'Historial de shows', availableFrom: 'Phase3' },
      { description: 'Cotizador de cachés (v1)', availableFrom: 'Phase3' },
      { description: 'Interación con otros usuarios', availableFrom: 'Phase2' },
      { description: 'Chat con venues', availableFrom: 'Phase3' },
      { description: 'Trazabilidad de eventos previos', availableFrom: 'Phase5' },
    ],
    availableFrom: 'Phase2',
  },
  {
    id: 'do',
    name: 'Clave de Do',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/CClef.svg/18px-CClef.svg.png',
    basePrice: 119,
    badge: 'PROFESSIONAL',
    valueProposition: 'Negocia mejor. Cobra más. Gana más.',
    features: [
      { description: '✨ Todo lo de Clave de Fa', availableFrom: 'MVP' },
      { description: 'Gestión de eventos', availableFrom: 'Phase2' },
      { description: 'Cotizador automático de cachés avanzado', availableFrom: 'Phase3' },
      { description: 'Generador de contratos (templates legales)', availableFrom: 'Phase3' },
      { description: 'Tracking financiero (ingresos/gastos por show)', availableFrom: 'Phase4' },
      { description: 'Generación de facturas', availableFrom: 'Phase4' },
      { description: 'Analíticas avanzadas', availableFrom: 'Phase3' },
      { description: 'Exportar datos (CSV, PDF)', availableFrom: 'Phase3' },
    ],
    availableFrom: 'Phase3',
  },
  {
    id: 'sol',
    name: 'Clave de Sol',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/GClef.svg/15px-GClef.svg.png',
    basePrice: 189,
    recommended: true,
    badge: 'EXPERT',
    valueProposition: 'La suite profesional completa. Tu banda como empresa seria.',
    features: [
      { description: '✨ Todo lo de Clave de Do', availableFrom: 'MVP' },
      { description: 'Planeador de giras', availableFrom: 'Phase5' },
      { description: 'Minutogramas para cada evento', availableFrom: 'Phase5' },
      { description: 'Reservar salas de ensayo/estudios con descuento', availableFrom: 'Phase4' },
      { description: 'Aplicar a festivales con 1 click', availableFrom: 'Phase5' },
      { description: 'Tienda virtual', availableFrom: 'Phase4' },
      { description: 'Convenios', availableFrom: 'Phase4' },
      { description: 'Visibilidad destacada en búsquedas', availableFrom: 'MVP' },
      { description: 'Soporte prioritario', availableFrom: 'MVP' },
      { description: 'Acceso a mentorías grupales', availableFrom: 'Phase4' },
    ],
    availableFrom: 'Phase4',
  },
  {
    id: 'alta',
    name: 'Alta Frecuencia',
    iconRI: 'PiWaveform',
    basePrice: 349,
    badge: 'PREMIUM',
    valueProposition: 'Para quienes viven de esto. Apoyo financiero + mentoría + red VIP.',
    features: [
      { description: '✨ Todo lo de Clave de Sol', availableFrom: 'MVP' },
      { description: 'Apoyo financiero & becas', availableFrom: 'Phase5' },
      { description: 'Mentorías personalizadas', availableFrom: 'Phase5' },
      { description: 'Convocatorias exclusivas (showcases privados)', availableFrom: 'MVP' },
      { description: 'Conexión directa con labels/managers/bookers', availableFrom: 'Phase5' },
      { description: 'Factoring: adelanto de pagos de shows', availableFrom: 'Phase4' },
      { description: 'Soporte 24/7 (<2h respuesta)', availableFrom: 'MVP' },
      { description: 'Account manager dedicado', availableFrom: 'MVP' },
      { description: 'Reportes personalizados', availableFrom: 'MVP' },
      { description: 'Producción de eventos (curaduría de showcases)', availableFrom: 'MVP' },
    ],
    availableFrom: 'Phase5',
  },
];

// ============================================
// MULTIPLICADORES Y DESCUENTOS
// ============================================
const crewMultipliers: Record<CrewSize, number> = {
  1: 1.0, // Solista
  2: 1.3, // 2-5 personas
  3: 1.5, // 6-10 personas
  4: 1.8, // 11-20 personas
  5: 2.0, // 21+ personas
};

const regionalDiscounts: Record<number, number> = {
  1: 0.6, // Año 1: 40% OFF
  2: 0.7, // Año 2: 30% OFF
  3: 0.8, // Año 3: 20% OFF
  4: 0.9, // Año 4: 10% OFF
  5: 1.0, // Año 5+: Sin descuento
};

const frequencies: Record<string, { multiplier: number; label: string; periodsPerYear: number }> = {
  annual: { multiplier: 1.0, label: '/ año', periodsPerYear: 1 },
  semiannual: { multiplier: 0.55, label: '/ sem.', periodsPerYear: 2 },
  quarterly: { multiplier: 0.3, label: '/ trim.', periodsPerYear: 4 },
  monthly: { multiplier: 0.11, label: '/ mes', periodsPerYear: 12 },
  weekly: { multiplier: 0.028, label: '/ sem.', periodsPerYear: 52 },
};

// ============================================
// UTILS
// ============================================
const calculatePrice = (
  basePrice: number,
  crewSize: CrewSize,
  region: string,
  subscriptionYear: number,
  frequency: string,
  currencyCode: string
): {
  original: number;
  final: number;
  discount: number;
  annualizedOriginal: number;
  annualizedFinal: number;
  annualizedAnnual: number;
  frequencySavingsPercent: number;
} => {
  const crewFactor = crewMultipliers[crewSize];
  const regionalFactor = region === 'developing' ? regionalDiscounts[subscriptionYear] : 1.0;
  const frequencyData = frequencies[frequency];
  const frequencyFactor = frequencyData.multiplier;
  const periodsPerYear = frequencyData.periodsPerYear;

  // Calculate base annual price in USD (no discounts)
  const annualBaseUSD = basePrice * crewFactor;

  // Calculate price per period with frequency discount
  const pricePerPeriodUSD = annualBaseUSD * frequencyFactor;

  // Apply regional discount
  const finalPricePerPeriodUSD = pricePerPeriodUSD * regionalFactor;

  // Calculate annualized prices (what you'd pay in a year)
  const annualizedOriginalUSD = pricePerPeriodUSD * periodsPerYear; // Without regional discount
  const annualizedFinalUSD = finalPricePerPeriodUSD * periodsPerYear; // With regional discount
  const annualizedAnnualUSD = annualBaseUSD * regionalFactor; // Annual plan with regional discount

  // Calculate savings from frequency choice (comparing to annual plan)
  const frequencySavingsPercent =
    frequency !== 'annual' ? ((annualizedOriginalUSD - annualBaseUSD) / annualizedOriginalUSD) * 100 : 0;

  // Regional discount percentage
  const regionalDiscountPercent = region === 'developing' ? (1 - regionalFactor) * 100 : 0;

  // Convert to target currency
  const priceFinal = convertFromUSD(finalPricePerPeriodUSD, currencyCode);
  const priceOriginal = convertFromUSD(pricePerPeriodUSD, currencyCode);
  const annualizedFinal = convertFromUSD(annualizedFinalUSD, currencyCode);
  const annualizedOriginal = convertFromUSD(annualizedOriginalUSD, currencyCode);
  const annualizedAnnual = convertFromUSD(annualizedAnnualUSD, currencyCode);

  return {
    original: priceOriginal,
    final: priceFinal,
    discount: regionalDiscountPercent,
    annualizedOriginal,
    annualizedFinal,
    annualizedAnnual,
    frequencySavingsPercent: Math.abs(frequencySavingsPercent),
  };
};

// ============================================
// PHASE HELPERS
// ============================================

const isFeatureAvailable = (featurePhase: Phase, currentPhase: Phase): boolean => {
  const featureIndex = PHASES.indexOf(featurePhase);
  const currentIndex = PHASES.indexOf(currentPhase);
  return featureIndex <= currentIndex;
};

// ============================================
// MAIN COMPONENT
// ============================================
const PlansOfferPage: React.FC = () => {
  // State
  const [view, setView] = useState<'badge' | 'plans'>('badge');
  const [currency, setCurrency] = useState<string>('USD');
  const [region, setRegion] = useState<'developed' | 'developing'>('developing');
  const [frequency, setFrequency] = useState<string>('annual');
  const [crewSize, setCrewSize] = useState<CrewSize>(1);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [openBadgeExplainerDialog, setOpenBadgeExplainerDialog] = useState(false);
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false);
  const [openRegionalDiscountDialog, setOpenRegionalDiscountDialog] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('MVP'); // Current development phase

  const [currentPlan, setCurrentPlan] = useState<Plan>(undefined); // Current development phase

  const [showDevOptions, setShowDevOptions] = useState(0);
  const [collapsedPlans, setCollapsedPlans] = useState<Record<string, boolean>>({});
  const [visiblePlans, setVisiblePlans] = useState([]);

  // Computed values
  const currentCurrency = getCurrencyConfig(currency);
  const currencySymbol = currentCurrency.symbol;
  let frequencyLabel = frequencies[frequency].label;
  const badgeIncluded = frequency === 'annual';

  useEffect(() => {
    setVisiblePlans(plans.filter((feature) => isFeatureAvailable(feature.availableFrom, currentPhase)));
  }, [currentPhase]);

  // Toggle plan collapse
  const togglePlanCollapse = (planId: string) => {
    setCollapsedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  // Calculate font size based on text length to keep price in one line
  const getPriceFontSize = (formattedPrice: string): string => {
    const totalLength = formattedPrice.length;
    if (totalLength <= 10) return '1.5rem';
    if (totalLength <= 15) return '1.3rem';
    if (totalLength <= 20) return '1.1rem';
    return '1rem';
  };

  // Render helpers
  const renderPlanCard = (params: { plan: Plan; isValidation?: boolean; totalPlans?: number }) => {
    const { plan, isValidation, totalPlans } = params;

    const isCollapsed = collapsedPlans[plan.id] || false;
    const canCollapse = totalPlans && totalPlans > 1;
    let frecuencyValue = frequency;
    let regionValue = region;

    if (isValidation) {
      frecuencyValue = 'annual';
      regionValue = 'developed';
      frequencyLabel = frequencies[frecuencyValue].label;
    }
    let prices = calculatePrice(
      plan.basePrice,
      isValidation ? 1 : crewSize,
      regionValue,
      1, // Fixed to year 1 (40% OFF for developing regions)
      frecuencyValue,
      currency
    );

    const showRegionalDiscount = !isValidation && prices.discount > 0;
    const showFrequencySavings = frecuencyValue !== 'annual' && prices.frequencySavingsPercent > 0;
    const annualBadgeNote = badgeIncluded && !isValidation;

    return (
      <div key={plan.id} className={`plan ${plan.recommended ? 'recommended' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {plan.recommended && <div className="recommended-badge">⭐ MÁS POPULAR</div>}

        <div
          className="plan-header"
          onClick={canCollapse ? () => togglePlanCollapse(plan.id) : undefined}
          style={{ cursor: canCollapse ? 'pointer' : 'default' }}
        >
          <div className="plan-header-content">
            {plan.icon && <img src={plan.icon} alt={plan.name} />}
            {plan.iconRI && <DynamicIcons iconName={plan.iconRI} size={30} color="white" />}
            <h3>{plan.name}</h3>
            {isValidation && (
              <DynamicIcons
                iconName={'fa FaInfoCircle'}
                size={20}
                color="white"
                onClick={(e: React.MouseEvent) => {
                  setOpenBadgeExplainerDialog(true);
                }}
              />
            )}
          </div>
          {canCollapse && (
            <DynamicIcons
              iconName={isCollapsed ? 'fa FaChevronDown' : 'fa FaChevronUp'}
              size={20}
              color="var(--text)"
              className="collapse-chevron"
            />
          )}
        </div>

        {canCollapse && isCollapsed && (
          <div className="price-final-collapsed">
            <strong
              style={{
                fontSize: getPriceFontSize(`${currencySymbol} ${formatCurrency(prices.final, currency)}`),
              }}
            >
              {currencySymbol} {formatCurrency(prices.final, currency)}
            </strong>
            <span className="frequency-label">{frequencyLabel}</span>
          </div>
        )}

        {(!canCollapse || !isCollapsed) && (
          <>
            <p className="value-proposition">{plan.valueProposition}</p>

            <div className="price-container">
              {/* Show frequency savings comparison */}
              {showFrequencySavings && (
                <div className="price-comparison" onClick={() => setFrequency('annual')}>
                  <div className="frequency-savings">
                    💰 Ahorra {prices.frequencySavingsPercent.toFixed(1)}% pagando anual
                  </div>
                  <div className="annualized-price">
                    <small>Pagarías al año:</small>
                    {currencySymbol} {formatCurrency(prices.annualizedAnnual, currency)}
                    <del>
                      {currencySymbol} {formatCurrency(prices.annualizedOriginal, currency)}
                    </del>
                  </div>
                </div>
              )}

              {/* Final price */}
              <div className="price-final">
                <strong
                  style={{
                    fontSize: getPriceFontSize(`${currencySymbol} ${formatCurrency(prices.final, currency)}`),
                  }}
                >
                  {currencySymbol} {formatCurrency(prices.final, currency)}
                </strong>
                <span className="frequency-label">{frequencyLabel}</span>
              </div>

              {/* Show regional discount */}
              {showRegionalDiscount && (
                <>
                  <div
                    className="price-original"
                    onClick={() => {
                      setCurrentPlan(plan);
                      setOpenRegionalDiscountDialog(true);
                    }}
                  >
                    <DynamicIcons iconName={'bi BiWorld'} size={20} color="white" />{' '}
                    <del>
                      {currencySymbol} {formatCurrency(prices.original, currency)}
                    </del>
                    {'  '}
                    <DynamicIcons iconName={'fa FaInfoCircle'} size={17} color="white" />
                  </div>
                  <div
                    className="discount-badge"
                    onClick={() => {
                      setCurrentPlan(plan);
                      setOpenRegionalDiscountDialog(true);
                    }}
                  >
                    Año 1: -{prices.discount.toFixed(0)}% OFF
                  </div>
                </>
              )}
            </div>

            <ul className="features">
              {/* Badge included note */}
              {annualBadgeNote && (
                <div className="badge-included">
                  <VerifiedArtist verifiedStatus={VerificationStatus.VERIFIED_AND_APPROVED} size={20} /> Verificación
                  incluida
                </div>
              )}
              {plan.features
                .filter((feature) => isFeatureAvailable(feature.availableFrom, currentPhase))
                .map((feature, idx) => (
                  <li key={idx}>{feature.description}</li>
                ))}
            </ul>

            <button className="btn-primary">{isValidation ? 'Validar Perfil' : 'Elegir Plan'}</button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="plans-wrapper">
      {/* Header */}
      <header className="plans-header">
        <h1 onClick={() => setShowDevOptions(showDevOptions + 1)}>Planes y Pricing</h1>
        <p className="subtitle">Elige el plan perfecto para tu proyecto musical</p>
      </header>

      <AppDialog
        title="Verificación vs. Plan"
        isOpenDialog={openBadgeExplainerDialog}
        onClose={() => setOpenBadgeExplainerDialog(false)}
        content={
          <>
            <BadgeExplainer />
          </>
        }
        icon={'FaInfoCircle'}
      />

      {/* Navigation Tabs */}
      <div className="view-tabs">
        <button className={`tab ${view === 'badge' ? 'active' : ''}`} onClick={() => setView('badge')}>
          <DynamicIcons iconName="md MdVerifiedUser" size={23} color={view === 'badge' ? 'black' : 'white'} />{' '}
          Validación
        </button>
        <button className={`tab ${view === 'plans' ? 'active' : ''}`} onClick={() => setView('plans')}>
          <DynamicIcons iconName="md MdChecklist" size={23} color={view === 'badge' ? 'white' : 'black'} />
          Planes
        </button>
      </div>

      {/* Frequency Pills + Filters Button */}
      {view === 'plans' && visiblePlans.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          <p style={{ margin: '0 0 1rem 0' }}>🚀 Estamos trabajando en nuevas funcionalidades increíbles</p>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            Pronto podrás disfrutar de más planes y características. ¡Mantente atento!
          </p>
        </div>
      )}
      {view === 'plans' && visiblePlans.length > 0 && (
        <div className="frequency-and-filters">
          <div className="frequency-selector">
            <button
              className={`frequency-pill-compact ${frequency === 'annual' ? 'active' : ''}`}
              onClick={() => setFrequency('annual')}
            >
              Anual
            </button>
            <button
              className={`frequency-pill-compact ${frequency === 'semiannual' ? 'active' : ''}`}
              onClick={() => setFrequency('semiannual')}
            >
              Semestral
            </button>
            <button
              className={`frequency-pill-compact ${frequency === 'quarterly' ? 'active' : ''}`}
              onClick={() => setFrequency('quarterly')}
            >
              Trimestral
            </button>
            <button
              className={`frequency-pill-compact ${frequency === 'monthly' ? 'active' : ''}`}
              onClick={() => setFrequency('monthly')}
            >
              Mensual
            </button>
            <button
              className={`frequency-pill-compact ${frequency === 'weekly' ? 'active' : ''}`}
              onClick={() => setFrequency('weekly')}
            >
              Semanal
            </button>
          </div>

          <button className="filters-button" onClick={() => setOpenFiltersDialog(true)}>
            <DynamicIcons iconName="bs BsSliders" size={20} color="var(--text)" />
          </button>
        </div>
      )}

      {/* Filters Dialog */}
      <AppDialog
        title="Cotizador de planes"
        isOpenDialog={openFiltersDialog}
        onClose={() => setOpenFiltersDialog(false)}
        content={
          <div className="filters-dialog-content">
            <div className="filter-group">
              <label>
                <DynamicIcons iconName="bi BiWorld" size={20} color="var(--accent)" />
                <span>Región</span>
              </label>
              <select
                className="filter-selector"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value as 'developed' | 'developing');
                  setOpenFiltersDialog(false);
                }}
              >
                <option value="developed">País desarrollado</option>
                <option value="developing">País en desarrollo (LatAm, África, Asia)</option>
              </select>
            </div>

            <div className="filter-group">
              <label>
                <DynamicIcons iconName="fa FaUsers" size={20} color="var(--accent)" />
                <span>Tamaño de crew</span>
              </label>
              <select
                className="filter-selector"
                value={crewSize}
                onChange={(e) => {
                  setCrewSize(Number(e.target.value) as CrewSize);
                  setOpenFiltersDialog(false);
                }}
              >
                <option value={1}>1 persona (Solista)</option>
                <option value={2}>2-5 personas (Banda pequeña)</option>
                <option value={3}>6-10 personas (Banda mediana)</option>
                <option value={4}>11-20 personas (Banda grande)</option>
                <option value={5}>21+ personas (Orquesta/Tour grande)</option>
              </select>
            </div>
          </div>
        }
      />

      <AppDialog
        title="Descuento regional"
        isOpenDialog={openRegionalDiscountDialog}
        onClose={() => setOpenRegionalDiscountDialog(false)}
        content={
          <div>
            <p>
              No todas las regiones cuentan con las mismas oportunidades, tasas de cambio o hábitos de consumo de
              cultura por parte del público.
            </p>
            <p>
              Fomentamos el crecimiento de los proyectos musicales, para países en estas regiones, a través de un
              descuento escalonado a 5 años mientras los proyectos musicales crecen y se profesionalizan.
            </p>

            {currentPlan && (
              <div className="table-regional-discount-container">
                <div className="regional-discount-header">Año</div>
                <div className="regional-discount-header">Descuento</div>
                <div className="regional-discount-header">Valor</div>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((year) => (
                  <React.Fragment key={year}>
                    <div>{year}</div>
                    <div>- {Math.round((1 - regionalDiscounts[year]) * 100)}%</div>
                    <div>
                      {getCurrencyConfig(currency).symbol}{' '}
                      {formatCurrency(
                        calculatePrice(currentPlan.basePrice, crewSize, region, year, frequency, currency).final,
                        currency
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
            <div>
              <p>* Los valores presentados no tienen en cuenta los incrementos por la inflación anual.</p>
            </div>
          </div>
        }
      />

      {/* Action Buttons *}
      {view === 'plans' && (
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => setShowCalculator(!showCalculator)}>
            {showCalculator ? '❌ Cerrar' : '🧮 Calculadora de Precios'}
          </button>
          <button className="btn-secondary" onClick={() => setShowComparison(!showComparison)}>
            {showComparison ? '❌ Cerrar' : '📊 Comparar Planes'}
          </button>
        </div>
      )}

      {/* Calculator *}
      {showCalculator && view === 'plans' && (
        <PricingCalculator
          plans={plans}
          crewSize={crewSize}
          region={region}
          subscriptionYear={subscriptionYear}
          frequency={frequency}
          currency={currency}
        />
      )}

      {/* Comparison Table *}
      {showComparison && view === 'plans' && <PlanComparisonTable plans={[validationPlan, ...plans]} />}

*
      {/* Plans Grid */}

      <div className="plans-container">
        {view === 'badge' && renderPlanCard({ plan: validationPlan, isValidation: true, totalPlans: 1 })}
        {view === 'plans' &&
          visiblePlans.map((plan) =>
            renderPlanCard({
              plan,
              totalPlans: visiblePlans.length,
            })
          )}
      </div>

      {/* Footer Notes */}
      {((view === 'plans' && visiblePlans.length > 0) || view !== 'plans') && (
        <div className="footer-notes">
          {view === 'plans' && frequency !== 'annual' && visiblePlans.length > 0 && (
            <p className="note warning">
              ⚠️ Planes NO anuales requieren Badge activo por separado ($5/año). Recomendamos plan anual para incluir
              badge automáticamente.
            </p>
          )}
          {view === 'plans' && region === 'developing' && visiblePlans.length > 0 && (
            <p className="note info">
              💡 Descuento regional progresivo: Converge gradualmente al precio completo en 5 años. Da tiempo para que
              crezcas como artista.
            </p>
          )}
          {view === 'plans' && visiblePlans.length > 1 && (
            <p className="note">
              📧 ¿Necesitas ayuda eligiendo? Escríbenos a{' '}
              <a href="mailto:soporte@artist-hive.com">soporte@artist-hive.com</a>
            </p>
          )}

          {/* Currency Selector */}
          {((view === 'plans' && visiblePlans.length > 0) || view !== 'plans') && (
            <div className="currency-selector-footer">
              <label>💱 Moneda:</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      {showDevOptions > 8 && (
        <div className="currency-selector-footer">
          <label>💱 Current Phase:</label>
          <select value={currentPhase} onChange={(e) => setCurrentPhase(e.target.value as Phase)}>
            {PHASES.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default PlansOfferPage;
