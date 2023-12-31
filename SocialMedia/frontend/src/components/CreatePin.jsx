import React, { useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete, MdTitle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'
import Spinner from './Spinner';
import { categories } from '../utils/data'
import axios from 'axios'
const CreatePin = () => {

  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;
  // const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);

  const [imageAsset, setImageAsset] = useState("");
  const [image, setImage] = useState(null)

  const [wrongImageType, setWrongImageType] = useState(false);
  // let userImage = user?.filter.item.user.image;
  const navigate = useNavigate();


  useEffect(() => {
    if (image) {
      const type = image.type
      console.log(type)
      if (type === 'image/png' || type === 'image/svg' || type === 'image/gif' || type === 'image/tiff' || type === 'image/jpeg' || type === 'image/pdf') {
        const url = URL.createObjectURL(image)
        setImageAsset(url)
        setWrongImageType(false)
      }
      else {
        setWrongImageType(true)
        setImage(null)
      }
    }
  }, [image])

  const uploadImage = async () => {
    if (image) {
      const formData = new FormData()
      formData.append('image', image)
      const imgRes = await axios.post('http://localhost:5000/api/upload', formData)
      return imgRes.data
    }
    else {
      toast.error("Select Image")
      return {}
    }
  }


  const savePin = async () => {


    if (image && user_data && title && about && category && destination) {
      setLoading(true)
      const res = await uploadImage()
      const newData = {
        email: user_data?.email,
        userInfo: user_data,
        title: title,
        about: about,
        destination: destination,
        image: res.url,
        category: category,
        date: new Date()
      }
      const response = await axios.post('http://localhost:5000/api/posts/new', newData)
      setLoading(false)
      if (response.status === 201) {
        toast.success("New Data Created Success")
        navigate('/')
      }
      else {
        toast.error("Faild posting new Data")
      }
    }
    else {
      toast.error("Insert All Data")
    }
  };
  if (loading) {
    return <Spinner />
  }
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      <Toaster />
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill all fields!</p>
      )}
      <div className='flex flex-col justify-center items-center p-3 w-full bg-neutral-100 '>
        <div className='bg-neutral-300 p-1 flex flex-0.7 w-full opacity-70 hover:opacity-100 h-200 '>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-3000 p-3 w-full '>
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center '>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'>click to upload</p>
                  </div>
                  <p className='mt-32 text-black'>
                    Use high:quality JPG, SVG, PNG, GIFF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type='file'
                  name='upload-image'
                  onChange={e => {
                    setImage(e.target.files[0])
                  }}
                  className='w-0 h-0'
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset}
                  alt='uploaded-pic'
                  className='h-full w-full' />
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => {
                    setImage(null)
                    setImageAsset("")
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='add title here'
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
          />
          {user_data && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img
                src={user_data?.imageUrl}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user_data?.name}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Details"
            className="outline-none text-gray-800 sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />

          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Category</option>
                {categories.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin