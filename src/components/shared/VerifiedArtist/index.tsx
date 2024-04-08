import { MdOutlineVerifiedUser, MdVerifiedUser } from 'react-icons/md';
import { AligmentVerifiedMark, VerificationStatus } from '~/constants';
import './index.scss';

const VerifiedArtist = (props: any) => {
  let { verifiedStatus, aligment, size } = props;
  const AlignMark: AligmentVerifiedMark = !!aligment ? aligment : AligmentVerifiedMark.RIGHT;

  size = size || 16;

  const switchVerifiedOptions = (status: any) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return <MdOutlineVerifiedUser size={size} />;
      case VerificationStatus.VERIFIED_AND_APPROVED:
        return <MdVerifiedUser size={size} className="full-verified" />;
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
