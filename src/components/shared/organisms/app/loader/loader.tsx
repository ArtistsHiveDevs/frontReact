import LoaderIcon from '~/components/shared/atoms/app/loader/loader-icon';

export const AppLoader = () => {
  return (
    <div>
      {/* Loading... */}
      <LoaderIcon height="100vh" />
    </div>
  );
};

export default AppLoader;
