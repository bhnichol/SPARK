import { useNavigate } from "react-router";
import useLogout from "../hooks/useLogout";

const Home = () => {
    const logout = useLogout();

    const navigate = useNavigate();
    const handleLogout= async () => {
      await logout();
      navigate('/login')
  
    };

    return (
        <div>
        <div className="text-3xl">Home</div>
        <button onClick={() => handleLogout()}> Logout</button>
        </div>
    )
}
export default Home;