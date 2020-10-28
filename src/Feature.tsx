import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import { LDProps } from 'launchdarkly-react-client-sdk/lib/withLDConsumer';
import React, { FC, useEffect, useState } from 'react';

const HelloWorld: FC<LDProps> = ({ flags, ldClient }) => {
  const [newProperty, setNewProperty] = useState(false);
  useEffect(() => {
    const user = ldClient?.getUser();
    ldClient?.identify({
      ...user,
      custom: {
        ...user?.custom,
        my_new_property: newProperty,
      }
    });
  }, [newProperty, ldClient])

  return (

    <>
      <h1>Are you allowed to see this?</h1>
      <h2>{flags?.allowedToSee ? 'yes': 'no'}</h2>
      <button onClick={() => setNewProperty(true)}>Click to add new user property</button>
      <p>Clicking the button should enable the feature flag...</p>
    </>
  );
};

export default withLDConsumer()(HelloWorld);