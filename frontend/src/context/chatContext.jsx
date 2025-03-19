import { createContext, useState } from "react";

// Create ChatContext
export const ChatContext = createContext();

// Provide ChatContext
export const ChatProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider
      value={{ onlineUsers, setOnlineUsers, messages, setMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};
