import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';


const useCheckIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const checkIsSmallScreen = () => {
    setIsSmallScreen(() => {
      return window.innerWidth <= 767;
    })
  }

  useEffect(() => {
    checkIsSmallScreen();
    window.addEventListener('resize', checkIsSmallScreen);
    return () => {
      window.removeEventListener('resize', checkIsSmallScreen);
    }
  }, [])
  return isSmallScreen;
}

const Pin = ({ pin, setReload }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);

  const navigate = useNavigate();

  const isSmallScreen = useCheckIsSmallScreen();


  const { image, userInfo, _id, destination, pins } = pin;

  // const isSmallScreen = window.matchMedia("(max-width: 600px)");


  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : localStorage.clear();




  useEffect(() => {
    const alrady = pins?.filter((e) => e.email === user_data?.email)
    if (alrady.length) {
      setAlreadySaved(true)
    }
    else {
      setAlreadySaved(false)
    }

  }, [user_data, pin])

  const [download, setDownload] = useState()

  useEffect(() => {
    fetch(image)
      .then(res => res.blob())
      .then(data => {
        const blobUrl = URL.createObjectURL(data)
        setDownload(blobUrl)
      })
  }, [pin])

  const deletePin = async () => {
    const res = await axios.delete(`http://localhost:5000/api/posts/${_id}`)
    if (res) {
      if (res.status === 200) {
        setReload(res)
      }
      else {
        toast.error("Faild to Delete Post")
      }
    }

  };


  const unsavePin = async (id) => {
    const res = await axios.put(`http://localhost:5000/api/posts/remove/${id}`, { email: user_data.email })
    setReload(res)
  };


  const savePin = async (id) => {
    const res = await axios.put(`http://localhost:5000/api/posts/save/${id}`, { email: user_data.email })
    setReload(res)
  };


  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image && (
          <img className="rounded-lg w-full " src={image} alt="user-post" />)}
        {postHovered && !isSmallScreen && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  target='_blank'
                  href={download}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    unsavePin(_id); // Call the unsavePin function to unsave the pin
                  }}
                >
                  {pins?.length}  Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  Save
                </button>
              )}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              {destination?.length > 0 && (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  {' '}
                  <BsFillArrowUpRightCircleFill />
                  {destination.match(/^(?:https?:\/\/)?(?:www\.)?(.*?)\./)?.[1]?.slice(0, 8) || destination.slice(0, 8)}...
                </a>
              )}
              {
                userInfo?.email === user_data?.email &&
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>

              }
            </div>
          </div>
        )}

      </div>

      <div className="flex flex-nowrap items-center">

        <div className="flex flex-nowrap gap-2 mt-2 items-center">
          <Link to={`/user-profile/${userInfo?.email}`} className="flex gap-2 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={userInfo?.imageUrl}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">{userInfo?.name}</p>
          </Link>

          {/* small screen */}

          {isSmallScreen && (
            <div className="flex justify-between items-center">
              <a
                target='_blank'
                href={download}
                download
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className=" rounded-full opacity-75"
              >
                <MdDownloadForOffline className="text-2xl" />
              </a>

              {destination?.length > 0 && (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white text-black font-bold text-sm rounded-full opacity-70 hover:opacity-100 hover:shadow-md flex-shrink-0"
                  rel="noreferrer"
                >
                  {destination.match(/^(?:https?:\/\/)?(?:www\.)?(.*?)\./)?.[1]?.slice(0, 8) || destination.slice(0, 8)}...
                </a>
              )}

              {userInfo?.email === user_data?.email && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white rounded-full w-9 h-9 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none flex-shrink-0"
                >
                  <AiTwotoneDelete className="text-xl" />
                </button>
              )}

              {/* Save/Unsave button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  alreadySaved ? unsavePin(_id) : savePin(_id);
                }}
                className={`bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-3 py-2 text-base rounded-full hover:shadow-md  ${alreadySaved ? 'saved-button' : 'save-button'}`}
              >
                {alreadySaved ? `${pins?.length} Saved` : 'Save'}
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Pin;