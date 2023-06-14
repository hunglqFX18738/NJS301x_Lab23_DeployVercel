import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import useHttp from '../../hooks/use-https';

import { Nav, Navbar, Container } from 'react-bootstrap';

import './main.css';

const NavBar = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const fullName = useSelector(state => state.auth.fullName);

  const navigate = useNavigate();
  const { error, sendRequest: postLogout } = useHttp();

  const submitHandler = e => {
    e.preventDefault();
    const goHome = data => {
      if (data.status === 'success') {
        alert('Logout');
        navigate('/');
      }
    };
    postLogout(
      {
        url: 'http://localhost:5000/logout',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {},
      },
      goHome
    );
  };

  return (
    <Navbar collapseOnSelect expand='lg' className='bg-violet'>
      {error}
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>MessageNode</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'></Nav>
          {!isAuthenticated ? (
            <Nav>
              <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
              <Nav.Link onClick={() => navigate('/signup')}>SignUp</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Navbar.Text>{fullName}</Navbar.Text>
              <Nav.Link onClick={submitHandler}>Logout</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
