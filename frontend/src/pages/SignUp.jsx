import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../context/authContext";

const SignUp = () => {
  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
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
        "https://snapverse-backend-one.vercel.app/user/register",
        formData,
        { withCredentials: true }
      );
      if (res) {
        toast.success(res.data);
        navigate("/");
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated("true");
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
          Sign up to see photos from your friends.
        </span>
        <div className="flex flex-col gap-5">
          <input
            type="text"
            className="w-80 px-3 py-2 text-sm outline-none border border-zinc-700 bg-zinc-900"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            required
          />
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
          <Link to="/login" className="text-blue-500 px-2 font-medium">
            Log in
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
            Sign up
          </button>
        )}
      </form>
    </div>
  );
};

export default SignUp;
