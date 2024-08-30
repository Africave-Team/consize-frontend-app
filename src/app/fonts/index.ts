import { Rubik, Outfit, Poppins, Inter, Fira_Code } from 'next/font/google'
import localFont from 'next/font/local'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-rubik',
})


const outfit = Outfit({
  subsets: ['latin']
})

const fira = Fira_Code({
  subsets: ['latin']
})

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"]
})

const brandFont = localFont({ src: './rgs-1.ttf' })

export const fonts = {
  rubik,
  poppins,
  outfit,
  inter,
  fira,
  brandFont
}