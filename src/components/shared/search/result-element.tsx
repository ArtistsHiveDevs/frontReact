import ListGroup from "react-bootstrap/ListGroup";

import Flag from "react-world-flags";
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
  const flag = element?.country || element.place?.country;

  const flags = {
    Colombia: "co",
    España: "es",
    Inglaterra: "GB-ENG",
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
          <h5>
            {element?.subtitle || (
              <>
                <span className="search-item__subtitle">
                  {element?.cityWithCountry}
                </span>
                {"   "}
                <Flag
                  code={flags[flag as keyof typeof flags]}
                  height="15"
                  style={{ border: "1px solid #999" }}
                />
              </>
            )}
          </h5>
        </div>
      </div>
    </ListGroup.Item>
  );
};
