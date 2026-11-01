import type React from "react";
import { createContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { userProfileType } from "../../types/user.types";
import { getMyProfile } from "../../Services/profile.service";
import useAuth from "./tokenContext";

export type UserContextType = {
  userDetails: userProfileType | null;
  setUserDetails: Dispatch<SetStateAction<userProfileType | null>>;
  getUserProfile?: () => Promise<void>;
};


export const UserContext = createContext<UserContextType | null>(null);


export default function UserContextProvider({ children }: { children: React.ReactNode }) {

  const {token} = useAuth()

  const [userDetails, setUserDetails] = useState<userProfileType | null>(null);

   async function getUserProfile() {
     try {
        const  {data} = await getMyProfile();
        setUserDetails(data.data.user)
     } catch (error) {
        console.log(error);
     }
   }

    useEffect(()=>{
        if(token){
            getUserProfile()
        }
    
    },[token])



  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, getUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}
