import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";



const AuthGuard: React.FC<{children: React.ReactNode, setIsLoading: (isLoading: boolean) => void}> = ({children, setIsLoading}) => {
    const [searchParams] = useSearchParams();
    const [is404, setIs404] = useState<boolean>(false);

    async function authenticateId(){
        const id = searchParams.get("id");
        try {
          setIsLoading(true);
          const REACT_APP_API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://localhost/api';
          const response = await fetch(`${REACT_APP_API_ENDPOINT}/onboarding/uuid/${id}/check`);
          const data = await response.json();
          if(data.status){
              setIs404(false)
              return;
          }else{
              setIs404(true);
          }
        } catch (error) {
          setIs404(true);
        }finally{
          setIsLoading(false);
        }
    }
    

    useEffect(() => {
        const id = searchParams.get("id");
        const isId = !!id;
        if(!isId){
          setIs404(true);
        }else{
            authenticateId();
        }
      }, [searchParams]);

      

      if(is404){
        return (
          <div className="text-center p-12 bg-white absolute top-0 left-0 right-0 bottom-0 rounded-lg  min-w-screen
           min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-slate-800 mt-4">404 Not Found</h2>
            <p className="text-slate-600 mt-2">The page you are looking for does not exist.</p>
          </div>
        )
      }
      
  return (
    <>
    {children}
    </>
  )
}

export default AuthGuard