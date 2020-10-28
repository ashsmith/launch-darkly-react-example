import { withLDProvider } from 'launchdarkly-react-client-sdk';
import React, { FC, useEffect, useState } from 'react';
import Feature from './Feature';

const App: FC = () => {
  return (
    <>
      <h1>Launch Darkly with User Properties.</h1>
      <Feature />
    </>
  );
}

export default withLDProvider({
  clientSideID: '5f9955467238bf091de75046',
  user: {
      "key": "user_key",
      "name": "User Name",
      "email": "User@email.com"
  }
})(App);