
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
      // cacheTime: 10 * 60 * 1000, // 10분간 메모리 보관
      retry: 1, // 실패 시 1번 재시도
      refetchOnWindowFocus: true, // 탭 전환 시 자동 갱신
    },
  },
});