import Posts from "./Posts";
import RightSidebar from "./RightSidebar";

const Feed = () => {
  return (
    <div className="w-full h-full flex justify-center max-md:ml-0 max-md:my-[66px] ml-[17%] text-white">
      <Posts></Posts>
      <RightSidebar />
    </div>
  );
};

export default Feed;
