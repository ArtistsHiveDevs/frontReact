import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEventsSlice } from "~/common/slices/events";
import { selectEvents } from "~/common/slices/events/selectors";
import { useI18n } from "~/common/utils";
import {
  findEventsPerArtist,
  findEventsPerDate,
  findEventsPerGenre,
  mapStringArrayForListType,
  searchGenresFromEvents,
} from "~/common/utils/object-utils/object-utils-index";
import MainSection from "~/components/Pages/HomePage/MainSection";
import FilterBarComponent from "~/components/shared/organisms/FilterBar/filter-bar";
import {
  PATHS,
  SUB_PATHS,
  getCustomList,
  sortEventsPerMonth,
} from "~/constants";
import { SearchableTemplate } from "~/models/base";
import { EventModel } from "~/models/domain/event/event.model";
import "./cultural-agenda-page.scss";

const TRANSLATION_BASE_AGENDA_CULTURAL_PAGE = "app.pages.domain.CulturalAgenda";

const CulturalAgendaPage: React.FC = () => {
  // Slices
  const eventsList: EventModel[] = useSelector(selectEvents);
  const { actions: eventActions } = useEventsSlice();

  // Hooks
  const dispatch = useDispatch();
  const { translateText } = useI18n();
  const navigate = useNavigate();
  const defaultFilteredList: EventModel[] = null;
  const [filteredList, updateFilteredList] = useState(defaultFilteredList);

  // Functions
  function onClickCardEventos(data: any) {
    navigate(`${PATHS.EVENTS}/${SUB_PATHS.ELEMENT_DETAILS}/${data.id}`);
  }

  function onFilterCategoriesAction(categorie: string) {
    if (categorie !== "default") {
      updateFilteredList(findEventsPerGenre(eventsList, categorie));
    } else {
      updateFilteredList(null);
    }
  }

  function onFilterDateAction(date: string) {
    if (date?.length) {
      updateFilteredList(findEventsPerDate(eventsList, date));
    } else {
      updateFilteredList(null);
    }
  }

  function onFilterResetAction() {
    updateFilteredList(null);
  }

  function onFilterSearchAction(search: SearchableTemplate) {
    updateFilteredList(findEventsPerArtist(eventsList, search));
  }

  // Effects
  useEffect(() => {
    if (eventsList.length === 0) {
      dispatch(eventActions.loadEvents());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Constants and variables
  const genresList = searchGenresFromEvents(eventsList);
  const formattedCategoriesList = mapStringArrayForListType(genresList);

  return (
    <>
      <h1 className="agenda-title">
        {translateText(`${TRANSLATION_BASE_AGENDA_CULTURAL_PAGE}.title`)}
      </h1>
      {!filteredList && (
        <MainSection
          title={"Destacados"}
          listView={getCustomList(10, eventsList)}
          params={{ useNewCard: true }}
          callbacks={{ onClickCard: onClickCardEventos }}
        />
      )}

      <FilterBarComponent
        categories={formattedCategoriesList}
        callbacks={{
          categories: onFilterCategoriesAction,
          date: onFilterDateAction,
          reset: onFilterResetAction,
          search: onFilterSearchAction,
        }}
      />

      {sortEventsPerMonth(filteredList || eventsList)?.map((eventCase, idx) => {
        return (
          <MainSection
            key={`event-month-${idx}`}
            title={eventCase.monthName}
            titleAlign={"center"}
            listView={getCustomList(10, eventCase.data)}
            orientation={"vertical"}
            params={{ useNewCard: true }}
            cardOpts={{ printDayOfWeek: true }}
            callbacks={{ onClickCard: onClickCardEventos }}
          />
        );
      })}
    </>
  );
};

export default CulturalAgendaPage;
