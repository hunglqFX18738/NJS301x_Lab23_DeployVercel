import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { Container } from 'react-bootstrap';

import useHttp from '../../hooks/use-https';

const PostDetail = () => {
  const params = useParams();
  const postId = params.postId;

  const { error, sendRequest: fetchPost } = useHttp();
  const [postData, setPostData] = useState();

  //xử lí hiển thị cột date
  const dateHandler = date => {
    const getDate = new Date(date);
    const day = getDate.toLocaleString('en-US', { day: '2-digit' });
    const month = getDate.toLocaleString('en-US', {
      month: '2-digit',
    });
    const year = getDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = data => {
      setPostData(data);
    };
    fetchPost(
      { url: `http://localhost:5000/post-detail/${postId}` },
      fetchData
    );
  });

  return (
    <Container className='p-3 d-flex flex-column w-50'>
      {error}
      {postData ? (
        <React.Fragment>
          <h3 className='text-center mt-3'>{postData.title}</h3>
          <p className='text-center'>
            Created by on {dateHandler(postData.dateCreated)}
          </p>
          <hr />
          <img
            className='w-50 mt-3 mx-auto d-block'
            src={`/${postData.imageUrl}`}
            alt='A Book'
          />

          <p className='text-center mt-3'>{postData.content}</p>
        </React.Fragment>
      ) : (
        ''
      )}
    </Container>
  );
};

export default PostDetail;
