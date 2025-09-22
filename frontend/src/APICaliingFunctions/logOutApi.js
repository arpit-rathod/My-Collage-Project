import axios from "axios";
import toast from "react-hot-toast";

// Logout
async function logOutUser() {
     try {
          const response = await axios.post(
               `${import.meta.env.VITE_API_URL}/logout`,
               {},
               { withCredentials: true }
          );
          if (response.status === 200) {
               console.log(response.data.message || "Logged out");
               setTimeout(() => window.location.reload(), 200);
          }
     } catch (error) {
          console.error("Logout error", error);
          toast.error("Unable to log out, try again or later")
     }
}

export default logOutUser;