import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useAppDispatch } from "@/redux/hooks";
import toast from "react-hot-toast";
import { error } from "console";

const AuthRedirect = () => {
  const navigate = useNavigate();

  const dispatch=useAppDispatch()

  useEffect(() => {
    apiClient
      .get("/api/auth/user")
      .then((res) => console.log(res.data))
      .catch((error) => console.log("google auth error",error));
  }, []);

  return <h2>Logging in...</h2>;
};

export default AuthRedirect;
