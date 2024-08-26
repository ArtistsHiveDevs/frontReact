import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './saved-list-page.scss';

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE = 'app.pages.domain.AcademiesPages.AcademiesDetailsPage';
const TRANSLATION_BASE_SEARCH = 'app.appbase.search';

const SavedListPage = () => {
  // const { translateText, locale } = useI18n();
  // const navigate = useNavigate();

  // const [open, setOpen] = useState([]);
  // const MAX_RESULTS_PER_PAGE = 40;

  // const subPagesInfo = [...SAVED_LIST_PAGE_CONFIG];

  // // Slices
  // const favouritesList: SavedModel[] = useSelector(selectorSavedFavourites.selectItems);
  // const { actions: searchActions } = useSearchSlice();
  // const { actions: savedActions } = useSavedFavouritesSlice();

  // // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    // // dispatch(savedActions.querySaved('asdasd'));
    // console.log('### % % consultando');
    // dispatch(searchActions.querySearch('Club'));
    // console.log('saved....');
    // if (favouritesList) {
    //   console.log('pidiendo favoritos');
    // }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log('#### ', favouritesList);
  //   setOpen(favouritesList?.likedEntities?.map((entityName, index) => index === 0) || []);
  // }, [favouritesList]);

  // const handlers = {
  //   onClickGalleryImage: (source: GalleryImageParams, images: GalleryImageParams[]) => {
  //     const image = <ImageGallery images={images} imageSize="fs" />;
  //   },
  //   onCloseGalleryImage: (value: any) => {},
  //   onClickNextEvent: (value: any) => {
  //     navigateTo(PATHS.EVENTS, value.id);
  //   },
  //   onClickPastEvent: (value: any) => {
  //     navigateTo(PATHS.EVENTS, value.id);
  //   },
  // };

  // function navigateTo(newEntity: PATHS, id: string = null) {
  //   navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  // }

  // function translate(text: string) {
  //   return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  // }

  // // Data config
  // const tabs: TabbedPage[] = subPagesInfo.map((subpage: ProfileDetailsSubpage) => {
  //   return {
  //     name: subpage.name,
  //     tabContent: () => {
  //       return <h2>subpage: {subpage.name}</h2>;
  //     },
  //   };
  // });

  // console.log('>>>  ####   ', favouritesList, 'DDñ');
  // const emptyResults = () => {
  //   let emptyContent = <></>;
  //   if (favouritesList?.totalResults === 0) {
  //     emptyContent = (
  //       <article>
  //         <h3>{translate('empty_results.title')}</h3>
  //         <p>{translate('empty_results.suggestions.statement')}</p>
  //         <ul>
  //           <li>{translate('empty_results.suggestions.spelling')}</li>
  //           <li>{translate('empty_results.suggestions.less_words')}</li>
  //           <li>{translate('empty_results.suggestions.related_things')}</li>
  //         </ul>
  //       </article>
  //     );
  //   }
  //   return emptyContent;
  // };

  return (
    <>
      <h1>My favourites</h1>

      {/* {favouritesList &&
        (favouritesList.likedEntities || []).map((entityName, entityIndex) => {
          const entityColorIndex =
            consts.defaultTypes.findIndex((type) => type.toLowerCase() === entityName.toLowerCase()) + 1;

          return (
            <section key={`section-${entityIndex}-${entityName}`}>
              <div
                className={`group-title-icon  entity-${entityColorIndex}-item`}
                onClick={() => {
                  const newObjectValues = [...open];
                  newObjectValues[entityIndex] = !newObjectValues[entityIndex];
                  setOpen(newObjectValues);
                }}
              >
                <h3 className="main-section-title">
                  {translate(`types.${entityName.toUpperCase()}`)} (
                  {favouritesList.pagination[`total_${entityName}` as keyof typeof favouritesList.pagination]})
                </h3>
                <DynamicIcons iconName="AiOutlineDown" size="20" />
              </div>
              <Collapse in={open[entityIndex]}>
                <div id="example-collapse-text-2">
                  <article className="day-forecast">
                    {(favouritesList[entityName as keyof typeof favouritesList] || [])
                      .slice(0, MAX_RESULTS_PER_PAGE)
                      .map((entityObject: SavedTemplate, objectIndex: number) => (
                        <div
                          className="result-element-container"
                          key={`result-${entityName}-${objectIndex}-${entityObject.id}`}
                          // onClick={() => handleResultOnClick(entityObject)}
                        >
                          <ResultElement element={entityObject} elementType={entityName} />
                        </div>
                      ))}
                  </article>
                </div>
              </Collapse>
            </section>
          );
        })} */}
    </>
  );
};

export default SavedListPage;
