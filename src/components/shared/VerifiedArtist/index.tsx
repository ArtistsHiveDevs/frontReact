import { MdOutlineVerifiedUser, MdVerifiedUser } from "react-icons/md";
import { AligmentVerifiedMark, VerificationStatus } from "~/constants";
import "./index.scss";

const VerifiedArtist = (props: any) => {
  const { verifiedStatus, aligment } = props;
  const AlignMark: AligmentVerifiedMark = !!aligment
    ? aligment
    : AligmentVerifiedMark.RIGHT;

  const switchVerifiedOptions = (status: any) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return <MdOutlineVerifiedUser size={25} />;
      case VerificationStatus.VERIFIED_AND_APPROVED:
        return <MdVerifiedUser size={25} className="full-verified" />;
      default:
        return null;
    }
  };
  return (
    <span className="verified-container" style={{ textAlign: `${AlignMark}` }}>
      {switchVerifiedOptions(verifiedStatus)}
    </span>
  );
};

export default VerifiedArtist;
