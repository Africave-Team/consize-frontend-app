import { CertificateTemplate, ComponentTypes } from '@/type-definitions/cert-builder'

export const certificateTemplates: CertificateTemplate[] = [
  {
    name: "1",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Black%20Gold%20Simple%20Elegant%20Certificate_cleanup.webp",
    components: [
      {
        "position": {
          "x": 277,
          "y": 60
        },
        "type": ComponentTypes.TEXT,
        "default": "Certificate",
        "text": {
          "classNames": "font-bold text-3xl w-60 text-center uppercase"
        }
      },
      {
        "position": {
          "x": 252,
          "y": 124
        },
        "type": ComponentTypes.TEXT,
        "default": "of completion",
        "text": {
          "classNames": "font-bold w-72 text-center text-xl uppercase"
        }
      },
      {
        "position": {
          "x": 219,
          "y": 99
        },
        "type": ComponentTypes.TEXT,
        "default": "This is to certify that",
        "text": {
          "classNames": "font-bold text-xl w-96 text-center"
        }
      },
      {
        "position": {
          "x": 159,
          "y": 102
        },
        "type": ComponentTypes.NAME,
        "default": "Josep Blatter",
        "text": {
          "classNames": "font-bold text-3xl w-[500px] border-b-2 uppercase text-center"
        }
      },

      {
        "position": {
          "x": 168,
          "y": 118
        },
        "type": ComponentTypes.TEXT,
        "default": `Has successfully completed the <b>{{courseName}}</b> course, offered by <b>{{teamName}}</b>`,
        "text": {
          "classNames": "font-normal text-base w-[520px] text-center"
        }
      },

      {
        "type": ComponentTypes.SIGNATORY,
        "default": "Signature",
        "position": {
          "x": 170,
          "y": 130
        },
        "signatory": {
          "classNames": "h-20 flex flex-col gap-2 text-white  whitespace-nowrap",
          "signatoryName": "John Doe",
          "signature": ""
        }
      },
      {
        "type": ComponentTypes.SIGNATORY,
        "default": "Signature",
        "position": {
          "x": 432,
          "y": 50
        },
        "signatory": {
          "classNames": "h-20 flex flex-col gap-2 text-white  whitespace-nowrap",
          "signatoryName": "John Doe",
          "signature": ""
        }
      }
    ]
  },
  {
    name: "2",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Purple%20Geometric%20Participation%20Certificate_cleanup.webp",
    components: [
      {
        type: ComponentTypes.TEXT,
        default: "Certificate",
        position: {
          x: -15,
          y: -192
        },
        text: {
          classNames: `font-bold text-5xl uppercase`,
        }
      }
    ]
  },
  {
    name: "3",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Green%20and%20White%20Modern%20Certificate%20of%20Appreciation_cleanup.webp",
    components: []
  },
  {
    name: "4",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Golden%20Elegant%20Certificate%20of%20Appreciation%20(1)_cleanup.webp",
    components: []
  },
  {
    name: "5",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Gold%20&%20Black%20Minimal%20Certificate%20of%20Recognition_cleanup.webp",
    components: []
  },
  {
    name: "6",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Blue%20Minimalist%20Certificate%20Of%20Achievement%20(1)_cleanup.webp",
    components: []
  },
  {
    name: "7",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Blue%20and%20Yellow%20Minimalist%20Employee%20of%20the%20Month%20Certificate%20(1)_cleanup.webp",
    components: []
  },
  {
    name: "8",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Blue%20and%20Gold%20Simple%20Participation%20Certificate%20(1)_cleanup.webp",
    components: []
  },
  {
    name: "9",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Black%20Purple%203D%20Abstract%20Modern%20Certification%20Of%20Appreciation_cleanup.webp",
    components: []
  },
]