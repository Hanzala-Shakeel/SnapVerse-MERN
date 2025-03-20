import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/authContext";
import { Badge } from "@/components/ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import CommentDialog from "@/components/CommentDialog";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading states
import axios from "axios";
import { toast } from "sonner";
import FollowersDialog from "@/components/followersDialog";
import FollowingDialog from "@/components/followingDialog";

const Profile = () => {
  const { userId } = useParams();
  useGetUserProfile(userId);
  const { user, setSelectedUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, setUserProfile } = useContext(AuthContext);
  
  const loginUserProfile = userProfile?._id === user._id;
  const [isFollowing, setIsFollowing] = useState(false);

  function handleTabChange(tab) {
    setActiveTab(tab);
  }

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.savedPosts;

  const [openPost, setOpenPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);

  function handlePostClick(post) {
    setSelectedPost(post);
    setOpenPost(true);
  }

  const [postLikesLength, setPostLikesLength] = useState(0);
  const [postCommentsLength, setPostCommentsLength] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Update postLikesLength whenever selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setPostLikesLength(selectedPost.likes.length || 0);
      setPostCommentsLength(selectedPost.comments.length || 0);
      setLiked(selectedPost.likes.includes(user._id) || false);
      setIsSaved(user.savedPosts.includes(selectedPost._id) || false);
    }
  }, [selectedPost]);

  useEffect(() => {
    if (userProfile) {
      setIsLoading(false);
      setIsFollowing(userProfile?.followers.includes(user._id));
    }
  }, [userProfile]);

  useEffect(() => {
    return () => {
      setUserProfile(null);
    };
  }, []);

  async function followOrUnfollow() {
    try {
      const res = await axios.post(
        `http://localhost:3000/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data);
        setIsFollowing(!isFollowing);
        setUserProfile({
          ...userProfile,
          followers: isFollowing
            ? userProfile.followers.filter((id) => id !== user._id)
            : [...userProfile.followers, user._id],
        });
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  }

  return (
    <>
      <Sidebar />
      <FollowersDialog
        userProfile={userProfile}
        openFollowers={openFollowers}
        setOpenFollowers={setOpenFollowers}
      />
      <FollowingDialog
        userProfile={userProfile}
        openFollowing={openFollowing}
        setOpenFollowing={setOpenFollowing}
      />
      <div className="max-w-full min-h-screen flex justify-center text-white">
        <div className="w-full bg-black">
          <div className="py-10 flex justify-center max-sm:items-center gap-10 max-sm:gap-5 ml-[5%] max-md:my-10 max-md:ml-0">
            {isLoading ? (
              <Skeleton className="w-36 h-36 rounded-full max-md:w-20 max-md:h-20 bg-zinc-700" /> // Avatar skeleton
            ) : (
              <Avatar className="w-36 h-36 rounded-full max-md:w-20 max-md:h-20">
                <AvatarImage
                  className="w-full h-full object-cover"
                  src={userProfile?.profilePicture}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <div className="flex ml-10 max-sm:ml-0 flex-col">
              <div className="flex items-center gap-3 max-md:flex-col max-md:items-start">
                {isLoading ? (
                  <Skeleton className="w-48 h-8 rounded bg-zinc-700" /> // Username skeleton
                ) : (
                  <h1 className="text-xl mr-5 font-medium">
                    {userProfile?.username}
                  </h1>
                )}
                {isLoading ? (
                  <div className="flex gap-3">
                    <div className="w-24 h-8 max-sm:h-7 bg-zinc-700 rounded animate-pulse"></div>
                    <div className="w-24 h-8 max-sm:h-7 bg-zinc-700 rounded animate-pulse"></div>
                  </div>
                ) : loginUserProfile ? (
                  <div className="flex gap-3">
                    <Link to={"/account/edit"}>
                      <button className="px-4 h-8 max-sm:px-3 max-sm:h-7 bg-zinc-700 hover:bg-[#262626] transition-all rounded text-sm max-sm:text-xs font-medium">
                        Edit Profile
                      </button>
                    </Link>
                    <button className="px-4 h-8 max-sm:px-3 max-sm:h-7 bg-zinc-700 hover:bg-[#262626] transition-all rounded text-sm max-sm:text-xs font-medium">
                      View Archive
                    </button>
                  </div>
                ) : isFollowing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={followOrUnfollow}
                      className="px-4 h-8 max-sm:px-3 max-sm:h-7 bg-zinc-700 hover:bg-[#262626] transition-all rounded text-sm max-sm:text-xs font-medium"
                    >
                      Unfollow
                    </button>
                    <Link to={"/chat"}>
                      <button
                        onClick={() => setSelectedUser(userProfile)}
                        className="px-4 h-8 max-sm:px-3 max-sm:h-7 bg-zinc-700 hover:bg-[#262626] transition-all rounded text-sm max-sm:text-xs font-medium"
                      >
                        Message
                      </button>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={followOrUnfollow}
                    className="px-5 h-8 max-sm:px-3 max-sm:h-7 bg-[#0295F7] hover:bg-[#1777F2] transition-all rounded-[6px] text-sm max-sm:text-xs font-medium"
                  >
                    Follow
                  </button>
                )}
              </div>
              <div className="flex gap-10 mt-5 text-zinc-400 max-sm:hidden">
                {isLoading ? (
                  <>
                    <div className="w-20 h-6 bg-zinc-700 rounded animate-pulse"></div>
                    <div className="w-28 h-6 bg-zinc-700 rounded animate-pulse"></div>
                    <div className="w-24 h-6 bg-zinc-700 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="text-white font-medium">
                        {userProfile?.posts.length}
                      </span>{" "}
                      posts
                    </p>
                    <p
                      className="cursor-pointer"
                      onClick={() => setOpenFollowers(true)}
                    >
                      <span className="text-white font-medium">
                        {userProfile?.followers.length}
                      </span>{" "}
                      followers
                    </p>
                    <p
                      className="cursor-pointer"
                      onClick={() => setOpenFollowing(true)}
                    >
                      <span className="text-white font-medium">
                        {userProfile?.following.length}
                      </span>{" "}
                      following
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col items-start gap-3 mt-8 max-sm:text-sm">
                {isLoading ? (
                  <>
                    <div className="w-32 h-6 bg-zinc-700 rounded animate-pulse"></div>
                    <div className="w-24 h-6 bg-zinc-700 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <h1 className="font-medium whitespace-pre-line max-w-[300px]">
                      {userProfile?.bio}
                    </h1>
                    <Badge className="w-fit bg-zinc-700 hover:bg-[#262626]">
                      <AtSign className="max-sm:w-5" />
                      <span className="pl-2">{userProfile?.username}</span>
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center h-10 gap-10 py-5 text-sm text-zinc-400 sm:hidden border-t border-zinc-700">
            <p>
              <span className="text-white font-medium">
                {userProfile?.posts.length}
              </span>{" "}
              posts
            </p>
            <p onClick={() => setOpenFollowers(true)}>
              <span className="text-white font-medium">
                {userProfile?.followers.length}
              </span>{" "}
              followers
            </p>
            <p onClick={() => setOpenFollowing(true)}>
              <span className="text-white font-medium">
                {userProfile?.following.length}
              </span>{" "}
              following
            </p>
          </div>
          <div className="w-[83%] ml-[17%] max-md:mb-20 max-xl:w-full max-xl:ml-0 max-xl:pl-[80px] max-md:pl-0 max-md:ml-0 flex justify-center">
            <div className="w-[935px] max-lg:w-full border-t border-zinc-700">
              <div className="flex justify-center gap-10">
                <p
                  onClick={() => handleTabChange("posts")}
                  className={`text-sm py-5 cursor-pointer ${
                    activeTab === "posts"
                      ? "font-bold text-[#fff] border-t border-white"
                      : "text-zinc-600"
                  }`}
                >
                  POSTS
                </p>
                {loginUserProfile && (
                  <p
                    onClick={() => handleTabChange("saved")}
                    className={`text-sm py-5 cursor-pointer ${
                      activeTab === "saved"
                        ? "font-bold text-[#fff] border-t border-white"
                        : "text-zinc-600"
                    }`}
                  >
                    SAVED
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 mb-10">
                {selectedPost && (
                  <CommentDialog
                    openPost={openPost}
                    setOpenPost={setOpenPost}
                    post={selectedPost}
                    selectedPost={selectedPost}
                    setSelectedPost={setSelectedPost}
                    postCommentsLength={postCommentsLength}
                    setPostCommentsLength={setPostCommentsLength}
                    liked={liked}
                    setLiked={setLiked}
                    postLikesLength={postLikesLength}
                    setPostLikesLength={setPostLikesLength}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                  />
                )}
                {displayedPost && !isLoading
                  ? displayedPost.map((post) => {
                      return (
                        <div
                          key={post._id}
                          onClick={() => handlePostClick(post)}
                          className="relative group cursor-pointer"
                        >
                          <img className="" src={post.image} alt="" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="flex items-center text-white space-x-4 max-sm:text-xs max-sm:space-x-2">
                              <button className="flex items-center gap-2 hover:text-zinc-300">
                                <Heart />
                                <span>{post.likes.length}</span>
                              </button>
                              <button className="flex items-center gap-2 hover:text-zinc-300">
                                <MessageCircle />
                                <span>{post.comments.length}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : // Skeleton loading for posts
                    Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="relative cursor-pointer">
                          <div className="w-full h-72 bg-zinc-700 animate-pulse"></div>
                          {/* Display loading skeleton for likes and comments */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="flex items-center text-white space-x-4 max-sm:text-xs max-sm:space-x-2">
                              <button className="flex items-center gap-2">
                                {/* Loading skeleton for the like icon and number */}
                                <div className="w-5 h-5 bg-zinc-700 rounded-full animate-pulse"></div>
                                <div className="w-8 h-4 bg-zinc-700 animate-pulse"></div>
                              </button>
                              <button className="flex items-center gap-2 max-sm:hidden">
                                {/* Loading skeleton for the comment icon and number */}
                                <div className="w-5 h-5 bg-zinc-700 rounded-full animate-pulse"></div>
                                <div className="w-8 h-4 bg-zinc-700 animate-pulse"></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
