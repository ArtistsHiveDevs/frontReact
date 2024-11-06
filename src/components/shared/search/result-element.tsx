import ListGroup from 'react-bootstrap/ListGroup';

import { Avatar } from '@mui/material';
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

  const flag =
    element?.location && Array.isArray(element.location)
      ? element?.location[0]?.country_alpha2
      : typeof element?.country === 'object' && element?.country !== null
      ? element?.country.alpha2
      : typeof element?.country === 'string'
      ? element?.country
      : element?.place?.country_alpha2;

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
        <Avatar
          src={imageURL}
          alt={element?.name}
          // sx={{ width: avatarSize, height: avatarSize, border: '2px solid white' }}
          // className={errors && errors['profile_pic'] && 'error-profile-pic'}
        />
        <div className="search-item-box">
          <h4 className="search-item__title">
            {element.name} <VerifiedArtist verifiedStatus={element?.verified_status} />
          </h4>
          <span className="search-item__subtitle">
            {element?.subtitle || (
              <>
                <span className="search-item__subtitle_text">{element?.cityWithCountry}</span>
                {'   '}
                <Flag code={flag} height="15" style={{ border: '1px solid #999' }} />
              </>
            )}
          </span>
        </div>
      </div>
    </ListGroup.Item>
  );
};
