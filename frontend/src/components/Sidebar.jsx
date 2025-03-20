import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import {
  Compass,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Search,
  SquarePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import CreatePost from "./CreatePost";
import { NotificationContext } from "@/context/notificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, user, setUser } = useContext(AuthContext);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const { likeNotification, setLikeNotification } =
    useContext(NotificationContext);

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search className="max-sm:hidden" />, text: "Search" },
    { icon: <Compass className="max-sm:hidden" />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <SquarePlus />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6 rounded-full overflow-hidden">
          <AvatarImage src={user.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Log out" },
  ];

  async function logout() {
    try {
      const res = await axios.post(
        "http://localhost:3000/user/logout",
        {},
        { withCredentials: true }
      );
      if (res) {
        toast.success(res.data);
        navigate("/login");
        setIsAuthenticated("false");
        setUser(null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
      }
    } catch (err) {
      return toast.error(err.response.data || err);
    }
  }

  function handleSelect(text) {
    if (text === "Log out") logout();
    else if (text === "Create") setOpenCreatePost(true);
    else if (text === "Profile") navigate(`/profile/${user._id}`);
    else if (text === "Home") navigate(`/`);
    else if (text === "Messages") navigate(`/chat`);
  }

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePopoverChange = (open) => {
    setIsPopoverOpen(open);

    // If the popover is closing, clear notifications
    if (!open) {
      setLikeNotification([]);
    }
  };

  return (
    <div className="w-[17%] max-xl:w-[80px] max-md:w-full max-md:h-[60px] max-md:flex max-md:justify-center max-md:bottom-0 max-md:top-auto max-md:py-3 max-md:border-t fixed top-0 left-0 z-10 px-5 max-sm:px-0 py-10 border-r border-zinc-700 h-screen text-white bg-black">
      <div className="p-3 max-md:bg-black max-md:px-5 max-md:py-4 max-xl:hidden max-md:block max-md:fixed max-md:left-0 max-md:top-0 max-md:w-full max-md:border-b border-zinc-700">
        <h1 className="logo text-3xl max-md:text-2xl max-sm:text-2xl">
          SnapVerse
        </h1>
      </div>
      <div className="py-10 max-md:py-3 max-md:w-full flex flex-col max-md:gap-0 gap-5 max-md:flex-row max-md:justify-around max-xl:items-center">
        {sidebarItems.map(
          (item, index) =>
            !item.icon.props.className?.includes("max-sm:hidden") && (
              <div
                key={index}
                onClick={() => handleSelect(item.text)}
                className="items flex items-center relative gap-3 max-md:gap-0 hover:bg-[#1A1A1A] rounded max-md:p-0 p-3 cursor-pointer"
              >
                {item.icon}
                <span className="max-xl:hidden">{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover onOpenChange={handlePopoverChange}>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-[#FF3440]"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-zinc-800 border-none text-white mt-5 ml-5 rounded py-2">
                        <div className="flex flex-col gap-3">
                          {likeNotification.length === 0 ? (
                            <p>No new Notification</p>
                          ) : (
                            likeNotification.map((notification, index) => {
                              return (
                                <div
                                  className="flex gap-2 items-center"
                                  key={notification.userId}
                                >
                                  <Avatar className>
                                    <AvatarImage
                                      className="object-cover"
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notification.userDetails?.username}{" "}
                                    </span>
                                    like your post
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            )
        )}
      </div>
      <CreatePost
        openCreatePost={openCreatePost}
        setOpenCreatePost={setOpenCreatePost}
        user={user}
      />
    </div>
  );
};

export default Sidebar;
