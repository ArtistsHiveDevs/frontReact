interface NoArtistProfileViewProps {
  title: string;
  message: string;
}

/**
 * Componente para mostrar cuando el usuario no tiene perfil de artista
 */
export const NoArtistProfileView = ({ title, message }: NoArtistProfileViewProps) => {
  return (
    <div className="open-call-page">
      <div className="open-call-header">
        <h1 className="open-call-title">{title}</h1>
        <p className="open-call-subtitle">{message}</p>
      </div>
    </div>
  );
};
