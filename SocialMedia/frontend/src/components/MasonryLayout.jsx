import React from 'react'
import Masonry from 'react-masonry-css';
import Pins from '../container/Pins';
import Pin from './Pin';

const breakpointObj = {
  defult: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
}

const MasonryLayout = ({ pins, setReload }) => {
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointObj}>
      {pins?.map((pin) => <Pin setReload={setReload} key={pin._id} pin={pin} className="w-max" />)}
    </Masonry>
  )
}

export default MasonryLayout
