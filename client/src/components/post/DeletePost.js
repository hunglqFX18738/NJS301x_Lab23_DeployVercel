import React, { useState } from 'react';

import { Form, Button, Modal } from 'react-bootstrap';

import useHttp from '../../hooks/use-https';

const DeletePost = props => {
  const { error, sendRequest: deletePost } = useHttp();

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const submitHandler = e => {
    e.preventDefault();
    const deleteNotify = data => {
      if (data.status === 'success') {
        setShowModal(false);
        props.alertHandler(data.status, 'POST DELETED!');
      }
    };
    deletePost(
      {
        url: 'http://localhost:5000/admin/delete-post',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { postId: props.postId },
      },
      deleteNotify
    );
  };

  return (
    <React.Fragment>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        {error}
        <Form noValidate onSubmit={submitHandler}>
          <Modal.Header closeButton>
            <Modal.Title>{props.postId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className='mb-3'>
              <Form.Label>Do you want to DELETE</Form.Label>
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
        variant='outline-danger'
        onClick={handleShow}
        style={{ border: 'none' }}
      >
        DELETE
      </Button>
    </React.Fragment>
  );
};

export default DeletePost;
