import ListGroup from "react-bootstrap/ListGroup";

import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { SearchableTemplate } from "~/models/base";
import consts from "./search-constants";
import "./search.scss";

type QueryTemplate = {
  element: SearchableTemplate;
  elementType: string;
  onClick?: Function;
};

export const ResultElement: React.FC<QueryTemplate> = (
  props: QueryTemplate
) => {
  const { element, elementType, onClick } = props;

  const entityIndex =
    consts.defaultTypes.findIndex((type) => type === elementType) + 1;

  const handleClick = (element: SearchableTemplate) => {
    if (onClick) {
      onClick(element);
    }
  };
  return (
    <ListGroup.Item
      className={`search-item line-up-an entity-${entityIndex}-item`}
      onClick={() => handleClick(element)}
    >
      <div className="search-item__link">
        <img className="search-item__img" src={element?.profile_pic} />
        <div className="search-item-box">
          <h4 className="search-item__title">
            {element.name}
            <VerifiedArtist verifiedStatus={element?.verified_status} />
          </h4>
          <h5 className="search-item__subtitle">
            {element?.subtitle || element?.cityWithCountry}
          </h5>
        </div>
      </div>
    </ListGroup.Item>
  );
};
