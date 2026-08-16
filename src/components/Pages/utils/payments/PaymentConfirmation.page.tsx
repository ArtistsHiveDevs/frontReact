import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';

// El correo de confirmación de pago lo envía Wompi/backend; aquí solo regresamos a Payment para una nueva venta.
const PaymentConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const id = searchParams.get(URL_PARAMETER_NAMES.ELEMENT_ID);
    if (id) {
      navigate(`/${PATHS.PAYMENTS}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return <AppLoader />;
};

export default PaymentConfirmationPage;
