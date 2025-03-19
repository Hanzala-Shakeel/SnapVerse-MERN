import Post from "./Post";
import { useContext, useState, useEffect } from "react";
import { PostsContext } from "@/context/postsContext";

const Posts = () => {
  const { posts } = useContext(PostsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (posts.length > 0) {
      setLoading(false);
    }
  }, [posts]);

  if (loading) {
    // Render skeleton while loading
    return (
      <div className="max-sm:w-full flex flex-col items-center">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="mb-20 mt-8 max-sm:w-[90%] w-[448px] h-[448px] max-sm:h-1/2"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse"></div>
                <div className="w-24 h-4 bg-zinc-700 rounded animate-pulse"></div>
              </div>
              <div className="w-full h-full aspect-square bg-zinc-700 my-2 rounded animate-pulse"></div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
