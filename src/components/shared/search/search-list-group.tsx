import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { ArtistModel } from "~/models/domain/artist/artist.model";

type Prop = {
  search: ArtistModel;
  type: string;
};

export const SearchListGroup: React.FC<Prop> = ({ search, type }) => (
  <ListGroup.Item className="search-item">
    <Link className="search-item__link" to={`/${type}/details/${search.id}`}>
      <img className="search-item__img" src={search.profile_pic} />
      <div className="search-item-box">
        <h4 className="search-item__title">{search.name}</h4>
        <h5 className="search-item__subtitle">{search.subtitle}</h5>
      </div>
      <VerifiedArtist verifiedStatus={search?.verified_status} />
    </Link>
  </ListGroup.Item>
);
