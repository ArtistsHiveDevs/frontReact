interface LoaderIconProps {
  height?: string;
  padding?: string;
  fullHeight?: boolean; // Nueva prop para ocupar todo el alto disponible
  iconSize?: string; // Tamaño del icono SVG
}

export const LoaderIcon = (params: LoaderIconProps = {}) => {
  const { height, padding, fullHeight = true, iconSize = '40%' } = params;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height || (fullHeight ? '100vh' : '100%'),
        width: '100%',
        padding: padding || '2rem',
      }}
    >
      <embed src="/cintas_loader.svg" type="image/svg+xml" style={{ width: iconSize, maxWidth: '15rem' }} />
    </div>
  );
};

export default LoaderIcon;
