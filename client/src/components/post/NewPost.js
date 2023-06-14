import React, { useState, useRef } from 'react';

// import { useNavigate } from 'react-router-dom';

import { Modal, Button, Form, Alert } from 'react-bootstrap';

import useHttp from '../../hooks/use-https';

const NewPost = props => {
  // const navigate = useNavigate();
  const { error, sendRequest: newPost } = useHttp();

  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [titleValue, setTitleValue] = useState('');
  // const [imageValue, setImageValue] = useState('');
  const imageRef = useRef();
  const [contentValue, setContentValue] = useState('');

  const titleChangeHandler = e => setTitleValue(e.target.value);
  // const imageChangeHandler = e =>
  //   setImageValue([...imageValue, e.target.files[0]]);
  const contentChangeHandler = e => setContentValue(e.target.value);

  //xử lí alert
  const alertHandler = (status, msg) => {
    setStatus(status);
    setMsg(msg);
    setShowAlert(true);
    setTimeout(function () {
      setShowAlert(false);
    }, 5000);
  };

  const submitHandler = event => {
    event.preventDefault();
    //validate input rỗng
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const imageValue = imageRef.current.files[0];
      const formData = new FormData();
      formData.append('title', titleValue);
      formData.append('image', imageValue);
      formData.append('content', contentValue);
      const addNotify = data => {
        if (data.status === 'success') {
          setShowModal(false);
          setTitleValue('');
          setContentValue('');
          props.alertHandler(data.status, 'POST CREATED!');
        } else if (data.status === 'fail') {
          alertHandler(data.status, data.errorMessage);
        }
      };
      newPost(
        {
          url: 'http://localhost:5000/admin/add-post',
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          formData: true,
          data: formData,
        },
        addNotify
      );
    }
    setValidated(true);
  };

  return (
    <React.Fragment>
      {error}
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Form noValidate validated={validated} onSubmit={submitHandler}>
          <Modal.Header closeButton>
            <Modal.Title>New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showAlert && (
              <Alert
                variant={status === 'success' ? 'success' : 'danger'}
                onClose={() => setShowAlert(false)}
                dismissible
              >
                {msg}
              </Alert>
            )}
            <Form.Group className='mb-3'>
              <Form.Label>TITLE</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Enter title'
                id='title'
                name='title'
                onChange={titleChangeHandler}
                value={titleValue}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>IMAGE</Form.Label>
              <Form.Control
                required
                ref={imageRef}
                name='image'
                id='image'
                type='file'
              />
              <Form.Text>Please choose image</Form.Text>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>CONTENT</Form.Label>
              <Form.Control
                required
                as='textarea'
                rows={4}
                id='content'
                name='content'
                onChange={contentChangeHandler}
                value={contentValue}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button type='submit' variant='primary'>
              Accept
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Button
        className='bg-violet justify-content-md-center'
        onClick={handleShow}
      >
        NEW POST
      </Button>
    </React.Fragment>
  );
};

export default NewPost;
