import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Container, Form, Button, Alert } from 'react-bootstrap';

import useHttp from '../../hooks/use-https';

const Signup = () => {
  const { error, sendRequest: postSignup } = useHttp();
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');

  const [emailValue, setEmailValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const emailChangeHandler = e => setEmailValue(e.target.value);
  const nameChangeHandler = e => setNameValue(e.target.value);
  const passwordChangeHandler = e => setPasswordValue(e.target.value);

  //xử lí alert
  const alertHandler = status => {
    setStatus(status);
    setShow(true);
    setTimeout(function () {
      setShow(false);
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
      const signupNotify = data => {
        if (data.status === 'success') {
          alert('Sign Up Success');
          navigate('/');
          window.location.reload(true);
        } else if (data.status === 'fail') {
          alertHandler(data.errorMessage);
          setPasswordValue('');
        }
      };
      postSignup(
        {
          url: 'http://localhost:5000/signup',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: {
            email: emailValue,
            fullname: nameValue,
            password: passwordValue,
          },
        },
        signupNotify
      );
    }
    setValidated(true);
  };

  return (
    <Container className='p-3 d-flex flex-column w-25'>
      {error}
      <Form noValidate validated={validated} onSubmit={submitHandler}>
        <h1 className='text-center'>Sign Up</h1>
        {show && (
          <Alert variant='danger' onClose={() => setShow(false)} dismissible>
            {status}
          </Alert>
        )}
        <Form.Group className='mb-3'>
          <Form.Label>YOUR E-MAIL</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter username'
            onChange={emailChangeHandler}
            value={emailValue}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>YOUR NAME</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter username'
            onChange={nameChangeHandler}
            value={nameValue}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>PASSWORD</Form.Label>
          <Form.Control
            required
            type='password'
            placeholder='Enter password'
            onChange={passwordChangeHandler}
            value={passwordValue}
          />
        </Form.Group>
        <Button type='submit' className='bg-violet w-100 mt-3'>
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;
