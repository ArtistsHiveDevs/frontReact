import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { SearchableTemplate } from "~/models/base";

type QueryTemplate = {
  search: SearchableTemplate;
  type: string;
};

export const SearchListGroup: React.FC<QueryTemplate> = ({ search, type }) => (
  <ListGroup.Item className="search-item line-up-an">
    <Link className="search-item__link" to={`/${type}/details/${search.id}`}>
      <img className="search-item__img" src={search?.profile_pic} />
      <div className="search-item-box">
        <h4 className="search-item__title">{search.name}</h4>
        <h5 className="search-item__subtitle">{search?.subtitle}</h5>
      </div>
      <VerifiedArtist verifiedStatus={search?.verified_status} />
    </Link>
  </ListGroup.Item>
);
