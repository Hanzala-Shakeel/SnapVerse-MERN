import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal, Send } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import axios from "axios";
import { toast } from "sonner";
import { PostsContext } from "@/context/postsContext";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [openPost, setOpenPost] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { posts, setPosts } = useContext(PostsContext);
  const [liked, setLiked] = useState(post.likes.includes(user._id) || false);
  const [postLikesLength, setPostLikesLength] = useState(post.likes.length);
  const [postCommentsLength, setPostCommentsLength] = useState(
    post.comments.length
  );
  const [isSaved, setIsSaved] = useState(
    user.savedPosts.includes(post._id) || false
  );

  function commentHandler(e) {
    const newText = e.target.value;
    if (newText.trim()) setText(newText);
    else setText("");
  }

  async function deletePost() {
    try {
      const res = await axios.delete(
        `https://snapverse-backend-one.vercel.app/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data);
        setPosts(posts.filter((postItem) => postItem._id !== post._id));
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
        const newComment = res.data.newComment;
        setPostCommentsLength(postCommentsLength + 1);
        const updatedPosts = posts.map((postItem) =>
          postItem._id === post._id
            ? {
                ...postItem,
                comments: [...postItem.comments, newComment],
              }
            : postItem
        );
        setPosts(updatedPosts);
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

  return (
    <div className="my-8 max-sm:my-5 w-full max-w-md mx-auto border-b border-zinc-700 max-sm:px-4 max-sm:text-sm max-sm:border-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <Link
            className="flex gap-2 items-center"
            to={`/profile/${post.author._id}`}
          >
            <Avatar className="rounded-full">
              <AvatarImage
                className="w-full h-full object-cover"
                src={post.author.profilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-medium">{post.author.username}</h1>
          </Link>
          {post.author._id === user._id && (
            <Badge className="bg-zinc-700 hover:bg-zinc-700">Author</Badge>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="max-sm:w-[80%] max-sm:rounded-xl max-sm:text-sm">
            <button className="cursor-pointer px-5 py-3 transparent border-b border-zinc-700 text-white outline-none">
              Go to post
            </button>
            {user._id === post.author._id && (
              <button
                onClick={deletePost}
                className="cursor-pointer px-5 py-3 border-b border-zinc-700 transparent text-red-500 outline-none"
              >
                Delete
              </button>
            )}
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
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="aspect-square w-full object-cover my-2 rounded border border-zinc-800"
        src={post.image}
        alt=""
      />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <i
            onClick={likeOrDislike}
            className={`ri-heart-${
              liked ? "fill text-[#FF3440]" : "line hover:text-zinc-700"
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
      <p className="text-sm mb-2">
        {postLikesLength > 0
          ? `${postLikesLength} Likes`
          : "Be the first one to like this"}
      </p>
      <p className="w-full truncate">
        <span className="font-medium">{post.author.username}</span>
        <span className="ml-2">{post.caption}</span>
      </p>
      <span
        onClick={() => setOpenPost(true)}
        className="text-sm cursor-pointer text-zinc-500"
      >
        {postCommentsLength > 0
          ? `View all ${postCommentsLength} comments`
          : ""}
      </span>
      <CommentDialog
        openPost={openPost}
        setOpenPost={setOpenPost}
        post={post}
        setPostCommentsLength={setPostCommentsLength}
        liked={liked}
        setLiked={setLiked}
        postLikesLength={postLikesLength}
        setPostLikesLength={setPostLikesLength}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
      ></CommentDialog>
      <div className="flex items-center justify-between">
        <input
          className="bg-transparent w-full text-sm py-2 mr-5 outline-none"
          type="text"
          placeholder="Add a comment..."
          onChange={commentHandler}
          value={text}
        />
        {text && (
          <span
            onClick={postComment}
            className="text-sm font-medium text-blue-500 cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
