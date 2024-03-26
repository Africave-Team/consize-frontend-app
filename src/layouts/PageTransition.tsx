import { motion } from "framer-motion"

const Layout = ({ children }: {
  children: React.ReactNode
}) => (
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
export default Layout