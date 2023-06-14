import React, { useEffect } from 'react';

import openSocket from 'socket.io-client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Post from './components/post/Post';
import PostDetail from './components/post/PostDetail';
import Loading from './components/loading/Loading';

import useHttp from './hooks/use-https';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const { error, sendRequest: getAuth, loading } = useHttp();

  useEffect(() => {
    const isAuthStore = data => {
      dispatch(authActions.isAuth(data));
    };
    getAuth({ url: 'http://localhost:5000/authentication' }, isAuthStore);
    const socket = openSocket('http://localhost:5000');
    socket.on('auth', data => {
      if (data.action === 'login') {
        getAuth({ url: 'http://localhost:5000/authentication' }, isAuthStore);
      } else if (data.action === 'logout') {
        getAuth({ url: 'http://localhost:5000/authentication' }, isAuthStore);
      }
    });
  }, [getAuth, dispatch]);

  return (
    <BrowserRouter>
      <Layout>
        {error}
        <Routes>
          {loading ? (
            <Route exact path='/' element={<Loading />} />
          ) : isAuthenticated ? (
            <React.Fragment>
              <Route exact path='/' element={<Post />} />
              <Route exact path='/post/:postId' element={<PostDetail />} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Route exact path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </React.Fragment>
          )}

          {/* <Route path='*' element={<PageNotFound />} />
          <Route path='server-error' element={<ServerError />} /> */}
        </Routes>
        {/* <input type='hidden' placeholder={error} /> */}
      </Layout>
    </BrowserRouter>
  );
}

export default App;
