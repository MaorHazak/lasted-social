import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch, IoIosPersonAdd } from 'react-icons/io';

// import { HiPlusCircle } from "react-icons/hi2";
import { fetchUser } from '../utils/fetchUser';


const Navbar = ({ user, query, setSearchParams }) => {
  const navigate = useNavigate();
  const [user_data, setUserData] = useState({})
  // console.log(user)
  useEffect(() => {
    const user = fetchUser();
    setUserData(user)
  }, [])

  return (
    <>
      <div className='flex gap-2 md:gap-5 w-full mt-5 pb-4'>

        <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>

          <IoMdSearch fontSize={21} className='ml-1' />
          <input
            type='text'
            onChange={(e) => setSearchParams(prev => {
              const q = e.target.value
              prev.set('q', q)
              return prev
            }, { replace: true })}
            placeholder='Search'
            value={query}
            className='p-2 w-full bg-white outline-none'

          />
          <p className="font-semibold capitalize">
            {user_data?.name?.length > 20
              ? `${user_data?.name.slice(0, 20)}...`
              : user_data?.name}
          </p>
        </div>
        <div className='flex gap-2 items-center'>
          <Link to={`/user-profile/${user_data?.email}`} className='hidden md:block'>

            {!user_data ? (
              <>
                <Link to={`/login`} >
                  <IoIosPersonAdd className='w-8 h-8' />
                </Link>
              </>
            ) : (
              <>
                <img src={user_data?.imageUrl} alt='user-pic' className='rounded-full w-10 mr-3' />
              </>
            )}



          </Link>
          {user_data ? (
            <Link to="/create-pin" className="bg-black text-white rounded-lg w-6 h-6 md:w-10 md:h-10 flex justify-center items-center">
              <IoMdAdd />
            </Link>
          ) : (
            null
          )}
        </div>
      </div>
    </>
  );
}
export default Navbar;
