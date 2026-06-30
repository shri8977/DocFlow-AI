import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth");
  }, [navigate]);

  return <div>Redirecting to sign in...</div>;
};

export default AuthCallback;
