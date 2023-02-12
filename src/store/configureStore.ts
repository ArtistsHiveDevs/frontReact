import { configureStore, StoreEnhancer } from "@reduxjs/toolkit";
import { createInjectorsEnhancer } from "@nixjs23n6/redux-injectors";
import createSagaMiddleware from "redux-saga";

import { createReducer } from "./root-reducer";

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ] as StoreEnhancer[];

  const store = configureStore({
    reducer: createReducer(),
    // TODO verify serializable at store
    middleware: (defaultMiddleware) => [...defaultMiddleware({serializableCheck: false}), ...middlewares],
    devTools: process.env.NODE_ENV === "development",
    enhancers,
  });

  return store;
}
