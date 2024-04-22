import { QueryClient } from '@tanstack/react-query'


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // retry: (failureCount, error) => {
      //     // @ts-ignore
      //     if (error?.status === 401 || error?.status === 403) {
      //         return false
      //     }
      //     return failureCount <= 3 ? true : false;
      // }
    }
  }
})