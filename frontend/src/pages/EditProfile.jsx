import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthContext } from "@/context/authContext";
import { Loader2 } from "lucide-react";
import { useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePicture: user.profilePicture,
    bio: user.bio,
    gender: user.gender,
  });

  function fileChangeHandler(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) setInput({ ...input, profilePicture: selectedFile });
  }

  function selectChangeHandler(value) {
    setInput({ ...input, gender: value });
  }

  async function editProfileHandler() {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);

      if (input.profilePicture) {
        formData.append("profilePicture", input.profilePicture);
      }
      const res = await axios.post(
        "http://localhost:3000/user/profile/edit",
        formData,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate(`/profile/${user._id}`);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Sidebar></Sidebar>
      <div className="max-w-full h-screen max-sm:h-full flex justify-center bg-black text-white">
        <div className="mt-10 max-sm:my-20 max-sm:px-5 max-sm:w-full flex flex-col gap-10">
          <h1 className="text-xl font-medium max-sm:text-lg">Edit profile</h1>
          <div className="flex justify-between items-center w-[638px] max-sm:w-full bg-[#262626] p-5 rounded-xl">
            <div className="flex items-center gap-3">
              <Avatar className="w-[60px] h-[60px] rounded-full">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col font-medium">
                {user.username}
                <span className="text-zinc-400 text-sm font-normal whitespace-pre-line max-w-[300px] max-sm:hidden">
                  {user.bio || "Bio here..."}
                </span>
                <button
                  onClick={() => imageRef.current.click()}
                  className="text-[#0295F7] text-sm sm:hidden"
                >
                  Change Photo
                </button>
              </div>
            </div>
            <input
              onChange={fileChangeHandler}
              ref={imageRef}
              type="file"
              className="hidden"
            />
            <button
              onClick={() => imageRef.current.click()}
              className="bg-[#0295F7] hover:bg-[#1777F2] font-medium text-sm px-5 py-2 rounded-[10px] transition-all max-sm:hidden"
            >
              Change Photo
            </button>
          </div>
          <div>
            <h1 className="text-lg font-medium">Bio</h1>
            <textarea
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              className="mt-3 bg-transparent w-full px-4 py-3 border border-zinc-700 outline-none resize-none rounded-xl"
            ></textarea>
          </div>
          <div>
            <h1 className="text-lg font-medium">Gender</h1>
            <Select
              defaultValue={input.gender}
              onValueChange={selectChangeHandler}
            >
              <SelectTrigger className="mt-3 w-full bg-transparent outline-none border border-zinc-700 py-7 text-md rounded-xl">
                <SelectValue placeholder="Prefer not to say" />
              </SelectTrigger>
              <SelectContent className="bg-[#262626] text-white outline-none border-none rounded-xl">
                <SelectItem
                  className="rounded-xl cursor-pointer hover:bg-[#262626] py-3"
                  value="male"
                >
                  Male
                </SelectItem>
                <SelectItem
                  className="rounded-xl cursor-pointer hover:bg-[#262626] py-3"
                  value="female"
                >
                  Female
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex justify-end mt-5">
            {loading ? (
              <button className="flex justify-center items-center gap-2 bg-[#0295F7] hover:bg-[#1777F2] font-medium text-sm px-6 py-2 rounded-[10px] transition-all">
                <Loader2 className="animate-spin" />
                Please wait
              </button>
            ) : (
              <button
                onClick={editProfileHandler}
                className="bg-[#0295F7] hover:bg-[#1777F2] font-medium text-sm px-6 py-2 rounded-[10px] transition-all max-sm:w-1/2"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
