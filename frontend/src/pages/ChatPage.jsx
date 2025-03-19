import Messages from "@/components/Messages";
import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/authContext";
import { ChatContext } from "@/context/chatContext";
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser, setSelectedUser } =
    useContext(AuthContext);
  const { onlineUsers, messages, setMessages } = useContext(ChatContext);
  const [textMessage, setTextMessage] = useState("");
  const [chattedUsers, setChattedUsers] = useState([]);

  async function sendMessageHandler(receiverId) {
    try {
      const res = await axios.post(
        `https://snapverse-backend-one.vercel.app/message/send/${receiverId}`,
        { message: textMessage },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setMessages([...messages, res.data]);
        setTextMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    return () => {
      setSelectedUser(null);
    };
  }, []);

  const fetchChattedUsers = async () => {
    try {
      const res = await axios.get(
        "https://snapverse-backend-one.vercel.app/message/getchatteduser",
        { withCredentials: true }
      ); // Adjust based on your API
      if (res.status === 200) {
        setChattedUsers(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChattedUsers();
  }, []);

  const messageContainerRef = useRef(null); // Ref to the message container

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Sidebar />
      <div className="ml-[17%] max-xl:ml-[80px] max-md:ml-0 max-md:py-14 flex max-w-full h-screen bg-black text-white">
        <div className="w-[25%] p-5 max-sm:p-0 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:w-[100px] max-xl-w-[202px] h-full overflow-y-auto border-r border-zinc-700">
          <h1 className="text-xl font-bold max-sm:hidden">{user.username}</h1>
          <div className="mt-10 w-fit text-center">
            <Avatar className="w-20 h-20 max-sm:w-12 max-sm:h-12 rounded-full">
              <AvatarImage
                className="w-full h-full object-cover"
                src={user.profilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-sm max-sm:hidden">{user.username}</p>
          </div>
          {/* Chatted Users */}
          <div className="mt-5">
            {chattedUsers.length > 0 && (
              <h1 className="text-lg font-bold max-sm:hidden">Past Chats</h1>
            )}
            <div className="mt-3">
              {chattedUsers.map((chattedUser, index) => {
                const isOnline = onlineUsers?.includes(chattedUser._id);
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedUser(chattedUser)}
                    className="person mb-5 flex items-center gap-3 cursor-pointer hover:bg-zinc-900"
                  >
                    <Avatar className="w-[65px] h-[65px] rounded-full">
                      <AvatarImage
                        className="w-full h-full object-cover"
                        src={chattedUser.profilePicture}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="w-full overflow-hidden max-sm:hidden">
                      <p className="truncate">{chattedUser.username}</p>
                      <p
                        className={`text-sm truncate ${
                          isOnline ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isOnline ? "online" : "offline"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Suggested Users */}
          <div className="mt-5">
            {suggestedUsers.length > 0 && (
              <h1 className="text-lg font-bold max-sm:hidden">
                Suggested Users
              </h1>
            )}
            <div className="mt-3">
              {suggestedUsers.map((suggestedUser, index) => {
                const isOnline = onlineUsers?.includes(suggestedUser._id);
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedUser(suggestedUser)}
                    className="person mb-5 flex items-center gap-3 cursor-pointer hover:bg-zinc-900"
                  >
                    <Avatar className="w-[65px] h-[65px] rounded-full">
                      <AvatarImage
                        className="w-full h-full object-cover"
                        src={suggestedUser.profilePicture}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="w-full overflow-hidden max-sm:hidden">
                      <p className="truncate">{suggestedUser.username}</p>
                      <p
                        className={`text-sm truncate ${
                          isOnline ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isOnline ? "online" : "offline"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {selectedUser ? (
          <div className="message-container relative w-full h-full">
            <div className="w-full flex items-center gap-2 p-3 border-b border-zinc-700">
              <Avatar className="w-14 h-14 rounded-full">
                <AvatarImage
                  className="w-full h-full object-cover"
                  src={selectedUser.profilePicture}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p>{selectedUser.username}</p>
            </div>
            <div
              ref={messageContainerRef}
              className="max-h-[calc(100vh-147px)] max-md:h-[calc(100vh-272px)] overflow-y-auto"
            >
              <div className="w-full flex mt-5 justify-center items-center flex-col gap-3">
                <Avatar className="w-20 h-20 rounded-full">
                  <AvatarImage
                    className="w-full h-full object-cover"
                    src={selectedUser.profilePicture}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="text-lg font-semibold">
                  {selectedUser.username}
                </h1>
                <p className="text-sm text-zinc-400">
                  {selectedUser.username} · SnapVerse
                </p>
                <Link
                  to={`/profile/${selectedUser._id}`}
                  className="bg-zinc-700 px-4 py-2 rounded-[8px] text-sm hover:bg-[#363636] font-medium"
                >
                  View Profile
                </Link>
              </div>
              <Messages selectedUser={selectedUser} />
            </div>
            <div className="w-full absolute flex bottom-0 p-3 gap-3 bg-black">
              <input
                type="text"
                className="w-full outline-none rounded-3xl px-3 py-2 bg-transparent border border-zinc-700"
                placeholder="Message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
              />
              <button
                onClick={() => sendMessageHandler(selectedUser._id)}
                className="px-4 py-2 font-medium bg-[#0295F7] hover:bg-[#1777F2] transition-all rounded text-sm"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="start-message w-full h-full">
            <div className="flex justify-center items-center flex-col gap-3 w-full h-full">
              <svg
                aria-label=""
                className="x1lliihq x1n2onr6 x5n08af"
                fill="currentColor"
                height="96"
                role="img"
                viewBox="0 0 96 96"
                width="96"
              >
                <title></title>
                <path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path>
              </svg>
              <h1 className="text-lg font-medium">Your messages</h1>
              <p className="text-sm text-zinc-400">
                Send a message to start a chat.
              </p>
              <button className="px-4 py-2 bg-[#0295F7] hover:bg-[#1777F2] transition-all rounded text-sm">
                Send message
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPage;
