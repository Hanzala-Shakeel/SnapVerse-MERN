import { useState, useRef, useContext } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getCroppedImg } from "../utils/getCroppedImg"; // Utility function to get the cropped image (defined below)
import upload from "../assets/upload.png";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { PostsContext } from "@/context/postsContext";
import { AuthContext } from "@/context/authContext";

const CreatePost = ({ openCreatePost, setOpenCreatePost, user }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // Preview URL
  const imageRef = useRef();
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Crop position
  const [zoom, setZoom] = useState(1); // Zoom level
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // Cropped area details
  const [loading, setLoading] = useState(false);
  const { posts, setPosts } = useContext(PostsContext);
  const { userProfile, setUserProfile } = useContext(AuthContext);

  function fileChangeHandler(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Preview image
    }
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels); // Save the cropping area in pixels
  };

  const handleCropImage = async () => {
    try {
      const { blob, fileUrl } = await getCroppedImg(
        imagePreview,
        croppedAreaPixels
      ); // Get cropped image Blob and URL

      // Convert the Blob into a File object to upload
      const croppedFile = new File([blob], "croppedImage.jpg", {
        type: "image/jpeg",
      });

      createPostHandler(croppedFile); // You can handle the cropped image further (upload, etc.)
    } catch (err) {
      console.error(err);
    }
  };

  async function fetchUserProfile() {
    try {
      const res = await axios.get(
        `http://localhost:3000user/profile/${userProfile._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setUserProfile(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function createPostHandler(file) {
    setLoading(true);
    if (!file) return toast.error("image is required");

    const formData = new FormData();
    formData.append("postImage", file);
    formData.append("caption", caption);

    try {
      const res = await axios.post(
        "http://localhost:3000/post/create",
        formData,
        { withCredentials: true }
      );
      if (res) {
        toast.success(res.data.message);
        setPosts([res.data.newPost, ...posts]);
      }
    } catch (err) {
      toast.error(err.response.data || err);
    } finally {
      setLoading(false);
      setCaption("");
      setOpenCreatePost(false);
      imageRef.current = null;
      setImagePreview("");
      if (userProfile) {
        fetchUserProfile();
      }
    }
  }

  return (
    <Dialog open={openCreatePost}>
      <DialogContent
        className="outline-none p-4 text-white"
        onInteractOutside={() => setOpenCreatePost(false)}
      >
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center py-3">
          <Avatar>
            <AvatarImage
              className="w-8 h-8 rounded-full"
              src={user.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <h1 className="font-semibold">{user.username}</h1>
            <span className="text-zinc-700">Bio here...</span>
          </div>
        </div>
        <textarea
          className="text-sm bg-transparent py-3 outline-none resize-none "
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
        {/* Image cropping area */}
        {imagePreview && (
          <>
            <div className="relative w-full h-64">
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={1} // Aspect ratio of 1:1 (square) like Instagram
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete} // Trigger on crop completion
              />
            </div>
            <div className="flex justify-center mt-4">
              {loading ? (
                <button className="w-1/2 py-2 bg-green-500 hover:bg-green-600 rounded text-sm flex items-center justify-center">
                  <Loader2 className="mr-4 animate-spin"></Loader2>
                  Please wait
                </button>
              ) : (
                <button
                  onClick={handleCropImage}
                  className="w-1/2 py-2 bg-green-500 hover:bg-green-600 rounded text-sm"
                >
                  Crop and Save
                </button>
              )}
            </div>
          </>
        )}
        {!imagePreview && (
          <div className="flex flex-col items-center gap-5">
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              onChange={fileChangeHandler}
            />
            <img className="w-24" src={upload} alt="" />
            <button
              onClick={() => imageRef.current.click()}
              className="px-3 py-2 font-medium bg-blue-500 hover:bg-blue-600 rounded text-sm"
            >
              Select from computer
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
