import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { addUserData } from "../../Redux/Slices/userSlice";
import {useDispatch} from 'react-redux';
import { AuthContext } from "./UserAuthModal";
import { Avatar, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';


function Otp() {
  const { setloading, setAuthModal,setPage,tempUserInfo, setTempUserInfo } = useContext(AuthContext);
  const [otp, setotp] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(tempUserInfo)

  function handleSubmit() {
    setloading(true)
    
    const accessToken = Cookies.get('accessToken') || "no-token";
    if(tempUserInfo.type=='signup'){
      axios.post(
        `${BASE_URL}/activate-user`,
        {
          submittedOTP: otp,
          token: tempUserInfo.token
        },
        {
          headers: {
            Authorization: accessToken
          }
        }
      )
        .then((res) => {
          Cookies.set('accessToken', res.data.data.accessToken);
          if(tempUserInfo.avatar){
            dispatch(addUserData({...res.data.data,profile : URL.createObjectURL(tempUserInfo.avatar)}))
          }else{
            dispatch(addUserData({...res.data.data}))
          }
          toast.success(res.data.message)
          if(tempUserInfo.avatar){
            const formData = new FormData;
            formData.append('avatar',tempUserInfo.avatar)
            axios.patch(
              `${BASE_URL}/update-user/${res.data.data._id}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: accessToken
                }
              }
            )
            .then((avatarRes)=>{
              Cookies.set('accessToken', avatarRes.data.data.accessToken);
              dispatch(addUserData({...avatarRes.data.data}))
            })
            .catch((err)=>{
              toast.error( err.response.data.error)
            })
          }
          setAuthModal(false);
        })
        .catch((err) => {
          toast.error( err.response.data.error)
        })
        .finally(()=>{
          // setTempUserInfo({})
          setloading(false)
        });
    }else{
      axios.post(
        `${BASE_URL}/validate-otp`,
        {
          submittedOTP: otp,
          token: tempUserInfo.token
        },
        {
          headers: {
            Authorization: accessToken
          }
        }
      )
          .then((response) => {
            setTempUserInfo({ type:tempUserInfo.type, email:tempUserInfo.email, ...response.data }); 
            setPage('signup');
        })
          .catch((err) => {
            toast.error( err.response.data.error)
          })
          .finally(()=>{
            setloading(false)
          });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-10">
        <div className="h-36 w-36 rounded-full m-4 relative">
          {
             tempUserInfo.avatar ?
             <img
             src={URL.createObjectURL(tempUserInfo.avatar)}
             alt="user avatar"
             className="w-full h-full object-cover rounded-full opacity-100 hover:opacity-50"
             /> : 
             <Avatar height='full' width='full'/>
          }
        </div>
        <h1 className="text-center font-serif text-2xl">
          Hello <span className="font-semibold">{tempUserInfo.username ? tempUserInfo.username : 'User'}</span>
        </h1>
      </div>

      <p>Please check your email to get OTP. We've just sent it to an</p>
      <h1 className="text-red-500 text-sm">{tempUserInfo.email}</h1>

      <input
        className="focus:outline-none  h-10 w-4/6 rounded-sm border border-gray-700 mt-10 text-primary font-bold font-serif text-center text-2xl"
        type="number"
        placeholder="enter your otp"
        onChange={(e) => setotp(e.target.value)}
        value={otp}
      />
      <p className="text-red-500 font-itim text-sm">
        *otp only valid for 5 minutes
      </p>
      <div className="w-full flex gap-2">
        <button
          className="border-2 border-primary text-gray-700 font-bold w-2/6 h-10 mt-3 rounded-xl"
          onClick={() => setPage(tempUserInfo.type)}
        >
          Back
        </button>
        <button
          className={`bg-primary text-gray-700 font-bold w-4/6 h-10 mt-3 rounded-xl ${
            otp === "" && "cursor-not-allowed"
          }`}
          disabled={otp === ""}
          onClick={handleSubmit}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}

export default Otp;
