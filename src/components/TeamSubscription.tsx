"use client"
import { useFetchActiveSubscription, useFetchSubscriptionPlans, useSubscribeAccount } from '@/services/subscriptions.service'
import { Team } from '@/type-definitions/auth'
import { Plan } from '@/type-definitions/subscriptions'
import { TeamWithOwner } from '@/type-definitions/teams'
import { Spinner } from '@chakra-ui/react'
import React from 'react'

export default function TeamsSubscription ({ team, allow }: { team?: Team | TeamWithOwner, allow?: boolean }) {
  const { data: plans } = useFetchSubscriptionPlans()
  const { data: subscription } = useFetchActiveSubscription(allow || false, team?.id)

  const { mutateAsync, isPending } = useSubscribeAccount()

  const handleButtonClick = async function (plan: Plan) {
    if (team) {
      if (plan.price === 0) {
        await mutateAsync({
          planId: plan.id,
          numberOfMonths: 1,
          teamId: team.id,
          admin: allow || false
        })
      } else {
        if (allow) {
          await mutateAsync({
            planId: plan.id,
            numberOfMonths: 2,
            teamId: team.id,
            admin: allow
          })
        } else {
          window.open("https://calendly.com/consize-demo/60min", "_blank")
        }
      }
    }
  }
  return (
    <div className='w-full overflow-y-scroll max-h-full p-4'>
      <div className='flex justify-center items-center gap-5 md:flex-row flex-col'>
        {plans && plans.map((plan) => (
          <div key={plan.id} className={`h-96 group w-72 border rounded-lg flex flex-col justify-between hover:text-white hover:bg-primary-dark p-4 ${subscription && ((typeof subscription.plan === "string" && subscription.plan === plan.id) || (typeof subscription.plan === "object" && subscription.plan.id === plan.id)) ? 'bg-primary-dark text-white' : ''}`}>
            <div className='flex-1'>
              <div className='font-semibold text-lg'>{plan.name}</div>
              <div className='text-sm'>{plan.description}</div>
            </div>

            <div className='h-12'>
              {!subscription || (typeof subscription.plan === "string" && subscription.plan !== plan.id) || (typeof subscription.plan === "object" && subscription.plan.id !== plan.id) ? <button onClick={() => handleButtonClick(plan)} className='bg-primary-app hidden group-hover:block text-sm text-primary-dark font-semibold rounded-3xl h-11 w-full'>{plan.price > 0 ? !allow ? 'Contact us' : 'Subscribe' : 'Subscribe'} {isPending && <Spinner size={'sm'} />}</button> : <div className='h-12 w-full border rounded-2xl flex items-center justify-center text-base font-bold'>
                Active subscription
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
