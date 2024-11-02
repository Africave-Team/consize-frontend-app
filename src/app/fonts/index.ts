import { Rubik, Outfit, Poppins, Inter, Fira_Code, Montserrat } from 'next/font/google'
import localFont from 'next/font/local'

const myFont = localFont({ src: '../templates/certificate/gilsans.ttf' })
const cloisterFont = localFont({ src: '../templates/certificate/CloisterBlack.ttf' })
const culpa = localFont({ src: '../templates/certificate/helvetica.ttf' })
const antique = localFont({ src: '../templates/certificate/antique.ttf' })
const sequel = localFont({ src: '../templates/certificate/sequel.ttf' })
const theseasons = localFont({ src: '../templates/certificate/theseasons-reg.otf' })
const sloop = localFont({ src: '../templates/certificate/Sloop-ScriptThree.ttf' })

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
const montserrat = Montserrat({
  subsets: ['latin']
})

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"]
})

const brandFont = localFont({ src: './rgs-1.ttf' })
const brandFont2 = localFont({ src: './rgs.ttf' })

export const fonts = {
  rubik,
  poppins,
  outfit,
  inter,
  fira,
  brandFont,
  brandFont2,
  montserrat,
  sloop,
  theseasons,
  sequel,
  antique,
  culpa,
  cloisterFont,
  gilsnas: myFont
}