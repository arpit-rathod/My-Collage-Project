import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from "js-cookie";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
export default function LoginModal({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [APIError, setAPIError] = useState({ usernameMsg: "", passwardMsg: "" });
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [logging, setLogging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // remove api error when focus on input after 

    setTimeout(() => {
      setAPIError(prev => (
        {
          ...prev,
          name: ""
        }
      ))
    }, 5000)
  }
  async function onLogin(data) {
    setLogging(true);
    const loginInfo = {
      username: data.username,
      password: data.password,
    };
    console.log("onlogin run for ", loginInfo);
    try {
      // { headers: { authorization: `Bearer ${token}`, } },
      console.log(import.meta.env.VITE_API_URL);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/Login`, loginInfo, {
        withCredentials: true,

      });
      if (response.data) {
        console.log(response.data);
        if (response.status == 200) {
          Cookies.set("uiRole_token", response.data.uiRole_token, { expires: 7 });
          console.log("Login successful");
          toast.success("Login successful");
        }
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      // alert("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
      // toast.error("Login failed. Please check your credentials.");
      if (error.status == 400) {
        console.log("please fill all fields")
        toast.error(error.data.message || error.data.error || "status code 400 , Required all fields");
      } else if (error.status == 404) {
        console.log(error.response.data)
        setAPIError(() => ({
          usernameMsg: error.response.data?.usernameMsg,
          passwardMsg: error.response.data?.passwordMsg,
        }))
        toast.error(error.data.message || error.data.error || "status code 404 , Unauthorized request");
      } else if (error.status == 500) {
        console.log("Internal server error", error.data)
        toast.error(error.data.message || error.data.error || "status code 505 , internal server error.");
      }

    } finally {
      setLogging(false);
    }
  }
  function hadleShowPassword() {
    console.log("toggle show passward run");
    setShowPassword(!showPassword);
  }
  const inputStyle = `w-full px-4 py-3 pr-12 rounded-lg transition-all duration-300 ease-in-out outline-none border-2 border-white focus:ring-0 focus:border-none focus:bg-white focus:outline-none text-gray-700 focus:text-black-900/100 font-medium`;
  const passwardEyeDivStyle = ``;
  const lableStyle = `block text-sm font-semibold text-white mb-2 mt-5`
  // const inputStyle = `focus:bg-red-500/30 focus:border-none px-10 p-2 w-full mb-2 my-4 rounded-xl hover:scale-105 duration-75`
  return (
    <div className="backdrop-blur-md fixed inset-0 flex justify-center items-center bg-blur z-99">
      <div className="bg-black/30 w-full h-full md:w-[50%] md:h-[70%] p-6 rounded-lg shadow-md shadow-black relative flex justify-center items-center font-mono">
        <form onSubmit={handleSubmit(onLogin)} className="flex flex-nowrap justify-center w-full">
          <button
            type="button" // Added button type to prevent form submission textsetTim-gray-600
            onClick={onClose}
            className="absolute top-5 right-5   text-white  hover:bg-red-700/30  px-4 py-2 rounded-3xl"
          >
            ✖
          </button>
          <div className="w-[70%]">
            {/* <div></div> */}
            <h2 className="text-xl text-center font-bold px-auto text-white " >Login</h2>
            <label className={`${lableStyle}`}>
              Username/Enrollment No.
            </label>
            <input
              type="text"
              placeholder="Username / Enrollment No."
              className={`${inputStyle}`}
              // onFocus={() => setIsFocused(true)}
              // onBlur={() => setIsFocused(false)}
              {...register("username", {
                required: true,
                onChange: (e) => {
                  // ✅ this ensures RHF tracks changes
                  handleInputChange(e);
                },
              })}
            />
            <br />
            {APIError.usernameMsg &&
              <div className="m-2 p-1  text-sm text-red-800 font-medium" >{APIError.usernameMsg}</div>

            }
            {errors.username && <span className="text-sm text-red-900">
              Username is required</span>}
            <label className={`${lableStyle}`}>
              Password
            </label>
            <div className={`${passwardEyeDivStyle} relative`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`${inputStyle}`}

                {...register("password", {
                  required: true,
                  onChange: (e) => {
                    handleInputChange(e);
                  }
                })}
              />
              <div onClick={hadleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors duration-200 focus:outline-none">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <br />
            {APIError.passwardMsg &&
              <div className="p-2 text-sm text-red-800" >{APIError.passwardMsg}</div>

            }
            {errors.password && <span className="text-sm text-red-900">
              Password is required</span>}

            <div className="grid place-items-center">
              <div className="relative inline-block group">
                {/* White moving border - appears ONLY when loading */}
                {logging && (
                  <div className="absolute inset-0 rounded-xl border-4 border-white/90 bg-transparent animate-border-spin"></div>
                )}
                {/* {logging && (
                  <div className="absolute inset-0 rounded-xl border-4 border-white/90 animate-spin-slow"></div>
                )} */}
                <button
                  type="submit"
                  disabled={logging}
                  className="relative px-5 py-3 w-full md:w-[30vh] rounded-xl 
                hover:scale-105 duration-150 bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white 
                font-black shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 
                border-2 border-transparent hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-red-500/30 z-10">
                  {logging ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Logging..
                    </span>) : (
                    "Login"
                  )}

                </button>
              </div>

              {/* <style jsx global>{`
        @keyframes border-spin {
          0% {
            transform: rotate(0deg);
            clip-path: polygon(0 0, 100% 0, 100% 20%, 0 20%);
          }
          25% {
            clip-path: polygon(100% 20%, 100% 100%, 80% 100%, 80% 20%);
          }
          50% {
            clip-path: polygon(80% 100%, 0 100%, 0 80%, 80% 80%);
          }
          75% {
            clip-path: polygon(0 80%, 20% 80%, 20% 100%, 0 100%);
          }
          100% {
            transform: rotate(360deg);
            clip-path: polygon(0 0, 100% 0, 100% 20%, 0 20%);
          }
        }
        .animate-border-spin {
          animation: border-spin 2s linear infinite;
        }
      `}</style> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// function LoginButton() {

//   const [isLoading, setIsLoading] = useState(false);
//   const handleLogin = () => {
//     setIsLoading(true);

//     // Simulate login request (remove this in real app)
//     setTimeout(() => {
//       setIsLoading(false);
//       alert('Login complete!');
//     }, 3000);
//   };

//   return (
//     // <div className="flex items-center justify-center min-h-screen bg-gray-900">
//     // <div className="p-8">
//     <div className="relative inline-block">
//       {/* Animated spinning border - Tailwind classes only */}
//       {isLoading && (
//         <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-ping">
//           <div className="absolute inset-0 rounded-xl bg-gray-900"></div>
//         </div>
//       )}

//       {/* Alternative: Pure spinning border */}
//       {isLoading && (
//         <div className="absolute inset-0 rounded-xl border-4 border-transparent border-t-white/80 border-r-white/80 animate-spin-slow"></div>
//       )}

//       {/* Your actual button */}
//       <button
//         type="submit"
//         disabled={isLoading}
//         onClick={handleLogin}
//         className="relative px-8 py-4 w-full md:w-[30vh] rounded-xl hover:scale-105 duration-150 bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white font-black shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 border-2 border-transparent hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-red-500/30"
//       >
//         {isLoading ? (
//           <span className="flex items-center justify-center gap-2">
//             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//             Processing...
//           </span>
//         ) : (
//           'Login'
//         )}
//       </button>
//     </div>
//     // </div>
//     // </div>
//   );
// }
