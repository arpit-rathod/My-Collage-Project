import React from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from "js-cookie"

export default function LoginModal({ onClose }) {
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

               const response = await axios.post(`${import.meta.env.VITE_API_URL}/Login`, loginInfo);
               if (response.data) {
                    console.log(response.data);
                    if (response.status == 200) {
                         alert("Login successful");
                         // console.log("cookie set", document.cookie);
                         // if (!document.cookie) {
                         //      alert("cookie not set automatically");
                         //      const auth_token = response.data?.auth_token;
                         //      Cookies.set("auth_token", auth_token);
                         //      console.log("manually cookie set in cookies", auth_token);
                         // } else {
                         //      alert("cookie automatically set");
                         //      console.log("cookie already set", document.cookie);
                         // }
                         setTimeout(() => {
                              window.location.reload();
                         }, 60000);
                    } else {
                         alert("wrong password")
                    }
               }
          } catch (error) {
               alert("Login failed. Please check your credentials.");
               console.error("Login failed:", error.response?.data || error.message);
          }
     }
     const inputStyle = `focus:bg-white focus:border-none px-10`
     return (
          <div className="fixed inset-0 flex justify-center items-center bg-transparent">
               <div className="w-full md:w-[50%] h-full md:h-[70%] bg-white p-6 rounded-lg shadow-md shadow-black relative flex justify-center font-mono">
                    <form onSubmit={handleSubmit(onLogin)} className="flex flex-nowrap justify-center w-full">
                         <button
                              type="button" // Added button type to prevent form submission
                              onClick={onClose}
                              className="absolute top-2 right-2 textsetTim-gray-600 hover:bg-gray-200 px-4 py-2 rounded-3xl"
                         >
                              ✖
                         </button>
                         <div className="w-[70%]">
                              {/* <div></div> */}
                              <h2 className="text-xl text-center font-bold px-auto text-gray-700">Login</h2>
                              <input
                                   type="text"
                                   placeholder="Username / Enrollment No."
                                   className={`p-2 w-full mb-2 my-4 rounded-[10px] hover:scale-105 duration-75 ${inputStyle}`}
                                   {...register("username", { required: true })}
                              />
                              <br />
                              {errors.username && <span className="text-sm text-red-900">
                                   Username is required</span>}
                              <input
                                   type="password"
                                   placeholder="Password"
                                   className={`p-2 w-full mb-2 my-4 rounded-3xl hover:scale-105 focus: duration-75 ${inputStyle}`}
                                   {...register("password", { required: true })}
                              />
                              <br />
                              {errors.password && <span className="text-sm text-red-900">
                                   Password is required</span>}

                              <div className="grid place-items-center">

                                   <button
                                        type="submit" // Changed to submit type
                                        className="px-4 py-2 my-4 rounded-3xl hover:scale-105 duration-75 bg-amber-800 text-white font-black ">
                                        Login
                                   </button>
                              </div>
                         </div>
                    </form>
               </div>
          </div>
     );
}