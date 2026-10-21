import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfileApi } from '../services/apiClient';
import useClientStore from '../store/useClientStore';

/**
 * Custom hook using TanStack React Query for user profile server state.
 */
export function useUserProfileQuery(userId) {
  const queryClient = useQueryClient();
  const updateUserStore = useClientStore((s) => s.updateUser);

  const profileQuery = useQuery({
    queryKey: ['user-profile', userId || 'me'],
    queryFn: () => fetchUserProfile(userId),
    staleTime: 1000 * 60 * 5
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => updateUserProfileApi(profileData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['user-profile', userId || 'me'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['entrepreneur-matches'] });
      if (updatedProfile) {
        updateUserStore(updatedProfile);
      }
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    isSuccess: updateProfileMutation.isSuccess
  };
}

export default useUserProfileQuery;
