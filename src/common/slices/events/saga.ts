import { call, put, takeLatest, delay } from "redux-saga/effects";

import { request } from "~/common/utils/request";
import { EventModel } from "~/models/domain/event/event.model";

import { eventsActions as actions } from ".";

export function* getEvents() {
  yield delay(500);
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/events`;

  try {
    const events: EventModel[] = yield call(request, requestURL);

    yield put(actions.eventLoaded(events));
  } catch (err) {
    console.log(err);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* eventSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadEvents.type, getEvents);
}
