"use client"
import Layout from '@/layouts/PageTransition'
import { useFetchActiveSubscription, useFetchSubscriptionPlans, useSubscribeAccount } from '@/services/subscriptions.service'
import { useAuthStore } from '@/store/auth.store'
import { Plan } from '@/type-definitions/subscriptions'
import { Spinner } from '@chakra-ui/react'
import React from 'react'

export default function TeamsSettingsPage () {
  const { team } = useAuthStore()
  const { data: plans } = useFetchSubscriptionPlans()
  const { data: subscription } = useFetchActiveSubscription(team?.id)

  const { mutateAsync, isPending } = useSubscribeAccount()

  const handleButtonClick = async function (plan: Plan) {
    if (team) {
      if (plan.price === 0) {
        await mutateAsync({
          planId: plan.id,
          numberOfMonths: 1,
          teamId: team.id
        })
      } else {
        window.open("https://calendly.com/consize-demo/60min", "_blank")
      }
    }
  }
  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4'>
        <div className='flex justify-center items-center gap-5 md:flex-row flex-col'>
          {plans && plans.map((plan) => (
            <div key={plan.id} className={`h-96 group w-72 border rounded-lg flex flex-col justify-between hover:text-white hover:bg-primary-dark p-4 ${subscription && ((typeof subscription.plan === "string" && subscription.plan === plan.id) || (typeof subscription.plan === "object" && subscription.plan.id === plan.id)) ? 'bg-primary-dark text-white' : ''}`}>
              <div className='flex-1'>
                <div className='font-semibold text-lg'>{plan.name}</div>
                <div className='text-sm'>{plan.description}</div>
              </div>

              <div className='h-12'>
                {!subscription || (typeof subscription.plan === "string" && subscription.plan !== plan.id) || (typeof subscription.plan === "object" && subscription.plan.id !== plan.id) ? <button onClick={() => handleButtonClick(plan)} className='bg-primary-app hidden group-hover:block text-sm text-primary-dark font-semibold rounded-3xl h-11 w-full'>{plan.price > 0 ? 'Contact us' : 'Subscribe'} {isPending && <Spinner size={'sm'} />}</button> : <div className='h-12 w-full border rounded-2xl flex items-center justify-center text-base font-bold'>
                  Active subscription
                </div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
