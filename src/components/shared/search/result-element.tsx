import ListGroup from 'react-bootstrap/ListGroup';

import { useEffect, useState } from 'react';
import Flag from 'react-world-flags';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import { SearchableProfileTemplate } from '~/models/base';
import consts from './search-constants';
import './search.scss';

type QueryTemplate = {
  element: SearchableProfileTemplate;
  elementType: string;
  onClick?: Function;
};

export const ResultElement: React.FC<QueryTemplate> = (props: QueryTemplate) => {
  const { element, elementType, onClick } = props;

  const [imageURL, setImageURL] = useState<string>(undefined);

  const entityIndex = consts.defaultTypes.findIndex((type) => type === elementType) + 1;

  const handleClick = (element: SearchableProfileTemplate) => {
    if (onClick) {
      onClick(element);
    }
  };
  const flag = element?.country || element.place?.country;

  const flags = {
    Colombia: 'co',
    España: 'es',
    Inglaterra: 'GB-ENG',
  };

  const getProfilePicURL = async () => {
    const photoURL = element && !!element?.avatarURL ? await element.avatarURL() : element?.profile_pic;

    setImageURL(photoURL);
  };

  useEffect(() => {
    if (!!element) {
      getProfilePicURL();
    }
  }, [element]);

  return (
    <ListGroup.Item
      className={`search-item line-up-an entity-${entityIndex}-item`}
      onClick={() => handleClick(element)}
    >
      <div className="search-item__link">
        <img className="search-item__img" src={imageURL} />
        <div className="search-item-box">
          <h4 className="search-item__title">
            {element.name}
            <VerifiedArtist verifiedStatus={element?.verified_status} />
          </h4>
          <span className="search-item__subtitle">
            {element?.subtitle || (
              <>
                <span>{element?.cityWithCountry}</span>
                {'   '}
                <Flag code={flags[flag as keyof typeof flags]} height="15" style={{ border: '1px solid #999' }} />
              </>
            )}
          </span>
        </div>
      </div>
    </ListGroup.Item>
  );
};
