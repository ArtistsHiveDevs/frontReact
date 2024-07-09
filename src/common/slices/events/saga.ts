import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';
import { EventModel } from '~/models/domain/event/event.model';

import { eventsActions as actions } from '.';
import { selectApiKey } from '../app-base/APIKey/selectors';
import { selectEvents } from './selectors';

export function* getEvents() {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/events`;

  try {
    const events: EventModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.eventLoaded(events));
  } catch (err) {
    console.log(err);
  }
}

export function* getEventById(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload: requestedEventID } = actionParams;
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/events/${requestedEventID}`;

  try {
    const previousEvents: EventModel[] = yield select(selectEvents);
    const previousEvent = previousEvents.find((event) => event.id === requestedEventID);

    let eventById: EventModel = undefined;
    if (previousEvent) {
      eventById = previousEvent;
    } else {
      eventById = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });
    }

    yield put(actions.eventByIdLoaded(eventById));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

export function* getQueriedEvents(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload } = actionParams;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/events?q=${payload}`;

  try {
    const events: EventModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.queriedEvents(events));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
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
  yield takeLatest(actions.queryEvents.type, getQueriedEvents);
  yield takeLatest(actions.getEventById.type, getEventById);
}
