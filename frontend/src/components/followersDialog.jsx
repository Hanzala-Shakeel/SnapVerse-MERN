import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DialogContent } from "./ui/dialog";
import { Dialog } from "./ui/dialog";
import axios from "axios";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { Badge } from "./ui/badge";

const FollowersDialog = ({ userProfile, openFollowers, setOpenFollowers }) => {
  const [followers, setFollowers] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  async function fetchFollowersData() {
    setIsLoading(true);
    if (userProfile) {
      try {
        const res = await axios.get(
          `http://localhost:3000/user/getuserfollowers/${userProfile._id}`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          setFollowers(res.data.followers);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err.response.data);
      }
    }
  }

  useEffect(() => {
    fetchFollowersData();
  }, [userProfile]);

  return (
    <Dialog open={openFollowers} onOpenChange={setOpenFollowers}>
      <DialogContent className="focus:outline-none text-white w-[350px] h-[350px] flex flex-col max-sm:rounded-xl max-sm:w-[80%] max-sm:text-sm">
        <div className="py-3 border-b border-zinc-700">
          <h1 className="text-center font-medium">Followers</h1>
        </div>
        <div className="w-full h-full overflow-y-auto">
          {followers.length > 0 && !isloading ? (
            followers.map((follower, index) => (
              <div key={index} className="w-full mt-5 px-5">
                <Link
                  className="flex items-center gap-3"
                  to={`/profile/${follower._id}`}
                  onClick={() => setOpenFollowers(false)}
                >
                  <Avatar className="w-8 h-8 rounded-full">
                    <AvatarImage
                      className="w-full h-full object-cover"
                      src={follower.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <h1>{follower.username}</h1>
                  {user._id === follower._id ? (
                    <Badge className="bg-zinc-600">you</Badge>
                  ) : (
                    ""
                  )}
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center w-full h-full flex flex-col">
              <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                <svg
                  aria-label="Followers"
                  className="x1lliihq x1n2onr6 x5n08af"
                  fill="currentColor"
                  height="96"
                  role="img"
                  viewBox="0 0 96 96"
                  width="96"
                >
                  <title>Followers</title>
                  <circle
                    cx="48"
                    cy="48"
                    fill="none"
                    r="47"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></circle>
                  <path
                    d="M64.996 37.999a10 10 0 1 1-10-10.001 10 10 0 0 1 10 10Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M71.998 65.999v-1.622A10.375 10.375 0 0 0 61.622 54h-13.25a10.374 10.374 0 0 0-10.375 10.376v1.622"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                  <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                    x1="27.998"
                    x2="27.998"
                    y1="39.003"
                    y2="54.995"
                  ></line>
                  <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                    x1="36.001"
                    x2="20"
                    y1="46.996"
                    y2="46.996"
                  ></line>
                </svg>
                <h1>No followers</h1>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
