import { ReactNode } from 'react';

interface SuccessViewProps {
  title: string;
  message: string | ReactNode;
  buttonText: string;
  onButtonClick: () => void;
}

/**
 * Componente reutilizable para mostrar mensajes de éxito
 */
export const SuccessView = ({ title, message, buttonText, onButtonClick }: SuccessViewProps) => {
  return (
    <div className="open-call-page">
      <div className="submission-success">
        <div className="success-icon">&#10003;</div>
        <h2 className="success-title">{title}</h2>
        <p className="success-message">{message}</p>
        <button className="success-btn" onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
