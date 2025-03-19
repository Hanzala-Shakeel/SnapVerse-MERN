import { createContext, useState } from "react";

// Create NotificationContext
export const NotificationContext = createContext();

// Provide NotificationContext
export const NotificationProvider = ({ children }) => {
  const [likeNotification, setLikeNotification] = useState([]);

  const handleLikeNotification = (notification) => {
    setLikeNotification((prevNotifications) => {
      if (notification.type === "like") {
        // Add the notification if it's a "like"
        return [...prevNotifications, notification];
      } else if (notification.type === "dislike") {
        // Remove the notification if it's a "dislike"
        return prevNotifications.filter(
          (item) => item.userId !== notification.userId
        );
      }
      return prevNotifications;
    });
  };

  return (
    <NotificationContext.Provider
      value={{ likeNotification, setLikeNotification, handleLikeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
