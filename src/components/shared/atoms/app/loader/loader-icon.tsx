interface LoaderIconProps {
  height?: string;
  padding?: string;
}
export const LoaderIcon = (params: LoaderIconProps = {}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: params?.height || '100%',
        padding: params?.padding,
      }}
    >
      <embed src="/cintas_loader.svg" type="image/svg+xml" style={{ width: '20%' }} />
    </div>
  );
};

export default LoaderIcon;
