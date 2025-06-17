import React, { useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './PlansOfferPage.scss';

type Plan = {
  name: string;
  icon?: string;
  iconRI?: string;
  basePrice: number;
  recommended?: boolean;
  features: string[];
};

const membership: Plan[] = [
  {
    name: 'Validación de perfil',
    iconRI: 'fa FaAddressCard ',
    basePrice: 2,
    features: [
      'Gestión del perfil',
      'Buscador básico',
      'Prioridad en los resultados con respecto a los perfiles no validados',
      'Generar EPK profesional (Artistas)',
      'Enviar 5 solicitudes de conexión semanales',
      'Mensajes entre perfiles validados',
      'Perfil multilingüe',
    ],
  },
];

const plans: Plan[] = [
  {
    name: 'Clave de Fa',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/FClef.svg/18px-FClef.svg.png',
    basePrice: 60,
    features: [
      'Buscador básico',
      'Crear Rider Técnico para cada formato de la banda y tipo de programa',
      'Prioridad en los resultados con respecto a los perfiles validados',
      'Enviar 20 solicitudes de conexión semanales',
    ],
  },
  {
    name: 'Clave de Do',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/CClef.svg/18px-CClef.svg.png',
    basePrice: 180,
    features: [
      'Estadísticas básicas',
      'Cotizador automático',
      'Buscador ampliado con características profesionales',
      '10 búsquedas diarias especializadas',
      'Prioridad en los resultados con respecto a los perfiles Clave de Fa',
      'Enviar 50 solicitudes de conexión semanales',
    ],
  },
  {
    name: 'Clave de Sol',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/GClef.svg/15px-GClef.svg.png',
    basePrice: 270,
    recommended: true,
    features: [
      'Enviar 100 solicitudes de conexión semanales',
      '25 búsquedas diarias especializadas',
      'Reservar salas de ensayo/estudios',
      'Planeador de giras',
      'Minutogramas para eventos',
      'Plantillas y documentos legales',
      'Aplicar a festivales y mercados',
      //   'Reputación tipo Airbnb',
      'Prioridad en los resultados con respecto a los perfiles Clave de Do',
      // 'Perfil destacado',
      'Sitio web & Tienda virtual',
      'Convenios con seguros',
      'Mensajes ilimitados',
    ],
  },
  {
    name: 'Alta frecuencia',
    iconRI: 'PiWaveform',
    basePrice: 350,
    features: [
      'Enviar solicitudes de conexión ilimitadas',
      'Búsquedas especializadas ilimitadas',
      'Apoyo financiero para giras',
      'Prioridad en los resultados con respecto a los perfiles Clave de Sol',
      'Acceso a convenios especializados como seguros',
      'Mentoría especializada',
      'Convocatorias exclusivas',
      'Soporte prioritario',
    ],
  },
];

const discounts: Record<string, number> = {
  developed: 1,
  developing: 0.6,
};

const frequencies: Record<string, { multiplier: number; label: string }> = {
  yearly: { multiplier: 1, label: '/ año' },
  quarterly: { multiplier: 0.3, label: '/ trim' },
  monthly: { multiplier: 0.1, label: '/ mes' },
  weekly: { multiplier: 0.025, label: '/ sem' },
};

const setFormattedAmount = (value: number, decimals: number) => {
  const numeroFormateado = value.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Si el número es menor que 10,000, forzar el separador de miles
  if (value < 10000) {
    return numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return numeroFormateado;
};

const PlansOfferPage: React.FC = () => {
  const [offerView, setOfferView] = useState('membership');
  const [currency, setCurrency] = useState('USD');
  const [region, setRegion] = useState('developed');
  const [frequency, setFrequency] = useState('yearly');

  return (
    <>
      <div className="plans-wrapper">
        <h1>
          {
            <span
              style={{ color: offerView !== 'membership' ? 'rgba(255, 255, 255, 0.3)' : '#fff', padding: '1rem' }}
              onClick={() => setOfferView('membership')}
            >
              Membership
            </span>
          }
          |
          {
            <span
              style={{ color: offerView !== 'planes' ? 'rgba(255, 255, 255, 0.3)' : '#fff', padding: '1rem' }}
              onClick={() => setOfferView('planes')}
            >
              Planes
            </span>
          }
        </h1>

        <div className="controls">
          <label>
            Moneda:
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="COP">COP</option>
              <option value="USD" selected>
                USD
              </option>
            </select>
          </label>
        </div>
        {offerView === 'membership' && (
          <div className="plans-container">
            {membership.map((plan) => {
              const label = frequencies['yearly'].label;

              const priceOriginal: number = plan.basePrice * (currency === 'COP' ? 4000 : 1);
              console.log(priceOriginal);

              return (
                <div key={plan.name} className={`plan ${plan.recommended ? 'recommended' : ''}`}>
                  <div className="plan-header">
                    {plan.icon && <img src={plan.icon} alt="Clave musical" />}
                    {plan.iconRI && <DynamicIcons iconName={plan.iconRI} size={30} color="white" />}
                    <h3>{plan.name}</h3>
                  </div>

                  <ul className="features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <div className="price">
                    <strong>
                      $ {setFormattedAmount(priceOriginal, currency === 'COP' ? 0 : 2)} {label}
                    </strong>
                  </div>
                  <button className="btn">Validar perfil</button>
                </div>
              );
            })}
          </div>
        )}
        {offerView === 'planes' && (
          <>
            <div className="controls">
              <label>
                Región:
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="developed">País desarrollado</option>
                  <option value="developing">País en desarrollo</option>
                </select>
              </label>
              <label>
                Frecuencia de pago:
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option value="yearly">Anual</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="monthly">Mensual</option>
                  <option value="weekly">Semanal</option>
                </select>
              </label>
            </div>

            <div className="plans-container">
              {plans.map((plan) => {
                const discount = discounts[region];
                const multiplier = frequencies[frequency].multiplier;
                const label = frequencies[frequency].label;

                const priceOriginal: number = plan.basePrice * multiplier * (currency === 'COP' ? 4000 : 1);
                const priceFinal: number = priceOriginal * discount;
                const showDiscount = priceOriginal !== priceFinal;

                const annualProfileValidation = frequency === 'yearly' ? ['Validación anual de perfil'] : [];
                return (
                  <div key={plan.name} className={`plan ${plan.recommended ? 'recommended' : ''}`}>
                    <div className="plan-header">
                      {plan.icon && <img src={plan.icon} alt="Clave musical" />}
                      {plan.iconRI && <DynamicIcons iconName={plan.iconRI} size={30} color="white" />}
                      <h3>{plan.name}</h3>
                    </div>

                    <ul className="features">
                      {[...annualProfileValidation, ...plan.features].map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                    <div className="price">
                      {showDiscount && <del>$ {setFormattedAmount(priceOriginal, currency === 'COP' ? 0 : 2)}</del>}
                      <strong>
                        $ {setFormattedAmount(priceFinal, currency === 'COP' ? 0 : 2)} {label}
                      </strong>
                    </div>
                    {showDiscount && (
                      <div className="discount-note">El primer año -{((1 - discount) * 100).toFixed(0)}%</div>
                    )}
                    <button className="btn">Elegir Plan</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PlansOfferPage;
