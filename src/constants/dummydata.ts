import testimonialPic1 from '../assets/testimonialPic1.png'
import testimonialPic2 from '../assets/testimonialPic2.png'
import testimonialPic3 from '../assets/testimonialPic3.png'
import testimonialPic4 from '../assets/testimonialPic4.png'
import popularProjectImage1 from '../assets/popularProjectImg1.png'
import popularProjectImage2 from '../assets/popularProjectProfile2.png'
import popularProjectImage3 from '../assets/popularProjectProfile3.png'
import popularProjectProfileImg from '../assets/popularProjectProfile1.png'

import BTC from '../assets/btc.png'
import ETH from '../assets/eth.png'
import BCH from '../assets/bch.png'
import BNB from '../assets/bnb.png'
import WAVES from '../assets/waves.png'
import ETH2 from '../assets/eth2.png'
import Img1 from '../assets/06.png'
import Img2 from '../assets/notification2.png'
import Img3 from '../assets/targetSupportImg.png'



export const userTestimonials = [
  {
    id: "1",
    img: testimonialPic1,
    name: "Nadia CREZI",
    description: "Ma plateforme de référence pour faire financer mes projets.",
  },
  {
    id: "2",
    img: testimonialPic2,
    name: "Sylvie RHÉA",
    description: "Grâce à votre soutien généreux, nous avons pu concrétiser notre vision !",
  },
  {
    id: "3",
    img: testimonialPic3,
    name: "Christian SALUMU",
    description: "Votre soutien est une vraie source d’inspiration ! Grâce à vos contributions, nous nous rapprochons chaque jour un peu plus de nos objectifs et du changement durable que nous voulons créer.",
  },
  {
    id: "4",
    img: testimonialPic4,
    name: "Mme Brigitte",
    description: "Ce parcours n’aurait pas été possible sans votre générosité. Nous vous remercions profondément pour chaque don.",
  },
];

export const projects = [];
  
export const filterData={
    category:['charity','education','events','medical','others'],
    date:['Recent to Old','Old to Recent'],
    status:['Ongoing','Completed'],
    region:[
      'Kinshasa',
      'Kongo-Central',
      'Kwango',
      'Kwilu',
      'Mai-Ndombe',
      'Equateur',
      'Mongala',
      'Nord-Ubangi',
      'Sud-Ubangi',
      'Tshuapa',
      'Tshopo',
      'Bas-Uele',
      'Haut-Uele',
      'Ituri',
      'Nord-Kivu',
      'Sud-Kivu',
      'Maniema',
      'Haut-Lomami',
      'Lomami',
      'Kasai',
      'Kasai-Central',
      'Kasai-Oriental',
      'Haut-Katanga',
      'Tanganyika',
      'Lualaba'
    ],
    authorGender:['Male','Female']

}

export const files=[
  {
    name:"File title1",
    url:"/",
    type:"application/pdf"
  },
  {
    name:"File title2",
    url:"/",
    type:"application/pdf"
  },
  {
    name:"File title3",
    url:"/",
    type:"application/pdf"
  },
  {
    name:"File title4",
    url:"/",
    type:"application/pdf"
  }
]


export const donateOptions=[
  {
    name:"mobileMoney"
  },
  {
    name:"card"
  },
  {
    name:"crypto"
  }
]

export const cryptoData=[
  {
    name:"BTC",
    icon:BTC
  },
  {
    name:"ETH",
    icon:ETH  
  },
  {
    name:"BCH",
    icon:BCH
  },
  {
    name:"BNB",
    icon:BNB
  },
  {
    name:"WAV",
    icon:WAVES
  },
  {
    name:"ETH2",
    icon:ETH2
  },
]

export const users = [
  {
    profile: "https://example.com/profiles/user1.jpg",
    email: "user1@example.com",
    phone_number: "+1234567890",
    password: "securepassword123",
    projects: [
      {
        id: "proj-001",
        title: "E-commerce Website",
        image: popularProjectImage1,
        desc: "An online marketplace for various products.",
        type: "Web Development",
        amount: 5000,
        limit: 10000,
        profile: popularProjectProfileImg,
        projectEndDate: "2025-12-31",
        notifications: ["Project milestone reached", "New contributor added"],
        projectAttachement: [
          { name:"File title1",type: "image", url: "https://example.com/projects/ecommerce-preview.jpg" },
          { name:"File title2",type: "pdf", url: "https://example.com/projects/ecommerce-doc.pdf" },
          { name:"File title3",type: "video", url: "https://example.com/projects/ecommerce-demo.mp4" }
        ]
      }
    ],
    cryptoWallet: [
      { type: "Bitcoin", walletId: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" }
    ]
  },
  {
    profile: "https://example.com/profiles/user2.jpg",
    email: "user2@example.com",
    phone_number: "+9876543210",
    password: "anothersecurepassword456",
    projects: [
      {
        id: "proj-002",
        title: "AI Chatbot",
        image: popularProjectImage3,
        desc: "A chatbot powered by AI for customer support.",
        type: "AI/ML Development",
        amount: 10000,
        limit: 20000,
        profile: popularProjectProfileImg,
        projectEndDate: "2026-06-15",
        notifications: ["Beta version released", "New feedback received"],
        projectAttachement: [
          { name:"IMAGE",type: "image", url: "https://example.com/projects/chatbot-ui.jpg" },
          { name:"PDF",type: "pdf", url: "https://example.com/projects/chatbot-specs.pdf" },
          { name:"VIDEO",type: "video", url: "https://example.com/projects/chatbot-demo.mp4" }
        ]
      }
    ],
    cryptoWallet: [
      { type: "Ethereum", walletId: "0x123456789abcdef" }
    ]
  },
  {
    profile: "https://example.com/profiles/user3.jpg",
    email: "user3@example.com",
    phone_number: "+1122334455",
    password: "strongpassword789",
    projects: [],
    cryptoWallet: [
      { type: "Binance", walletId: "bnb123456789" }
    ]
  },
  {
    profile: "https://example.com/profiles/user4.jpg",
    email: "user4@example.com",
    phone_number: "+5566778899",
    password: "passwordsecure111",
    projects: [],
    cryptoWallet: [
      { type: "WAV", walletId: "wavwallet123" }
    ]
  },
  {
    profile: "https://example.com/profiles/user5.jpg",
    email: "user5@example.com",
    phone_number: "+9988776655",
    password: "securepass555",
    projects: [],
    cryptoWallet: [
      { type: "Bitcoin", walletId: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" },
      { type: "Ethereum", walletId: "0xabcdef123456789" }
    ]
  }
];

export const faqs = [
  {
    id: "1",
    title: "How does the fundraising platform work?",
    desc: "Our platform allows individuals and organizations to create fundraising campaigns, collect donations securely, and withdraw funds to their accounts."
  },
  {
    id: "2",
    title: "What payment methods are accepted?",
    desc: "We accept payments via credit/debit cards, PayPal, mobile money, and bank transfers, ensuring a smooth donation process for supporters."
  },
  {
    id: "3",
    title: "Is there a fee for using the platform?",
    desc: "Yes, we charge a small transaction fee to cover processing and operational costs. The exact percentage varies depending on the payment method."
  },
  {
    id: "4",
    title: "How long does it take to receive funds?",
    desc: "Funds are processed within 3-5 business days after a withdrawal request is made. Bank processing times may vary."
  },
  {
    id: "5",
    title: "Is my donation secure?",
    desc: "Yes, we use industry-standard encryption and security protocols to ensure that all donations and personal information are protected."
  }
];


export const notifications=[
  {
    image:Img1,
    description:"Kamana John has donate $500 to support 230 children...",
    time:"12:05",
    read:false
  },
  {
    image:Img2,
    description:"Roger has donate $100 to support 230 children...",
    time:"04:05",
    read:true
  },
  {
    image:Img3,
    description:"Target for  support 230 children get school fee is reached... ",
    time:"sept 27 ,2024",
    read:true
  },

]
