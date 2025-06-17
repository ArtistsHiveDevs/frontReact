import React, { useState } from 'react';
import './PlanComparator.css'; // Asegúrate de incluir los estilos darkmode aquí

type Plan = {
  name: string;
  price: number;
  features: string[];
};

const plans: Record<string, Plan> = {
  'Clave de Fa': {
    name: 'Clave de Fa',
    price: 60,
    features: ['Crear Rider Técnico', 'EPK profesional', '5 mensajes mensuales'],
  },
  'Clave de Do': {
    name: 'Clave de Do',
    price: 200,
    features: ['Todo lo anterior', 'Aplicar a festivales', 'Descuentos aliados'],
  },
  'Clave de Sol': {
    name: 'Clave de Sol',
    price: 270,
    features: ['Planeador de giras', 'Contratar con botón', 'Perfil destacado'],
  },
  'Clave de Risa': {
    name: 'Clave de Risa',
    price: 350,
    features: ['Apoyo financiero', 'Mentorías', 'Tienda premium'],
  },
};

const PlanComparator: React.FC = () => {
  const planKeys = Object.keys(plans);
  const [plan1, setPlan1] = useState(planKeys[0]);
  const [plan2, setPlan2] = useState(planKeys[1]);

  const allFeatures = Array.from(new Set([...plans[plan1].features, ...plans[plan2].features]));

  return (
    <div className="comparator">
      <div className="selectors">
        <label>
          Plan 1:
          <select value={plan1} onChange={(e) => setPlan1(e.target.value)}>
            {planKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label>
          Plan 2:
          <select value={plan2} onChange={(e) => setPlan2(e.target.value)}>
            {planKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Característica</th>
            <th>{plan1}</th>
            <th>{plan2}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Precio (USD)</td>
            <td>${plans[plan1].price}</td>
            <td>${plans[plan2].price}</td>
          </tr>
          {allFeatures.map((feature) => (
            <tr key={feature}>
              <td>{feature}</td>
              <td>{plans[plan1].features.includes(feature) ? '✔️' : ''}</td>
              <td>{plans[plan2].features.includes(feature) ? '✔️' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanComparator;
