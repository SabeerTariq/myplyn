import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../services/api';

export function useBadgeCounts() {
  return useQuery({
    queryKey: ['badgeCounts'],
    queryFn: () => notificationsApi.counts().then((r) => r.data.counts),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 3000,
  });
}
