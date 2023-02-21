import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEventsSlice } from "~/common/slices/events";
import { selectEvents } from "~/common/slices/events/selectors";
import { useI18n } from "~/common/utils";
import MainSection from "~/components/Pages/HomePage/MainSection";
import { getCustomList, sortEventsPerMonth } from "~/constants";
import { EventModel } from "~/models/domain/event/event.model";
import "./cultural-agenda-page.scss";

const TRANSLATION_BASE_AGENDA_CULTURAL_PAGE = "";

const CulturalAgendaPage: React.FC = () => {
  // Slices
  const eventsList: EventModel[] = useSelector(selectEvents);
  const { actions: eventActions } = useEventsSlice();

  // Hooks
  const dispatch = useDispatch();
  const { translateText } = useI18n();
  const navigate = useNavigate();

  // Functions
  function onClickCardEventos(data: any) {
    console.log(data);
  }

  // Effects
  useEffect(() => {
    if (eventsList.length === 0) {
      dispatch(eventActions.loadEvents());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <hr className="hr-solid"></hr>

      <MainSection
        title={"Destacados"}
        listView={getCustomList(10, eventsList)}
        params={{ useNewCard: true }}
        callbacks={{ onClickCard: onClickCardEventos }}
      />

      <hr className="hr-solid"></hr>

      {sortEventsPerMonth(eventsList)?.map((eventCase, idx) => {
        return (
          <div key={`event-month-${idx}`}>
            <MainSection
              title={eventCase.monthName}
              titleAlign={"center"}
              listView={getCustomList(10, eventCase.data)}
              orientation={"vertical"}
              params={{ useNewCard: true }}
              callbacks={{ onClickCard: onClickCardEventos }}
            />
            <hr className="hr-solid"></hr>
          </div>
        );
      })}
    </>
  );
};

export default CulturalAgendaPage;
