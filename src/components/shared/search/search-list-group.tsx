import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

import { ArtistModel } from "~/constants";
import VerifiedArtist from "~/components/shared/VerifiedArtist";

type Prop = {
  search: ArtistModel;
};

export const SearchListGroup: React.FC<Prop> = ({ search }) => (
  <ListGroup.Item className="search-item">
    <Link className="search-item__link" to={`/artist/detail/${search.id}`}>
      <img className="search-item__img" src={search.profile_pic} />
      <div className="search-item-box">
        <h4 className="search-item__title">{search.name}</h4>
        <h5 className="search-item__subtitle">{search.subtitle}</h5>
      </div>
      <VerifiedArtist verifiedStatus={search?.verified_status} />
    </Link>
  </ListGroup.Item>
);
