import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import Pins from './Pins';
import { Sidebar, UserProfile, Navbar } from '../components'
import { userQuery } from '../utils/data';
import { client } from '../client';
import logo from '../assets/logo.png';
import { fetchUser } from '../utils/fetchUser';

// weird issues:
// 1. weird prettier
// 2. werid implement props

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState();
  const scrollRef = useRef(null);

  // const userInfo = fetchUser();
  // const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;
  // console.log(userInfo)
  useEffect(() => {
    const query = userQuery(user_data?._id);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
    window.location.reload();
  });

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col w-100 h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />

          <Link to="/">
            <img src={logo} alt='logo' className='w-12' />
          </Link>
          <Link to={`/user-profile/${user_data?._id}`}>
            <img src={user_data?.image} alt='user-pic' className='mansory' />
          </Link>

        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home
