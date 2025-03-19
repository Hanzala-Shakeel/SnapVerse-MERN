import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authContext";

const useGetUserProfile = (userId) => {
  const { setUserProfile } = useContext(AuthContext);
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await axios.get(
          `https://snapverse-backend-one.vercel.app/user/profile/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          setUserProfile(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
