export interface User {
    _id: string;
    username: string;
  }
  
  export interface Message {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    // timestamp: string;
  }