import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { Toaster } from "sonner";
import EditProfile from "./pages/EditProfile";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { io } from "socket.io-client";
import { useEffect, useContext } from "react";
import { AuthContext } from "./context/authContext";
import { SocketContext } from "./context/socketContext";
import { ChatContext } from "./context/chatContext";
import { NotificationContext } from "./context/notificationContext";

const App = () => {
  const { user } = useContext(AuthContext);
  const { setSocket } = useContext(SocketContext);
  const { setOnlineUsers } = useContext(ChatContext);
  const { handleLikeNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      setSocket(socketio);
      // listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });

      socketio.on("notification", (notification) => {
        console.log("notificationlistener", notification);
        handleLikeNotification(notification);
      });

      return () => {
        socketio.close();
        setSocket(null);
      };
    }
    // else {
    //   socket.close();
    //   setSocket(null);
    // }
  }, [user, setOnlineUsers]);
  // [user, setSocket, setOnlineUsers] "user aur dispatch" patel ne use kiya

  return (
    <>
      <Toaster></Toaster>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
