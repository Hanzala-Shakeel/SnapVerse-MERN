import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const SuggestedUsers = ({ user }) => {
  return (
    <div className="flex items-center gap-3 justify-between mt-3">
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
          <Link to={`/profile/${user._id}`} className="mr-5 text-white">{user.username}</Link>
          <span className="text-zinc-600 text-xs font-semibold">
            Suggested for you
          </span>
        </div>
      </div>
      <Link to={`/profile/${user._id}`} className="text-blue-500 hover:text-blue-300 text-sm">View</Link>
    </div>
  );
};

export default SuggestedUsers;
