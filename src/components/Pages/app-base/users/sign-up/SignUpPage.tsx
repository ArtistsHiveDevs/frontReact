import { ParametrizedIFrame } from "~/components/shared/molecules/general/parametrizedIFrame/parametrizedIFrame";
import "./SignUpPage.scss";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeojAvL-eNV4BcpptuZuMwN8rwVWUsMedV_EoeRnxCddhez0Q/viewform?embedded=true";

export const SignUpPage = () => {
  return (
    <ParametrizedIFrame
      srcUrl={`${FORM_URL}`}
      customHeight="1000rem"
      customWidth="100%"
    />
  );
};

export default SignUpPage;
