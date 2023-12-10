import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';


import MasonryLayout from './MasonryLayout';

import Spinner from './Spinner';
import axios from 'axios';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([])
  const [addingComment, setAddingComment] = useState(false);
  const [reload, setReload] = useState()
  const [editComment, setEditComment] = useState(false)
  const [tergetEdit, setTergetEdit] = useState({})
  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : localStorage.clear();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts/${pinId}`)
      .then(res => setPinDetail(res.data))
    axios.get('http://localhost:5000/api/posts')
      .then(res => setPins(res.data))
    axios.get(`http://localhost:5000/api/comments/get/${pinId}`)
      .then(res => setComments(res.data))
  }, [pinId, reload]);

  const addComment = async () => {
    if (comment) {
      setAddingComment(true)
      const res = await axios.post(`http://localhost:5000/api/comments/new`, { comment: comment, userInfo: user_data, postId: pinId })
      setComment("")
      setReload(res)
      setAddingComment(false)
    }
  };
  const deleteComment = async (id) => {
    const res = await axios.delete(`http://localhost:5000/api/comments/${id}`)
    setReload(res)
  }
  const updateCOmment = async (id) => {
    setAddingComment(true)
    const res = await axios.put(`http://localhost:5000/api/comments/${tergetEdit._id}`, { comment: comment })
    setReload(res)
    setEditComment(false)
    setComment("")
    setTergetEdit({})
    setAddingComment(false)
  }
  const [download, setDownload] = useState()
  useEffect(() => {
    if (pinDetail) {
      fetch(pinDetail?.image)
        .then(res => res.blob())
        .then(data => {
          const blobUrl = URL.createObjectURL(data)
          setDownload(blobUrl)
        })
    }
  }, [pinDetail])

  if (!pinDetail) {
    return (
      <Spinner message="Showing pin" />
    );
  }

  return (
    <>
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetail.image}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={download}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail?.destination?.slice(8)}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail?.title}
              </h1>
              <p className="mt-3">{pinDetail?.about}</p>
            </div>
            <Link to={`/user-profile/${pinDetail?.userInfo?.email}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={pinDetail?.userInfo?.imageUrl} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail?.userInfo?.name}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {comments?.map((item) => (
                <div className="flex gap-2 mt-5 items-center justify-between bg-white rounded-lg" key={item.comment}>
                  <div className='flex items-center'>
                    <img
                      src={item.userInfo?.imageUrl}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      alt="user-profile"
                    />
                    <div className="flex flex-col ml-3">
                      <p className="font-bold">{item.userInfo?.name}</p>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                  {
                    item.userInfo?.email === user_data?.email &&
                    <div>
                      <button
                        onClick={() => {
                          setEditComment(true)
                          setTergetEdit(item)
                          setComment(item.comment)
                        }}
                        title='Edit'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteComment(item._id)}
                        title='Edit' className='text-red-700 ml-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>

                      </button>
                    </div>
                  }
                </div>
              ))}
            </div>
            {
              user_data?.email && <div className="flex flex-wrap mt-6 gap-3">
                <Link to={`/user-profile/${user_data?.email}`}>
                  <img src={user_data?.imageUrl} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                </Link>
                <input
                  className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevents the default behavior (e.g., newline)
                      if (editComment) {
                        updateCOmment();
                      } else {
                        addComment();
                      }
                    }
                  }}
                />
                {
                  editComment ?
                    <button
                      type="button"
                      className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                      onClick={updateCOmment}
                    >
                      {addingComment ? 'Doing...' : 'Update'}
                    </button>
                    :
                    <button
                      type="button"
                      className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                      onClick={addComment}
                    >
                      {addingComment ? 'Doing...' : 'Done'}
                    </button>
                }
              </div>
            }
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} setReload={setReload} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  );
};

export default PinDetail;