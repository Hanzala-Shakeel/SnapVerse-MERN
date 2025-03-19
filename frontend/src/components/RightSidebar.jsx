import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user, suggestedUsers } = useContext(AuthContext);

  return (
    <div className="w-[347px] h-screen py-10 px-5 ml-[10%] max-lg:hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user._id}`}>
            <Avatar>
              <AvatarImage
                className="w-8 h-8 rounded-full"
                src={user.profilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${user._id}`} className="mr-5 text-white">
              {user.username}
            </Link>
            <span className="text-zinc-600 text-xs font-semibold truncate max-w-[200px]">
              {user.bio ? user.bio : "bio here..."}
            </span>
          </div>
        </div>
        <Link
          to={"/login"}
          className="text-blue-500 hover:text-blue-300 text-sm"
        >
          Switch
        </Link>
      </div>
      {suggestedUsers.length > 0 && (
        <h1 className="mt-5 text-zinc-500 font-medium text-sm">
          Suggested for you
        </h1>
      )}
      {suggestedUsers.map((user) => (
          <SuggestedUsers key={user._id} user={user} />
      ))}
    </div>
  );
};

export default RightSidebar;
