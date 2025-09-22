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

     const handleInputChange = (e) => {
          const { name, value } = e.target;
          // remove api error when focus on input after 
          console.log(name, value);

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
                         setTimeout(() => {
                              window.location.reload();
                         }, 100);
                    }
               }
          } catch (error) {
               // alert("Login failed. Please check your credentials.");
               console.error("Login failed:", error);
               // toast.error("Login failed. Please check your credentials.");
               if (error.status == 400) {
                    console.log("please fill all fields")
                    toast.error("please fill all fields");
               } else if (error.status == 404) {
                    console.log(error.response.data)
                    setAPIError(() => ({
                         usernameMsg: error.response.data?.usernameMsg,
                         passwardMsg: error.response.data?.passwordMsg,
                    }))
                    toast.error(error.response.data.message);
               } else if (error.status == 500) {
                    console.log("Internal server error", error.data)
                    toast.error("Internal server error");
               }

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

                                   <button
                                        type="submit" // Changed to submit type
                                        className="px-4 py-2 my-4 w-full md:w-[30vh] rounded-xl hover:scale-105 duration-75 bg-amber-800 text-white font-black bg-gradient-to-r from-red-900 to-red-700">
                                        Login
                                   </button>
                              </div>
                         </div>
                    </form>
               </div>
          </div>
     );
}