import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Container, Form, Button, Alert } from 'react-bootstrap';

import useHttp from '../../hooks/use-https';

const Login = () => {
  const { error, sendRequest: postLogin } = useHttp();
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const emailChangeHandler = e => setEmailValue(e.target.value);
  const passwordChangeHandler = e => setPasswordValue(e.target.value);

  //xử lí alert
  const alertHandler = (status, msg) => {
    setStatus(status);
    setMsg(msg);
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
      const loginNotify = data => {
        if (data.status === 'success') {
          alert('Login Success');
          navigate('/');
        } else if (data.status === 'incorrect') {
          alertHandler(data.status, '');
          setPasswordValue('');
        } else if (data.status === 'fail') {
          alertHandler(data.status, data.errorMessage);
        }
      };
      postLogin(
        {
          url: 'http://localhost:5000/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: {
            email: emailValue,
            password: passwordValue,
          },
        },
        loginNotify
      );
    }
    setValidated(true);
  };

  return (
    <Container className='p-3 d-flex flex-column w-25'>
      {error}
      <Form noValidate validated={validated} onSubmit={submitHandler}>
        <h1 className='text-center'>Login</h1>
        {show && (
          <Alert variant='danger' onClose={() => setShow(false)} dismissible>
            {status === 'incorrect'
              ? 'Incorrect Username or Password'
              : `${msg}`}
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
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
