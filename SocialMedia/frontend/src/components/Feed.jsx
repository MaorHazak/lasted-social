

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import axios from 'axios';

const Feed = ({ query }) => {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState()
  const { categoryId } = useParams();
  const [pins, setPins] = useState([]);
  const [allPosts, setAllPosts] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => setAllPosts(res.data))
  }, [])


  useEffect(() => {
    const search = allPosts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()))
    if (search?.length >= 1) {
      setPins(search)
    }
    else {
      setPins([])
    }
  }, [query, allPosts])


  useEffect(() => {
    setLoading(true)
    if (categoryId) {
      axios.get(`http://localhost:5000/api/posts/category/${categoryId}`)
        .then(res => {
          setLoading(false)
          setPins(res.data)
        })
    }
    else {
      axios.get(`http://localhost:5000/api/posts`)
        .then(res => {
          setLoading(false)
          setPins(res.data)
        })
    }
  }, [reload, categoryId])


  if (loading) return <Spinner message="We are adding new ideas..." />;

  if (!pins?.length) return <h1>There are no pins yet.</h1>;

  return (
    <div>
      {pins && <MasonryLayout pins={pins} setReload={setReload} />}
    </div>
  );
};

export default Feed;
