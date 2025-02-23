export declare interface IProject{
    id:string 
    title:string 
    image:string 
    desc:string 
    type:string 
    amount:number 
    limit:number 
    profile:string
    projectEndDate: any;
    notifications?: any[] |  undefined;
    projectAttachement?: ProjectAttachment[] | undefined;
}

export type ProjectAttachment = {
    name:string
    type: "image" | "pdf" | "video";
    url: string;
  };
  
  export type Project = {
    id: string;
    title: string;
    image: string;
    desc: string;
    type: string;
    amount: number; // Current amount
    limit: number; // Target amount
    profile: string;
    projectEndDate: string;
    notifications: string[];
    projectAttachement: ProjectAttachment[];
  };

  export declare interface projectProps{
    _id:string 
    accessCodestatus:string 
    actualBalance:number
    attachments:string[]
    category:{
      _id:string 
      name:string 
    }
    currency:string 
    description:string 
    endDate:string  
    medias:string[]
    name:string 
    projectOwner:{
      _id:string 
      gender:string 
    }
    province:{
      _id:string 
      name:string
    }
    startDate:string 
    status:string 
    targetAmount: number
    territory:{
      _id:string 
      name:string
    }
    type:{
      _id:string 
      name:string
    }
  }
  
  export type CryptoWallet = {
    type: "Bitcoin" | "Ethereum" | "Binance" | "WAV";
    walletId: string;
  };
  
  export type User = {
    _id:string
    profile?: string;
    email: string;
    name?:string
    isGoogleUser?:boolean 
    location?:string
    phone_number: string;
    password?: string;
    projects?: Project[];
    cryptoWallet?: CryptoWallet[];
  };