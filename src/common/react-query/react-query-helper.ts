import { useQuery, QueryClient, useMutation, QueryClientProvider } from 'react-query';

// constants
const defaultConfig = {
  retry: false,
  enabled: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

// https://react-query.tanstack.com/reference/QueryClientProvider#_top
const queryClient = new QueryClient();

export { queryClient, QueryClientProvider as ReactQueryProvider };

// https://react-query.tanstack.com/reference/QueryClient#queryclientgetquerydata
export function ahgetQueryData(queryKey: any) {
  const queryData = queryClient.getQueryData(queryKey);

  return queryData;
}

// https://react-query.tanstack.com/reference/QueryClient#queryclientsetquerydata
export function ahSetQueryData(queryKey: any, updater: any) {
  queryClient.setQueryData(queryKey, updater);
}

// https://react-query.tanstack.com/guides/queries#_top
export function ahUseQuery({ key, service, config = defaultConfig }: { key: any; service: any; config: any }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(key, service, config);
}

// https://react-query.tanstack.com/guides/mutations
export function ahUseMutation({ service, config = {} }: { service: any; config: {} }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMutation(service, {
    ...config,
  });
}
