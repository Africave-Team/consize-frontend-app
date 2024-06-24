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
import { queryClient } from '@/utils/react-query'
import TeamQRCode from '@/components/Dashboard/TeamQRCode'
import { Facebook, FacebookLoginResponse, WindowWithFB } from '@/type-definitions/facebook'


interface ApiResponse {
  data: Team
}
export default function IntegrationSettings () {
  const [progress, setProgress] = useState(false)
  const { team, setTeam } = useAuthStore()
  const [showTeamQR, setShowteamQR] = useState<boolean>(false)
  const { initiateSlackSettings, initiateSlackAsync } = useCallbackStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (props: { id: string, payload: { channels: DistributionChannel[] } }) => updateMyTeamInfo(props.id, props.payload),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })

  const UninstallApp = async function (channel: DistributionChannel) {
    if (team) {
      const channels = [...team.channels]
      let index = channels.findIndex(e => e.channel === channel.channel)
      if (index >= 0) {
        channels[index] = channel
      }
      await mutateAsync({ id: team.id, payload: { channels } })
    }
  }

  const handleChannelButtonClick = async function (channel: DistributionChannel) {
    if (channel.channel === Distribution.WHATSAPP) {
      // console.log("https://web.facebook.com/v18.0/dialog/oauth?app_id=1057351731954710&cbt=1719041303381&channel_url=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfc7d495b5ed3508ca%26domain%3Dapp.consize.localhost%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fapp.consize.localhost%252Ff65b5f35da2327fd9%26relation%3Dopener&client_id=1057351731954710&config_id=1102240047637820&display=popup&domain=app.consize.localhost&e2e=%7B%7D&fallback_redirect_uri=https%3A%2F%2Fapp.consize.localhost%2Fdashboard%2Fsettings%2Fchannels&locale=en_US&logger_id=f77bc272adf73d03d&origin=1&override_default_response_type=true&redirect_uri=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df1ceddabae906db59%26domain%3Dapp.consize.localhost%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fapp.consize.localhost%252Ff65b5f35da2327fd9%26relation%3Dopener%26frame%3Dfeb99ed5bae6c86d1&response_type=code&sdk=joey&version=v18.0")
      launchWhatsAppSignup()
      return
    }
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
          version: 'v18.0',
        })

        try {
          FB.login(
            (response: FacebookLoginResponse) => {
              if (response.authResponse) {
                // Use the access token to call the debug_token API and get the shared WABA's ID
                facebookTokenExchangeWithToken(response.authResponse.code)
              } else {
                console.log('User cancelled login or did not fully authorize.')
              }
            },
            {
              config_id: '1102240047637820', // configuration ID from previous step
              response_type: 'code', // must be set to 'code' for System User access token
              override_default_response_type: true,
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

  const loadData = async function ({ id }: { id?: string }) {
    if (id) {
      const result = await fetchMyTeamInfo(id)
      return result
    }
  }

  const { data: teamInfo, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['team', team?.id],
      queryFn: () => loadData({ id: team?.id }),
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

                  {teamInfo?.data?.channels.map((channel) => (<div key={channel.channel} className='flex flex-col gap-1 min-h-32 w-1/3'>
                    <div>
                      <div className='text-lg font-semibold capitalize'>{channel.channel} integration</div>
                      <div className='text-sm'>
                        {`Integrate ${channel.channel} to enable you to distribute content to your students via ${channel.channel}.`}
                      </div>
                    </div>
                    <div>
                      <button onClick={() => {
                        handleChannelButtonClick(channel)
                      }} className='border py-1 px-3 flex gap-2 items-center justify-center rounded-md hover:bg-gray-100 text-sm'>
                        {channel.channel === Distribution.SLACK ? <AiFillSlackCircle className='text-2xl' /> : <FaSquareWhatsapp className='text-2xl' />} {channel.enabled ? "Disable" : "Enable"}
                        {isPending && <Spinner size={'sm'} />}
                      </button>
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
