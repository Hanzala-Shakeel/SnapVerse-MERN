import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext";
import { PostsProvider } from "./context/postsContext";
import { SocketProvider } from "./context/socketContext";
import { ChatProvider } from "./context/chatContext";
import { NotificationProvider } from "./context/notificationContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthProvider>
    <PostsProvider>
      <SocketProvider>
        <ChatProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ChatProvider>
      </SocketProvider>
    </PostsProvider>
  </AuthProvider>
  // </StrictMode>
);
