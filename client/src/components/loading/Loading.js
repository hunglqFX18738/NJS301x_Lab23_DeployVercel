import React from 'react';

import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
  return (
    <h1 className='text-center'>
      <Spinner animation='grow' variant='primary' />
      <Spinner animation='grow' variant='primary' />
      <Spinner animation='grow' variant='primary' />
    </h1>
  );
};

export default Loading;
