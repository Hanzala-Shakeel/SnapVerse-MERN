import { useEffect, useContext } from "react";
import { ChatContext } from "@/context/chatContext";
import { SocketContext } from "@/context/socketContext";

const useGetRTM = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]);
};

export default useGetRTM;
