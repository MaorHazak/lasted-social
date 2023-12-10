import React from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';

import { Navbar, Feed, PinDetail, CreatePin, Search, } from '../components';


const Pins = () => {
  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;
  const [searchParams, setSearchParams] = useSearchParams({ q: '' });
  const query = searchParams.get('q')
  // TODO: Fix all this shit
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar
          query={query}
          setSearchParams={setSearchParams}
          user_data={user_data}
        />
      </div>
      <div className='h-full'>

        <Routes>
          <Route path="/" element={<Feed query={query} />} />
          <Route path="/category/:categoryId" element={<Feed query={query} />} />
          <Route path="/pin-detail/:pinId" element={<PinDetail user_data={user_data && user_data} />} />
          <Route path="/create-pin" element={<CreatePin user_data={user_data && user_data} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins
