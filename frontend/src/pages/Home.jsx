// import RightSidebar from "@/components/RightSidebar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/feed";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className="w-full h-full flex bg-black relative">
      <Sidebar></Sidebar>
      <Feed></Feed>
      {/* <RightSidebar /> */}
    </div>
  );
};

export default Home;
