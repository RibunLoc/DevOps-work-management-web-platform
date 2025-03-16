import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { User } from '../../types';
import { useParams } from 'react-router-dom';

interface ProfileContextType {
    url: string | undefined; 
    setUrl: (url:string) => void
    targetUserId:string|null|undefined
}

export const AccessUrlContext = createContext<ProfileContextType | undefined>(undefined);

export const AccessUrlProvider: React.FC<{ children: ReactNode;type:String,TargetUserId?:string|null,userId:string|null|undefined}> = ({ children,type ,TargetUserId,userId}) => {
  let url=""
  const [currentUrl, setUrl] = useState<string>();

  useEffect(()=>{
    if(type==="profile")
      {
        url = `${process.env.REACT_APP_API_URL}/api/v1/post/getpostsbyuserid?targetId=${TargetUserId}&userAccessId=${userId}`;
      } else 
      { 
        url = `${process.env.REACT_APP_API_URL}/api/v1/post/getposthome?userId=${userId}`;
      }
    setUrl(url)    
  },[userId])
  
    return (
      <AccessUrlContext.Provider value={{ url: currentUrl,setUrl:setUrl,targetUserId:TargetUserId}}>
        {children}
      </AccessUrlContext.Provider>
    );
  };
