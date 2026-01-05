import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import api from "../lib/axios";

export const useAuthReq = () => {
  const { isSignedIn, getToken, isLoaded } = useAuth();

  //include the token to the req
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [isSignedIn, getToken]);
  return { isSignedIn, isLoaded };
};

export default useAuthReq;
