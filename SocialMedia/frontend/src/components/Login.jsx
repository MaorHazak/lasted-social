import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { json, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import { gapi } from "gapi-script";
import { useEffect } from 'react'

const clientId = process.env.REACT_APP_GOOGLE_API_TOKEN

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = async (response) => {
    if (response && response.profileObj) {
      // Handle successful login
      const check = await axios.get(`http://localhost:5000/api/users/get/${response.profileObj.email}`)
      if (check.data) {
        
      }
      else {
        const res = await axios.post('http://localhost:5000/api/users/new', { email: response.profileObj.email, info: response.profileObj })
        if (res.data) {
          toast.success("Success")
        }
      }
      localStorage.setItem('user_data', JSON.stringify(response.profileObj))
      navigate('/')
    } else {
      // Handle login failure
      toast.error("Login Faild")
    }
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    }
    gapi.load('client:auth2', start)
  }, [])

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <Toaster />
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt='logo' />
          </div>

          <div className="shadow-2xl">

            <GoogleLogin
              // i can console.log(process.env.name)- and see the api token.
              clientId={clientId}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-4 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login
