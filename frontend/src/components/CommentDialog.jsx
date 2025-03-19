import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal, Send } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { PostsContext } from "@/context/postsContext";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { AuthContext } from "@/context/authContext";

const CommentDialog = ({
  openPost,
  setOpenPost,
  post,
  selectedPost,
  setSelectedPost,
  postCommentsLength,
  setPostCommentsLength,
  liked,
  setLiked,
  postLikesLength,
  setPostLikesLength,
  isSaved,
  setIsSaved,
  userProfile,
  setUserProfile,
}) => {
  const [text, setText] = useState("");
  const { posts, setPosts } = useContext(PostsContext);
  const { user, setUser } = useContext(AuthContext);

  function commentHandler(e) {
    const newText = e.target.value;
    if (newText.trim()) setText(newText);
    else setText("");
  }

  async function postComment() {
    try {
      const res = await axios.post(
        `https://snapverse-backend-one.vercel.app/post/addcomment/${post._id}`,
        { text },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setText("");
        setPostCommentsLength(post.comments.length + 1);
        const newComment = res.data.newComment;
        const updatedPosts = posts.map((postItem) =>
          postItem._id === post._id
            ? {
                ...postItem,
                comments: [...postItem.comments, newComment],
              }
            : postItem
        );
        setPosts(updatedPosts);
        setSelectedPost({
          ...selectedPost,
          comments: [...selectedPost.comments, newComment],
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  }

  async function likeOrDislike() {
    try {
      const res = await axios.post(
        `https://snapverse-backend-one.vercel.app/post/likeordislike/${post._id}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        const updatedLikesLength = liked
          ? postLikesLength - 1
          : postLikesLength + 1;
        setPostLikesLength(updatedLikesLength);
        setLiked(!liked);
        // update globle posts state
        const updatedPosts = posts.map((postItem) =>
          postItem._id === post._id
            ? {
                ...postItem,
                likes: liked
                  ? postItem.likes.filter((id) => id !== user._id)
                  : [...postItem.likes, user._id],
              }
            : postItem
        );
        setPosts(updatedPosts);
        toast.success(res.data);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  }

  const savedPost = async () => {
    try {
      const res = await axios.post(
        `https://snapverse-backend-one.vercel.app/post/save/${post._id}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        setIsSaved(!isSaved);

        // Update global posts state or user state (depending on how you store it)
        const updatedSavedPosts = isSaved
          ? user.savedPosts.filter((id) => id !== post._id)
          : [...user.savedPosts, post._id];

        const updatedUser = {
          ...user,
          savedPosts: updatedSavedPosts,
        };

        setUser(updatedUser);

        // Save the updated user data in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success(res.data);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  async function deletePost() {
    try {
      const res = await axios.delete(
        `https://snapverse-backend-one.vercel.app/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data);
        setPosts(posts.filter((postItem) => postItem._id !== post._id));
        setOpenPost(false);
        fetchUserProfile();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  }

  async function fetchUserProfile() {
    try {
      const res = await axios.get(
        `https://snapverse-backend-one.vercel.app/user/profile/${userProfile._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setUserProfile(res.data);
        console.log("chala");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (selectedPost) {
      fetchUserProfile();
    }
  }, [isSaved, liked, postCommentsLength]);

  return (
    <Dialog open={openPost}>
      <DialogContent
        onInteractOutside={() => setOpenPost(false)}
        className="max-w-[66%] max-sm:max-w-[80%] rounded-none bg-black outline-none text-white"
      >
        <div className="flex max-sm:text-sm">
          <div className="w-1/2 max-lg:hidden">
            <img
              className="w-full h-full object-cover"
              src={post.image}
              alt=""
            />
          </div>
          <div className="w-1/2 relative max-lg:w-full">
            <div className="flex items-center justify-between max-sm:py-2 p-4 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.author._id}`}>
                  <Avatar className="rounded-full">
                    <AvatarImage
                      className="w-full h-full object-cover"
                      src={post.author.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/profile/${post.author._id}`} className="mr-5 text-white">
                    {post.author.username}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="max-sm:w-[80%] max-sm:rounded-xl max-sm:text-sm">
                  <button className="cursor-pointer px-5 py-3 transparent border-b border-zinc-700 text-white outline-none">
                    Go to post
                  </button>
                  {isSaved ? (
                    <button
                      onClick={savedPost}
                      className="cursor-pointer px-5 py-3 transparent text-red-500 outline-none"
                    >
                      Removed from favorites
                    </button>
                  ) : (
                    <button
                      onClick={savedPost}
                      className="cursor-pointer px-5 py-3 transparent text-white outline-none"
                    >
                      Add to favorites
                    </button>
                  )}
                  {user._id === post.author._id && (
                    <button
                      onClick={deletePost}
                      className="cursor-pointer px-5 py-3 border-t border-zinc-700 transparent text-red-500 outline-none"
                    >
                      Delete
                    </button>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className="overflow-y-auto relative h-[399px] p-4 text-sm">
              <div className="flex gap-3 mb-3">
                <Link to={`/profile/${post.author._id}`}>
                  <Avatar className="rounded-full">
                    <AvatarImage
                      className="w-full h-full object-cover"
                      src={post.author?.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link to={`/profile/${post.author._id}`}>
                  <p className="font-bold">{post.author.username}</p>
                </Link>
                <p className="text-zinc-400">{post.caption}</p>
              </div>
              {post.comments.map((comment) => (
                <div key={comment._id} className="comment mb-3">
                  <div className="flex gap-3">
                    <Link to={`/profile/${comment.author._id}`}>
                      <Avatar className="rounded-full">
                        <AvatarImage
                          className="w-full h-full object-cover"
                          src={comment.author?.profilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Link>
                    <p className="font-bold">
                      <Link to={`/profile/${comment.author._id}`}>
                        {comment.author?.username}{" "}
                      </Link>
                      {comment.author?._id === post.author._id && (
                        <Badge className="bg-zinc-700 text-xs hover:bg-zinc-700">
                          Author
                        </Badge>
                      )}{" "}
                      <span className="font-normal">{comment.text}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full bg-black border-t border-zinc-700">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <i
                      onClick={likeOrDislike}
                      className={`ri-heart-${
                        liked
                          ? "fill text-[#FF3440]"
                          : "line hover:text-zinc-700"
                      } text-2xl cursor-pointer transition-all`}
                    ></i>
                    <i
                      onClick={() => setOpenPost(true)}
                      className="ri-chat-3-line text-2xl cursor-pointer hover:text-zinc-700 transition-all"
                    ></i>
                    <Send
                      size={"22px"}
                      className="cursor-pointer hover:text-zinc-700 transition-all"
                    ></Send>
                  </div>
                  <i
                    onClick={savedPost}
                    className={`ri-bookmark${
                      isSaved ? "-fill" : "-line"
                    } text-2xl cursor-pointer hover:text-zinc-700 transition-all`}
                  ></i>
                </div>
                <p className="text-sm">
                  {postLikesLength > 0
                    ? `${postLikesLength} Likes`
                    : "Be the first one to like this"}
                </p>
              </div>
              <div className="w-full flex items-center justify-between p-4 border-t border-zinc-700 max-sm:py-2">
                <input
                  className="bg-transparent w-[90%] text-sm py-2 outline-none"
                  type="text"
                  placeholder="Add a comment..."
                  onChange={commentHandler}
                  value={text}
                />
                <button
                  onClick={postComment}
                  className="text-sm font-medium text-blue-500 cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
