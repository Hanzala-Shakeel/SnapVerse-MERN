import { useContext } from "react";
import { ChatContext } from "@/context/chatContext";
import { AuthContext } from "@/context/authContext";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetAllMessages();
  useGetRTM();
  const { messages } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="mt-10 flex-1 p-4">
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-[5px] max-w-xs break-words ${
                  message.senderId === user?._id
                    ? "bg-[#0295F7]"
                    : "bg-zinc-800"
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Messages;