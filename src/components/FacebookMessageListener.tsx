import { updateMyTeamInfo } from '@/services/teams'
import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'

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

const FacebookSignupListener: React.FC = () => {
  const { team } = useAuthStore()
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
        console.log("here", data)
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          // if user finishes the Embedded Signup flow
          if (data.event === 'FINISH' && team) {
            const { phone_number_id, waba_id } = data.data
            updateMyTeamInfo({
              facebookBusinessId: waba_id,
              facebookPhoneNumberId: phone_number_id,
            })
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

  return null // This component does not render anything
}

export default FacebookSignupListener
