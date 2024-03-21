import { useContext } from 'react';
import { AuthContext } from '~/common/context';

export const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
