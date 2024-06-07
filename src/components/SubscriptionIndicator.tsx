import { useFetchActiveSubscription, useFetchSubscriptionPlans, useSubscribeAccount } from '@/services/subscriptions.service'
import { useAuthStore } from '@/store/auth.store'
import { Skeleton } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function SubscriptionIndicator () {
  const { team } = useAuthStore()
  const { data: subscription, isLoading } = useFetchActiveSubscription(team?.id)
  const { data: plans } = useFetchSubscriptionPlans()
  const { mutateAsync, isPending } = useSubscribeAccount()
  useEffect(() => {
    if (subscription) {
      useAuthStore.setState({ subscription })
    } else {
      let plan = plans?.find(e => e.price === 0)
      if (plan && team) {
        mutateAsync({
          planId: plan.id,
          numberOfMonths: 24,
          teamId: team.id
        })
      }
    }
  }, [subscription, plans])
  if (isLoading || isPending) {
    return (
      <Skeleton className='w-32 h-10 rounded-3xl' />
    )
  }
  return (
    <Link className={`w-32 border rounded-3xl flex justify-center items-center h-10 font-semibold bg-primary-dark text-white`} href="/dashboard/settings/subscriptions">
      {typeof subscription?.plan === "string" ? subscription?.plan : subscription?.plan.name}
    </Link>
  )
}
