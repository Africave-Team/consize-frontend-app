"use client"
import { useExtendSubscription, useFetchActiveSubscription, useFetchSubscriptionPlans, useSubscribeAccount } from '@/services/subscriptions.service'
import { Team } from '@/type-definitions/auth'
import { Plan, SubscriptionStatus } from '@/type-definitions/subscriptions'
import { TeamWithOwner } from '@/type-definitions/teams'
import { Input, InputGroup, InputLeftElement, InputRightElement, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spinner } from '@chakra-ui/react'
import moment from 'moment'
import React, { useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

export default function TeamsSubscription ({ team, allow }: { team?: Team | TeamWithOwner, allow?: boolean }) {
  const { data: plans } = useFetchSubscriptionPlans()
  const { data: subscription } = useFetchActiveSubscription(allow || false, team?.id)
  const [totalMonths, setTotalMonths] = useState(2)
  const { mutateAsync, isPending } = useSubscribeAccount()
  const { mutateAsync: _extendMutation, isPending: _extending } = useExtendSubscription()
  const increment = (val: number) => setTotalMonths(val + 1)
  const decrement = (val: number) => setTotalMonths(val === 1 ? val : val - 1)

  const handleButtonClick = async function (plan: Plan, extend: boolean) {
    if (team) {
      if (extend) {
        await _extendMutation({
          planId: plan.id,
          numberOfMonths: totalMonths,
          teamId: team.id,
          admin: allow || false
        })
      } else {
        if (plan.price === 0) {
          await mutateAsync({
            planId: plan.id,
            numberOfMonths: totalMonths,
            teamId: team.id,
            admin: allow || false
          })
          return
        }
        if (!allow) {
          window.open("https://calendly.com/consize-demo/60min", "_blank")
          return
        }
        await mutateAsync({
          planId: plan.id,
          numberOfMonths: totalMonths,
          teamId: team.id,
          admin: allow || false
        })
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
              <Popover>
                <PopoverTrigger>
                  {!subscription || (typeof subscription.plan === "string" && subscription.plan !== plan.id) || (typeof subscription.plan === "object" && subscription.plan.id !== plan.id) ?
                    <button className='bg-primary-app text-sm text-primary-dark font-semibold rounded-3xl h-11 w-full'>
                      {plan.price > 0 ? !allow ? 'Contact us' : 'Subscribe' : 'Subscribe'}
                    </button> :
                    <button className='h-12 w-full border rounded-2xl flex items-center justify-center text-base font-bold'>
                      Active subscription
                    </button>}
                </PopoverTrigger>
                <PopoverContent className='bg-primary-dark text-white'>
                  <PopoverCloseButton />
                  <PopoverHeader>
                    {/* @ts-ignore */}
                    {subscription && subscription.status === SubscriptionStatus.ACTIVE && subscription.plan.id === plan.id ? "Subscription Extension" : "Subscription Duration"}
                  </PopoverHeader>
                  <PopoverBody>
                    {/* @ts-ignore */}
                    {subscription && subscription.status === SubscriptionStatus.ACTIVE && subscription.plan.id === plan.id && <div>
                      Subscription expires on <b>{moment(subscription.expires).format('DD-MM-yyyy')}</b>
                    </div>}
                    {/* @ts-ignore */}
                    {subscription && subscription.status === SubscriptionStatus.ACTIVE && subscription.plan.id === plan.id ? <>
                      <div>Extend subscription by x months</div>
                      <InputGroup className='w-full'>
                        <InputRightElement className=' flex rounded-r-md'>
                          <button onClick={() => increment(totalMonths)} type="button" className='h-full border-l px-3 '>
                            <FiPlus />
                          </button>

                        </InputRightElement>
                        <InputLeftElement className=' flex rounded-r-md'>
                          <button onClick={() => decrement(totalMonths)} type="button" className='border-r rounded-l-md h-full px-3'>
                            <FiMinus />
                          </button>
                        </InputLeftElement>
                        <Input type='number' className='text-center' onChange={(e) => setTotalMonths(e.target.valueAsNumber)} id="totalMonths" name="totalMonths" placeholder='0' value={totalMonths} />
                      </InputGroup>
                    </> : <>
                      Subscribe to this plan for x months
                      <InputGroup className='w-full'>
                        <InputRightElement className=' flex rounded-r-md'>
                          <button onClick={() => increment(totalMonths)} type="button" className='h-full border-l px-3 '>
                            <FiPlus />
                          </button>

                        </InputRightElement>
                        <InputLeftElement className=' flex rounded-r-md'>
                          <button onClick={() => decrement(totalMonths)} type="button" className='border-r rounded-l-md h-full px-3'>
                            <FiMinus />
                          </button>
                        </InputLeftElement>
                        <Input type='number' className='text-center' onChange={(e) => setTotalMonths(e.target.valueAsNumber)} id="totalMonths" name="totalMonths" placeholder='0' value={totalMonths} />
                      </InputGroup>
                    </>}
                    {/* @ts-ignore */}
                    <button onClick={() => handleButtonClick(plan, subscription && subscription.status === SubscriptionStatus.ACTIVE && subscription.plan.id === plan.id)} className='h-11 rounded-3xl mt-4 bg-primary-app text-primary-dark font-semibold w-full flex justify-center items-center gap-3'>
                      Continue {(isPending || _extending) && <Spinner size={'sm'} />}
                    </button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* : <button onClick={() => window.open("https://calendly.com/consize-demo/60min", "_blank")} className='bg-primary-app text-sm text-primary-dark font-semibold rounded-3xl h-11 w-full'>
                {plan.price > 0 ? !allow ? 'Contact us' : 'Subscribe' : 'Subscribe'}
                {isPending && <Spinner size={'sm'} />}
              </button>} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
