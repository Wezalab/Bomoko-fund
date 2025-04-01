import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "@/lib/env";
import { useAppDispatch } from "@/redux/hooks";
import toast from "react-hot-toast";
import { error } from "console";

const AuthRedirect = () => {
  const navigate = useNavigate();

  const dispatch=useAppDispatch()

  useEffect(() => {
    axios
      .get("http://localhost:7007/api/auth/user", { withCredentials: true })
      .then((res) => console.log(res.data))
      .catch((error) => console.log("google auth error",error));
  }, []);

  return <h2>Logging in...</h2>;
};

export default AuthRedirect;
