import { useInjectReducer as useReducer, useInjectSaga as useSaga } from '@nixjs23n6/redux-injectors';

import { InjectReducerParams, InjectSagaParams, RootStateKeyType } from './types';

export function useInjectReducer<Key extends RootStateKeyType>(params: InjectReducerParams<Key>) {
  return useReducer({ ...params, key: params.key.toString() });
}

export function useInjectSaga(params: InjectSagaParams) {
  return useSaga({ ...params, key: params.key.toString() });
}
