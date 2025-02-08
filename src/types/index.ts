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
  
  export type CryptoWallet = {
    type: "Bitcoin" | "Ethereum" | "Binance" | "WAV";
    walletId: string;
  };
  
  export type User = {
    profile: string;
    email: string;
    phone_number: string;
    password: string;
    projects: Project[];
    cryptoWallet: CryptoWallet[];
  };