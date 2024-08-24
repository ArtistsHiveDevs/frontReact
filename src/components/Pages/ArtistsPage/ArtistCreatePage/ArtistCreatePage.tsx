import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { URL_PARAMETER_NAMES } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
} from '../ArtistDetails/config-artist-detail';

const ArtistsCreatePage = () => {
  const { navigateToEntity } = useNavigation();
  const dispatch = useDispatch();
  const urlParameters = useParams();

  const [artistId, setCurrentArtistId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);

  const { actions: artistsActions } = useArtistsSlice();

  const selectArtistById = selectorArtists.makeSelectItemById();
  const currentArtist: ArtistModel = useSelector((state: RootState) => {
    if (artistId) {
      return selectArtistById(state, artistId);
    } else {
      return undefined;
    }
  });

  useEffect(() => {
    dispatch(artistsActions.getArtistById(artistId));
  }, [artistId]);

  useEffect(() => {
    if (artistId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentArtistId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters]);

  useEffect(() => {
    const langsOR = [
      { label: 'ES', value: 'es', selected: false },
      { label: 'DE', value: 'de' },
      { label: 'FR', value: 'fr' },
      { label: 'PT', value: 'pt' },
    ];
    let langs = [...langsOR];

    Array(20)
      .fill('x')
      .forEach((valu, number) =>
        langsOR.forEach((lng) =>
          langs.push({
            label: `${lng.label}${number}`,
            value: `${lng.value}${number}`,
            selected: Math.random() > 1 - 90 / 100,
          })
        )
      );

    updateAvailableLanguages(langs);
    updateAvailableGenres([
      { label: 'Cumbia', value: 'genre1' },
      { label: 'Reggaetón', value: 'genre2' },
      { label: 'Rock', value: 'genre3', selected: true },
      { label: 'Jazz', value: 'genr4' },
    ]);
  }, []);

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log('#####----------->>>>  !!! ', data);
      navigateToEntity({ entityType: ArtistModel.name, id: currentArtist?.identifier || 'nuevo-elemento' });
    },
    onChangecountry: (data: any) => {
      console.log('#####----------->>>>  !!! ', data);
      // const ciudades =
      //   !!data &&
      //   !!data.value &&
      //   Object.keys(provincias).indexOf(data?.value) >= 0
      //     ? provincias[data.value as keyof typeof provincias]
      //     : [];
      // const provinceField = fields.find(
      //   (fieldData) => fieldData.fieldName === "province"
      // );
      // provinceField.options = ciudades;
      // // provinceField.defaultValue =
      // //   (ciudades && ciudades.length && ciudades[1].value) || "";

      // updateFields(fields);
      // updateCiudades(ciudades);
    },
  };

  return (
    <>
      <DynamicTabbedForm
        tabsInfo={ARTIST_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
        entityType={ArtistModel.name}
        elementData={currentArtist}
        fieldOptions={{
          genres: availableGenres,
          arts_languages: availableLanguages,
          spoken_languages: availableLanguages,
          stage_languages: availableLanguages,
        }}
        submitLabel={!currentArtist ? 'create' : 'save'}
      />
    </>
  );
};

export default ArtistsCreatePage;
