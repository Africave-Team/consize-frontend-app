import { useMutation, useQuery } from '@tanstack/react-query'
import http from './base'
import { Plan, Subscription } from '@/type-definitions/subscriptions'
import { queryClient } from '@/utils/react-query'

export const useFetchSubscriptionPlans = () => useQuery<Plan[]>({
  queryKey: ["plans"],
  queryFn: async () => (await http.get({
    url: "subscriptions/plans"
  })).data
})


export const useFetchActiveSubscription = (teamId?: string) => useQuery<Subscription>({
  queryKey: ["active-subscription", teamId],
  queryFn: async () => (await http.get({
    url: `subscriptions/active/${teamId}`
  })).data
})

export const useSubscribeAccount = () => useMutation<Subscription, string, { planId: string, numberOfMonths: number, teamId: string }>({
  mutationFn: async (props) => (await http.post({
    url: "subscriptions/subscribe", body: props
  })).data,
  onSuccess: (_, { teamId }) => queryClient.invalidateQueries({ queryKey: ['active-subscription', teamId] })
})