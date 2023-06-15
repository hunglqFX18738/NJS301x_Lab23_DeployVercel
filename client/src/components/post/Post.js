import React, { useState, useEffect } from 'react';

import openSocket from 'socket.io-client';

import { useNavigate } from 'react-router-dom';

import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from 'react-bootstrap';

import NewPost from './NewPost';
import DeletePost from './DeletePost';
import EditPost from './EditPost';

import useHttp from '../../hooks/use-https';

const Post = () => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const [postData, setPostData] = useState([]);
  const { error, sendRequest: fetchPost } = useHttp();

  //xử lí alert
  const alertHandler = (status, msg) => {
    setStatus(status);
    setMsg(msg);
    setShow(true);
    setTimeout(function () {
      setShow(false);
    }, 5000);
  };

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
    fetchPost({ url: 'https://test-node-lab23-1.onrender.com/all-post' }, fetchData);
    const socket = openSocket('http://localhost:5000');
    socket.on('posts', data => {
      if (data.action === 'add') {
        fetchPost({ url: 'http://localhost:5000/posts' }, fetchData);
      } else if (data.action === 'edit') {
        fetchPost({ url: 'http://localhost:5000/posts' }, fetchData);
      } else if (data.action === 'delete') {
        fetchPost({ url: 'http://localhost:5000/posts' }, fetchData);
      }
    });
  }, [fetchPost]);

  return (
    <Container className='p-3 d-flex flex-column w-50'>
      {error}
      <Container className='p-3 d-flex flex-column w-50'>
        <Form noValidate>
          {show && (
            <Alert
              variant={status === 'success' ? 'success' : 'danger'}
              onClose={() => setShow(false)}
              dismissible
            >
              {msg}
            </Alert>
          )}
          <Row className='mb-3'>
            <Col xs={9}>
              <Form.Group>
                <Form.Control required type='text' defaultValue='Im a New!' />
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Button disabled>UPDATE</Button>
            </Col>
          </Row>
          <Row className='justify-content-md-center'>
            <Col xs={5}>
              <NewPost alertHandler={alertHandler} />
            </Col>
          </Row>
        </Form>
      </Container>
      {postData ? (
        postData.length === 0 ? (
          <h1 className='text-center'>No Post Found!</h1>
        ) : (
          postData.map(e => (
            <Card className='mb-3'>
              {/* <Card.Header>Featured</Card.Header> */}
              <Card.Body>
                {/* <Card.Title>Posted by on .........</Card.Title> */}
                <Card.Text>Posted by on {dateHandler(e.dateCreated)}</Card.Text>
                <Card.Text className='h4 mb-3'>{e.title}</Card.Text>
                <div class='d-flex justify-content-end'>
                  <Button
                    variant='outline-info'
                    onClick={() => navigate(`/post/${e._id}`)}
                    style={{ border: 'none' }}
                  >
                    VIEW
                  </Button>
                  <EditPost postId={e._id} alertHandler={alertHandler} />
                  <DeletePost postId={e._id} alertHandler={alertHandler} />
                </div>
              </Card.Body>
            </Card>
          ))
        )
      ) : (
        <h1>No Backend Data!</h1>
      )}
    </Container>
  );
};

export default Post;
