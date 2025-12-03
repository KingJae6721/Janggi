import { useQuery } from '@tanstack/react-query';
import { getGamesByPlayer } from '../../api/gameApi';

export const usePlayerGames = (playerName: string) => {
  return useQuery({
    queryKey: ['games', 'player', playerName],
    queryFn: () => getGamesByPlayer(playerName),
    enabled: !!playerName.trim(), // 이름이 있을 때만 실행
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
  });
};
