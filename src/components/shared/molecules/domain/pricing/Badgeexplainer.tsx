import React from 'react';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import { VerificationStatus } from '~/constants';
import './BadgeExplainer.scss';

const BadgeExplainer: React.FC = () => {
  return (
    <div className="badge-explainer">
      <div className="explainer-grid">
        <div className="explainer-card">
          <h3>
            <VerifiedArtist verifiedStatus={VerificationStatus.VERIFIED_AND_APPROVED} size={30} /> Badge de Verificación
          </h3>
          <p className="description">
            Tu identificación oficial en la comunidad. Indica confiabilidad y visibilidad de tu perfil.
          </p>
          <ul>
            <li>
              <strong>¿Duración?:</strong> 1 año exacto (No se puede prorratear)
            </li>
            <li>
              <strong>¿Costo?:</strong> $5/año por separado o incluido en planes anuales
            </li>
            <li>
              <strong>¿Qué permite?:</strong> Otros usuarios te ven como confiable y verificado, permite que ellos
              puedan interactuar contigo.
            </li>
          </ul>
        </div>

        <div className="explainer-card">
          <h3>🎵 Plan</h3>
          <p className="description">
            Suscripción que permite acceso a diferentes funcionalidades en las que Artist Hive ayuda a facilitar los
            proceso de la industria musical
          </p>
          <ul>
            <li>
              <strong>¿Duración?: </strong> Según frecuencia de pago (semanal, mensual, trimestral, semestral o anual.)
            </li>
            <li>
              <strong>¿Costo?:</strong> Según plan y el cantidad de personas en el crew del proyecto musical.
            </li>
            <li>
              <strong>¿Qué permite?:</strong> Interactuar con otros usuarios, enviar solicitudes, usar herramientas,
              acceder a las funcionalidades contratadas.
            </li>
          </ul>
        </div>
      </div>

      <div className="rules">
        <h4>Importante:</h4>
        <div className="rule">
          <span className="rule-number">1</span>
          <p>
            <strong>
              Sin verificación <VerifiedArtist verifiedStatus={VerificationStatus.VERIFIED_AND_APPROVED} size={30} /> =
              Sin interacción
            </strong>{' '}
            (aunque tengas plan, aplica para planes que no se han contratado de manera anual)
          </p>
        </div>
        <div className="rule">
          <span className="rule-number">2</span>
          <p>
            <strong>
              Con verificación <VerifiedArtist verifiedStatus={VerificationStatus.VERIFIED_AND_APPROVED} size={30} />{' '}
              pero sin plan = Solo visibilidad
            </strong>{' '}
            (otros te ven, tú no puedes actuar)
          </p>
        </div>
        <div className="rule">
          <span className="rule-number">3</span>
          <p>
            <strong>
              Verificación <VerifiedArtist verifiedStatus={VerificationStatus.VERIFIED_AND_APPROVED} size={30} /> + Plan
              = Acceso completo a las funcionalidades contratadas
            </strong>
          </p>
        </div>
      </div>

      <div className="example">
        <h4>Ejemplo:</h4>
        <p>
          Imagina que tienes un plan activo (contratado mensualmente o un período inferior a un año), pero tu
          verificación expiró.
        </p>
        <p>
          {' '}
          <strong>Resultado:</strong> No puedes enviar solicitudes ni interactuar con otros usuarios, aunque estés
          pagando el plan. Los demás usuarios deben tener certeza que están interactuando con tu proyecto musical y que
          está al día y con datos de contacto actualizados.
        </p>
      </div>
    </div>
  );
};

export default BadgeExplainer;
