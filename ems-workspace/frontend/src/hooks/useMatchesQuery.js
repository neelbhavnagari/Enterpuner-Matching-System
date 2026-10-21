import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMatches, calculateMlMatch } from '../services/apiClient';

/**
 * Custom hook using TanStack React Query for managing server state
 * related to Entrepreneur match recommendations.
 */
export function useMatchesQuery() {
  const queryClient = useQueryClient();

  const matchesQuery = useQuery({
    queryKey: ['entrepreneur-matches'],
    queryFn: fetchMatches,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  const recalculateMatchesMutation = useMutation({
    mutationFn: calculateMlMatch,
    onSuccess: (data) => {
      // Invalidate and refetch matches after recalculation
      queryClient.invalidateQueries({ queryKey: ['entrepreneur-matches'] });
    }
  });

  return {
    matches: matchesQuery.data || [],
    isLoading: matchesQuery.isLoading,
    isError: matchesQuery.isError,
    error: matchesQuery.error,
    refetchMatches: matchesQuery.refetch,
    recalculateMatches: recalculateMatchesMutation.mutate,
    isCalculating: recalculateMatchesMutation.isPending
  };
}

export default useMatchesQuery;
