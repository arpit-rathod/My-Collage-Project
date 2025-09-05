import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
export default function LoginModal({ onClose }) {
     const [showPassword, setShowPassword] = useState(false);
     // const [password, setPassword] = useState('');
     const [isFocused, setIsFocused] = useState(false);
     const { register, handleSubmit, formState: { errors } } = useForm();
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
                         console.log("Login successful");
                         toast.success("Login successful");
                         setTimeout(() => {
                              window.location.reload();
                         }, 100);
                    } else if (response.status == 400) {
                         console.log("please fill all fields", response.data)
                         toast.error("please fill all fields");
                    } else if (response.status == 404) {
                         console.log("Invalid username or password", response.data)
                         toast.error("Invalid username or password");
                    } else if (response.status == 500) {
                         console.log("Internal server error", response.data)
                         toast.error("Internal server error");
                    }
               }
          } catch (error) {
               // alert("Login failed. Please check your credentials.");
               console.error("Login failed:", error);
               toast.error("Login failed. Please check your credentials.");
          }
     }
     function hadleShowPassward() {
          console.log("toggle show passward run");

          setShowPassword(!showPassword);
     }
     const inputStyle = `w-full px-4 py-3 pr-12 rounded-lg transition-all duration-300 ease-in-out outline-none border-2 border-white focus:ring-0 focus:border-none focus:bg-white focus:outline-none ${isFocused ? '' : ''} text-gray-700 focus:text-black-900/100 font-medium`;
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
                                   {...register("username", { required: true })}
                              />

                              <br />
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
                                        // onFocus={() => setIsFocused(true)}
                                        // onBlur={() => setIsFocused(false)}
                                        {...register("password", { required: true })}
                                   />
                                   <div onClick={hadleShowPassward} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors duration-200 focus:outline-none">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                   </div>
                              </div>







                              <br />
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