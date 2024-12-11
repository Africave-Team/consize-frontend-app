import { useMutation, useQuery } from '@tanstack/react-query'
import http from './base'
import adminHttp from './admin/base'
import { Plan, Subscription } from '@/type-definitions/subscriptions'
import { queryClient } from '@/utils/react-query'

export const useFetchSubscriptionPlans = () => useQuery<Plan[]>({
  queryKey: ["plans"],
  queryFn: async () => (await http.get({
    url: "subscriptions/plans"
  })).data
})


export const useFetchActiveSubscription = (admin: boolean, teamId?: string) => useQuery<Subscription>({
  queryKey: ["active-subscription", teamId],
  queryFn: async () => (admin ? await adminHttp.get({
    url: `company/${teamId}/active-subscription`
  }) : await http.get({
    url: `subscriptions/active`
  })).data
})

export const useSubscribeAccount = () => useMutation<Subscription, string, { planId: string, numberOfMonths: number, teamId: string, admin: boolean }>({
  mutationFn: async (props) => (props.admin ? await adminHttp.post({
    url: `company/${props.teamId}/activate-subscription`, body: props
  }) : await http.post({
    url: "subscriptions/subscribe", body: props
  })).data,
  onSuccess: (_, { teamId }) => queryClient.invalidateQueries({ queryKey: ['active-subscription', teamId] })
})



export const useExtendSubscription = () => useMutation<Subscription, string, { planId: string, numberOfMonths: number, teamId: string, admin: boolean }>({
  mutationFn: async (props) => (props.admin ? await adminHttp.post({
    url: `company/${props.teamId}/extend-subscription`, body: props
  }) : await http.post({
    url: "subscriptions/extend-subscription", body: props
  })).data,
  onSuccess: (_, { teamId }) => queryClient.invalidateQueries({ queryKey: ['active-subscription', teamId] })
})