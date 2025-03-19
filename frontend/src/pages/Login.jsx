import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate();

  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/user/login",
        formData,
        { withCredentials: true }
      );
      if (res) {
        toast.success(res.data.message);
        navigate("/");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(res.data.LoggedInUser));
        setIsAuthenticated("true");
        setUser(res.data.LoggedInUser);
      }
    } catch (err) {
      toast.error(err.response.data || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-100 max-sm:w-full text-center flex flex-col items-center p-10 gap-5 border border-zinc-700 max-sm:border-0"
      >
        <h1 className="logo text-5xl">SnapVerse</h1>
        <span className="text-base font-bold text-zinc-600">
          Login to see photos from your friends.
        </span>
        <div className="flex flex-col gap-5">
          <input
            type="email"
            className="w-80 px-3 py-2 text-sm outline-none border border-zinc-700 bg-zinc-900"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="w-80 px-3 py-2 text-sm outline-none border border-zinc-700 bg-zinc-900"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-sm">
          Have an account?{" "}
          <Link to="/signup" className="text-blue-500 px-2 font-medium">
            Sign up
          </Link>
        </div>
        {loading ? (
          <button
            type="submit"
            className="w-80 px-5 py-2 font-medium bg-blue-500 rounded text-sm flex justify-center"
          >
            <Loader2 className="animate-spin w-5 h-5"></Loader2>
          </button>
        ) : (
          <button
            type="submit"
            className="w-80 px-5 py-2 font-medium bg-blue-500 rounded text-sm"
          >
            Login
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
