import { useEffect, useContext } from "react";
import { ChatContext } from "@/context/chatContext";
import { AuthContext } from "@/context/authContext";
import axios from "axios";

const useGetAllMessages = () => {
  const { setMessages } = useContext(ChatContext);
  const { selectedUser } = useContext(AuthContext);

  useEffect(() => {
    async function fetchAllMessages() {
      try {
        const res = await axios.get(
          `http://localhost:3000/message/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchAllMessages();
  }, [selectedUser]);
};

export default useGetAllMessages;
