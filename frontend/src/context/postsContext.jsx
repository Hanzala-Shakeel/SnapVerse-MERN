import { createContext, useState } from "react";

// Create PostsContext
export const PostsContext = createContext();

// Provide PostsContext
export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostsContext.Provider>
  );
};
