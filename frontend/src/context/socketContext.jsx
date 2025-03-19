import { createContext, useState } from "react";

// Create SocketContext
export const SocketContext = createContext();

// Provide SocketContext
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
