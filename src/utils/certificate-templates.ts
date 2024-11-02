import { CertificateTemplate, ComponentTypes, TextAlign } from '@/type-definitions/cert-builder'
import moment from 'moment'

export const certificateTemplates: CertificateTemplate[] = [
  {
    name: "1",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Black%20Gold%20Simple%20Elegant%20Certificate_cleanup.webp",
    components: [

    ]
  },
  {
    name: "2",
    bg: "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Purple%20Geometric%20Participation%20Certificate_cleanup.webp",
    components: [

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

export const defaultElements = [
  {
    "position": {
      "x": 159,
      "y": 102
    },
    "type": ComponentTypes.NAME,
    properties: {
      height: 40,
      width: 180,
      border: {
        b: 2,
        r: 0,
        l: 0,
        t: 0,
        color: "red"
      },
      text: {
        size: 20,
        weight: 600,
        family: 'Inter',
        color: '#000',
        value: `Josep Blatter`,
        align: TextAlign.CENTER
      }
    },
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
    properties: {
      height: 40,
      width: 180,
      text: {
        size: 14,
        weight: 500,
        family: 'Inter',
        color: '#000',
        value: `Enter text here`,
        align: TextAlign.LEFT
      }
    },
    "default": `Enter text here`,
    "text": {
      "classNames": "font-normal text-base w-[520px] text-center"
    }
  },
  {
    "position": {
      "x": 168,
      "y": 118
    },
    "type": ComponentTypes.DATE,
    properties: {
      height: 40,
      width: 180,
      border: {
        b: 1,
        r: 0,
        l: 0,
        t: 0,
        color: "#000000"
      },
      text: {
        size: 14,
        weight: 500,
        family: 'Inter',
        color: '#000',
        value: moment().format('Do MMMM, YYYY'),
        align: TextAlign.CENTER
      }
    },
    "default": ``,
    "text": {
      "classNames": "font-normal text-base w-[520px] text-center"
    }
  },
  {
    "position": {
      "x": 168,
      "y": 118
    },
    "type": ComponentTypes.COURSE,
    properties: {
      height: 40,
      width: 180,
      text: {
        size: 16,
        weight: 600,
        family: 'Inter',
        color: '#000',
        value: "Select a course from properties",
        align: TextAlign.LEFT
      }
    },
    "default": ``,
    "text": {
      "classNames": "font-normal text-base w-[520px] text-center"
    }
  },
  {
    "type": ComponentTypes.IMAGE,
    "default": "Image",
    "position": {
      "x": 170,
      "y": 130
    },
    properties: {
      height: 70,
      width: 70,
      color: "#000",
      radius: { rt: 0, rb: 0, lb: 0, lt: 0 }
    },
  },
  {
    type: ComponentTypes.CIRCLE,
    position: {
      "x": 477,
      "y": 100
    },
    properties: {
      size: 90,
      height: 30, width: 30,
      color: "#000"
    }
  },

  {
    type: ComponentTypes.TRIANGLE,
    position: {
      "x": 577,
      "y": 60
    },
    properties: {
      leftSize: 60,
      rightSize: 60,
      bottomSize: 80,
      height: 100,
      width: 100,
      color: "#000"
    }
  },
  {
    type: ComponentTypes.TRAPEZOID,
    position: {
      "x": 777,
      "y": 60
    },
    properties: {
      leftSize: 0,
      rightSize: 50,
      width: 80,
      height: 80,
      radius: { rt: 0, rb: 0, lb: 0, lt: 0 },
      bottomSize: 80,
      color: "#000"
    }
  },
  {
    type: ComponentTypes.SQUARE,
    position: {
      "x": 777,
      "y": 60
    },
    properties: {
      width: 80,
      height: 80,
      color: "#000",
      radius: { rt: 0, rb: 0, lb: 0, lt: 0 }
    }
  },
  {
    type: ComponentTypes.RECTANGLE,
    position: {
      "x": 777,
      "y": 60
    },
    properties: {
      height: 40,
      width: 100,
      color: "#000",
      radius: { rt: 0, rb: 0, lb: 0, lt: 0 }
    }
  }
]
