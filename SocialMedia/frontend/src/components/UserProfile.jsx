import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import GoogleLogout from 'react-google-login';


import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import axios from 'axios';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary text-black font-bold p-2 rounded-full w-20 outline-none';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState([]);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();
  const [reload, setReload] = useState()
  
  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;


  useEffect(() => {
    if (text === 'Created') {
      axios.get(`http://localhost:5000/api/posts/get/${userId}`)
        .then(res => setPins(res.data))
    }
    else {
      axios.get(`http://localhost:5000/api/posts/pins/${userId}`)
        .then(res => setPins(res.data))
    }
  }, [userId, text,reload]);
  
  useEffect(()=> {
    axios.get(`http://localhost:5000/api/users/get/${userId}`)
    .then(res => setUser(res.data))
  },[userId])
  

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!user_data) {
    navigate('/login')
  }

  return (
    <>
      <div className="relative pb-2 h-full justify-center items-center">
        <div className="flex flex-col pb-5">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
                src={randomImage}
                alt="user-pic"
              />
              <img
                className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                src={user?.info?.imageUrl}
                alt="user-pic"
              />
              <h1 className="font-bold text-3xl text-center mt-3">
                {user?.name}
              </h1>
              <div className="absolute top-0 z-1 right-0 p-2">

                {user_data?.email === user?.email && (
                  <>
                    <GoogleLogout
                      clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                      render={(renderProps) => (
                        <button
                          type="button"
                          className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                          onClick={logout}
                          disabled={renderProps.disabled}
                        >
                          <AiOutlineLogout color="red" fontSize={21} />
                        </button>
                      )}
                      onLogoutSuccess={logout}
                      cookiePolicy={'single_host_origin'}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="text-center mb-7">
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn('created');
                }}
                className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
              >
                Created
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn('saved');
                }}
                className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
              >
                Saved
              </button>

            </div>
            {pins?.length > 0 ? (
              <div className="px-2">
                <MasonryLayout pins={pins} setReload={setReload}/>
              </div>
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                No Pins Found!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile;
