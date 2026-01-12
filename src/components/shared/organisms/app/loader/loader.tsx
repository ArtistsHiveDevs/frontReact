import { LoaderIcon, LoaderIconProps } from '~/components/shared/atoms/app/loader/loader-icon';

export const AppLoader = (params: LoaderIconProps) => {
  return (
    <div>
      {/* Loading... */}
      <LoaderIcon {...params} />
    </div>
  );
};

export default AppLoader;
