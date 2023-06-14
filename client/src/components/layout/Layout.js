import React from 'react';

import NavBar from './NavBar';

const Layout = props => {
  return (
    <React.Fragment>
      <NavBar />
      <main>{props.children}</main>
    </React.Fragment>
  );
};

export default Layout;
