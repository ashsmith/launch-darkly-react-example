import React, { FC, useEffect, useState } from 'react';
// import * as firebase from 'firebase/app' for versions <8.0.0
import firebase from 'firebase/app'; // versions >=8.0.0
import 'firebase/analytics';
import 'firebase/remote-config';

import firebaseConfig from './firebaseConfig';

interface UserProperties {
  user: null | string;
}

// Init firebase.
const app = firebase.initializeApp(firebaseConfig);
const analytics = app.analytics();

// My RC flag.
const FLAG_ALLOWED_TO_SEE = 'allowed_to_see';

const useRemoteConfig = () => {
  const [userProperties, setUserProperties] = useState<UserProperties>({ user: null });
  const [remoteConfigValues, setRemoteConfigValues] = useState<{[key: string]: any}>({});
  const [allowedToSee, setAllowedToSee] = useState(false);
  useEffect(() => {
    analytics.setUserProperties(userProperties);

    // The event name doesn't matter, we just need to trigger one.
    analytics.logEvent('updated_properties');

    const fetchRemoteConfig = async () => {
      const remoteConfig = app.remoteConfig();
      remoteConfig.defaultConfig = {
        // Default the value to false to ensure the feature is never seen.
        [FLAG_ALLOWED_TO_SEE]: false,
      };
      remoteConfig.settings = {
        fetchTimeoutMillis: 1000,
        minimumFetchIntervalMillis: 100,
      };
      await remoteConfig.fetch();
      await remoteConfig.activate();
      await remoteConfig.ensureInitialized();
      setAllowedToSee(remoteConfig.getValue(FLAG_ALLOWED_TO_SEE).asBoolean());
      setRemoteConfigValues(remoteConfig.getAll());
    };
    fetchRemoteConfig();

  }, [userProperties]);

  return { setUserProperties, userProperties, remoteConfigValues, allowedToSee };
};


const App: FC = () => {
  const { setUserProperties, userProperties, remoteConfigValues, allowedToSee } = useRemoteConfig();
  const [counter, setCounter] = useState(0);
  const buttonClick = () => {
    setUserProperties({ user: 'user_that_clicked_button' });
    setCounter(counter + 1);
  }
  return (
    <>
      <h1>Firebase Remote Config with User Properties.</h1>
      <p>Use the button below to set your user properties...</p>
      <button onClick={buttonClick}>Click me</button>
      <p>You've clicked the button {counter} times</p>

      {allowedToSee && <p>You are lucky enough to see this.</p>}

      <h2>User Properties from state:</h2>
      <pre>{JSON.stringify(userProperties, null, 2)}</pre>
      <h2>Remote Config result:</h2>
      <pre>{JSON.stringify(remoteConfigValues)}</pre>
    </>
  );
}

export default App;
