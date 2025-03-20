import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authContext";

const useGetSuggestedUsers = () => {
  const { setSuggestedUsers } = useContext(AuthContext);
  useEffect(() => {
    async function fetchSuggestedUsers() {
      try {
        const res = await axios.get("http://localhost:3000/user/suggested", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setSuggestedUsers(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestedUsers;
