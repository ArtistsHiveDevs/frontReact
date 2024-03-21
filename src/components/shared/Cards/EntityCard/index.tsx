import { Card } from 'react-bootstrap';
import { AligmentVerifiedMark } from '~/constants';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import './index.scss';

const EntityCard = (props: any) => {
  const { data, idx, params } = props;
  return (
    <Card key={idx} className="entity-card">
      <div className="header-card-container">
        <p>
          {data?.profile_pic && <img className="profile-avatar" src={data.profile_pic} />}
          {!data?.profile_pic && <img className="profile-avatar" src="/src/assets/img/empty-profile.png" />}
        </p>
        <p className="header-card-name">
          <span className="card-title-label">{data.name}</span>
          <VerifiedArtist aligment={AligmentVerifiedMark.LEFT} verifiedStatus={data?.verified_status} />
          <span>{data.subtitle}</span>
        </p>
      </div>
      {!params?.hidePhoto && (
        <>
          {data?.photo && (
            <div className="container-img-card">
              <Card.Img className="img-card" src={data.photo} variant="top" />
            </div>
          )}
        </>
      )}
      <Card.Body>
        <p className="card-description">{data.description}</p>
      </Card.Body>
      <div className="card-buttons-container">
        <Card.Link className="card-link" href="#">
          Card Link
        </Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </div>
    </Card>
  );
};

export default EntityCard;
