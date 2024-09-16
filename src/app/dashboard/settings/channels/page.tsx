"use client"
import CopyToClipboardButton from '@/components/CopyToClipboard'
import { fetchMyTeamInfo, updateMyTeamInfo } from '@/services/teams'
import Layout from '@/layouts/PageTransition'
import { facebookTokenExchangeWithToken, slackUninstall } from '@/services/slack.services'
import { useAuthStore } from '@/store/auth.store'
import { useCallbackStore } from '@/store/callbacks.store'
import { Skeleton, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DistributionChannel, Team } from '@/type-definitions/auth'
import { FaSquareWhatsapp } from "react-icons/fa6"
import { AiFillSlackCircle } from "react-icons/ai"
import { Distribution } from '@/type-definitions/callbacks'
import { FaFacebook } from "react-icons/fa6"
import { queryClient } from '@/utils/react-query'
import TeamQRCode from '@/components/Dashboard/TeamQRCode'
import { Facebook, FacebookLoginResponse, WindowWithFB } from '@/type-definitions/facebook'
import FacebookSignupListener from '@/components/FacebookMessageListener'
import { useFetchActiveSubscription } from '@/services/subscriptions.service'
import { delay } from '@/utils/tools'
interface FacebookEventData {
  type: string
  event: string
  data: {
    phone_number_id?: string
    waba_id?: string
    error_message?: string
    current_step?: string
  }
}


interface ApiResponse {
  data: Team
}
export default function IntegrationSettings () {
  const [progress, setProgress] = useState<{ [key: string]: boolean }>({ slack: false, whatsapp: false })
  const { team, setTeam } = useAuthStore()
  const [showTeamQR, setShowteamQR] = useState<boolean>(false)
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(false)
  const [isFreePlan, setIsFreePlan] = useState<boolean>(false)
  const { initiateSlackSettings, initiateSlackAsync } = useCallbackStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (props: { payload: Partial<Omit<Team, "id" | "owner">> }) => updateMyTeamInfo(props.payload),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })

  const UninstallApp = async function (channel: DistributionChannel) {
    if (team) {
      let pro = { ...progress }
      pro[channel.channel] = true
      setProgress(pro)
      const channels = [...team.channels]
      let index = channels.findIndex(e => e.channel === channel.channel)
      if (index >= 0) {
        channels[index] = channel
      }
      let payload: Partial<Omit<Team, "id" | "owner">> = { channels }
      if (channel.channel === Distribution.WHATSAPP) {
        payload.facebookPhoneNumberId = null
        payload.facebookData = null
        payload.facebookBusinessId = null
      }
      await mutateAsync({ payload })
      pro[channel.channel] = false
      setProgress(pro)
    }
  }

  const handleChannelButtonClick = async function (channel: DistributionChannel) {
    if (channel.enabled) {
      UninstallApp({
        ...channel,
        enabled: false,
      })
    } else {
      if (channel.channel === Distribution.SLACK) {
        initiateSlackSettings(team?.id)
      } else {
        UninstallApp({
          ...channel,
          enabled: true,
        })
      }
    }
  }

  function launchWhatsAppSignup (): void {
    try {
      // Type assertion for FB object (if necessary)
      const FB: Facebook | undefined = (window as WindowWithFB).FB // Type cast for FB object
      if (FB) {
        FB.init({
          appId: '1057351731954710',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v19.0',
        })

        try {
          FB.login(
            (response: FacebookLoginResponse) => {
              if (response.authResponse) {
                // Use the access token to call the debug_token API and get the shared WABA's ID
                setExchangeLoading(true)
                let code = response.authResponse.code
                delay(4000).then(async () => {
                  await facebookTokenExchangeWithToken(code)
                  setExchangeLoading(false)
                  queryClient.invalidateQueries({ queryKey: ['team'] })
                })
              } else {
                console.log('User cancelled login or did not fully authorize.')
              }
            },
            {
              config_id: '1102240047637820', // configuration ID from previous step
              response_type: 'code', // must be set to 'code' for System User access token
              "override_default_response_type": true, // when true, any response types passed in the "response_type" will take precedence over the default types
              "extras": {
                "feature": "whatsapp_embedded_signup",
                "sessionInfoVersion": 3  //  Receive Session Logging Info
              }
            }
          )
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.error(error) // Use console.error for potential runtime errors
    }
  }

  const { data: subscription, isLoading } = useFetchActiveSubscription(false)

  const loadData = async function () {
    const result = await fetchMyTeamInfo()
    return result
  }

  const { data: teamInfo, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['team'],
      queryFn: () => loadData(),
    })

  useEffect(() => {
    if (!isFetching && teamInfo) {
      setTeam(teamInfo.data)
    }
  }, [isFetching, teamInfo])

  useEffect(() => {
    if (teamInfo && teamInfo.data && teamInfo.data.channels) {
      let item = teamInfo.data.channels.find(e => e.channel === Distribution.WHATSAPP)
      if (item && item.enabled) {
        setShowteamQR(true)
      }
    }
  }, [teamInfo])

  useEffect(() => {
    if (subscription) {
      let plan = subscription.plan
      if (plan && typeof plan !== "string") {
        setIsFreePlan(plan.price === 0)
      }

    }
  }, [subscription])

  useEffect(() => {
    const sessionInfoListener = (event: MessageEvent) => {
      if (event.origin == null) {
        return
      }

      // Make sure the data is coming from facebook.com
      if (!event.origin.endsWith("facebook.com")) {
        return
      }

      try {
        const data: FacebookEventData = JSON.parse(event.data)
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          // if user finishes the Embedded Signup flow
          if (data.event === 'FINISH') {
            const { phone_number_id, waba_id } = data.data
            if (phone_number_id && waba_id) {
              mutateAsync({
                payload: {
                  facebookBusinessId: waba_id,
                  facebookPhoneNumberId: phone_number_id,
                }
              })
            }
          }
          // if user reports an error during the Embedded Signup flow
          else if (data.event === 'ERROR') {
            const { error_message } = data.data
            console.error("error ", error_message)
          }
          // if user cancels the Embedded Signup flow
          else {
            const { current_step } = data.data
            console.warn("Cancel at ", current_step)
          }
        }
      } catch {
      }
    }

    // Add event listener when component mounts
    window.addEventListener('message', sessionInfoListener)

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('message', sessionInfoListener)
    }
  }, [])
  return (
    <Layout>
      <div className='w-full overflow-y-scroll h-screen p-4'>
        <div className='h-[700px] w-full flex gap-3'>
          <div className='flex w-2/3 flex-col gap-10'>
            <div className=''>
              <div className='text-lg font-semibold flex items-center gap-4'>Distribution channel integrations
                {isFetching && <Spinner size={'sm'} />}
              </div>
              <div className='w-full mt-4'>
                {isFetching ? <div className='flex flex-col gap-5 w-1/3'>
                  <Skeleton className='h-32 rounded-lg' />
                  <Skeleton className='h-32 rounded-lg' />
                </div> : <div className='flex flex-col gap-5'>

                  {teamInfo?.data?.channels.map((channel) => (<div key={channel.channel} className='flex flex-col gap-1 min-h-32'>
                    <div>
                      <div className='text-lg font-semibold capitalize'>{channel.channel} integration</div>
                      <div className='text-sm w-1/3'>
                        {`Integrate ${channel.channel} to enable you to distribute content to your students via ${channel.channel}.`}
                      </div>
                    </div>
                    <div>
                      <div className='flex gap-3 items-center mt-3'>
                        <strong>
                          {channel.enabled ? "Enabled" : "Disabled"}
                        </strong>
                        <button onClick={() => {
                          handleChannelButtonClick(channel)
                        }} className='border py-1 px-3 flex gap-2 items-center justify-center rounded-md hover:bg-gray-100 text-sm'>
                          {channel.channel === Distribution.SLACK ? <AiFillSlackCircle className='text-2xl' /> : <FaSquareWhatsapp className='text-2xl' />} {channel.enabled ? "Disable" : "Enable"}
                          {progress[channel.channel] && <Spinner size={'sm'} />}
                        </button>
                      </div>
                      {channel.channel === Distribution.WHATSAPP && !isFreePlan && channel.enabled && <div className='mt-3'>
                        <div className='text-sm w-1/2 font-normal'>Onboard your facebook WABA to use your own business whatsapp phone number to deliver your courses</div>
                        <div className='flex mt-2 flex-col'>
                          <div className='flex items-center gap-3'>
                            {teamInfo && teamInfo.data && teamInfo.data.facebookData ? <div>
                              STATUS: {teamInfo.data.facebookData.status}
                            </div> : <button onClick={launchWhatsAppSignup} className='py-1 px-3 rounded-md flex items-center text-white bg-[#1a77f2] justify-center gap-2'>
                              <FaFacebook /> Continue with Facebook
                            </button>}
                            {(isPending || exchangeLoading) && <Spinner size={'sm'} />}
                          </div>

                        </div>
                      </div>}
                      {channel.channel === Distribution.SLACK && !channel.enabled && <>
                        <div className='text-sm mt-2 font-medium'>Or share authorization link with the admin of your slack workspace</div>
                        <div className='flex mt-1 items-center gap-3'>
                          <CopyToClipboardButton message='Slack authorization link copied' useLink={true} link={initiateSlackAsync()} targetSelector='abc' />
                        </div>
                      </>}
                    </div>
                  </div>))}

                </div>}
              </div>
            </div>
            <div className='h-52'></div>
          </div>
          <div className='w-1/3'>
            {showTeamQR ? <>{team && <TeamQRCode teamLogo={team.logo || ""} shortCode={team?.shortCode} teamName={team.name} />}</> : <div className='h-full w-full flex justify-center items-center'>Whatsapp channel is disabled</div>}
          </div>
        </div>
      </div>
    </Layout>
  )
}
