import { useAuthStore } from '@/store/auth.store'
import { useNavigationStore } from '@/store/navigation.store'
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Layout = ({ children }: {
  children: React.ReactNode
}) => {
  const { user, access, refresh } = useAuthStore()
  const { pageTitle } = useNavigationStore()

  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      // if (!access || !refresh || !user) {
      //   useAuthStore.setState({
      //     team: undefined,
      //     access: undefined,
      //     user: undefined,
      //     refresh: undefined
      //   })
      //   router.push("/auth/login")
      // }
      // console.log(access, refresh, user)
    }

  }, [access, refresh, user])

  // useEffect(() => {
  //   document.title = pageTitle
  // }, [pageTitle])
  return (

    <motion.div className='overflow-hidden h-full w-full'
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
export default Layout