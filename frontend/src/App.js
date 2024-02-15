import { useState } from 'react';

import './App.css';

function App() {
  const [credentials, setCredentials] = useState({
    AccessKeyID: '',
    SecretAccessKey: '',
    SessionToken: ''
  });
  
  const fetchCredentials = () => {
    fetch('http://localhost:7777/api/v1/roles')
      .then(response => response.json())
      .then(data => {
        // Update state with the credentials received
        setCredentials({
          AccessKeyID: data.AccessKeyID,
          SecretAccessKey: data.SecretAccessKey,
          SessionToken: data.SessionToken
        });
      })
      .catch(error => {
        console.error('Error fetching credentials:', error);
      });
  };

  return (
    <div className='container'>
      <h1>AWS IAM Role Temporary Credential Generator</h1>
      <div className='credentialBox'>
        <div>
          <label for="AccessKeyID">AccessKeyID</label>
          <input type="text" id="AccessKeyID" value={credentials.AccessKeyID} readonly />
        </div>
        <div>
            <label for="SecretAccessKey">SecretAccessKey</label>
            <input type="text" id="SecretAccessKey" value={credentials.SecretAccessKey} readonly />
        </div>
        <div>
            <label for="SessionToken">SessionToken</label>
            <input type="text" id="SessionToken" value={credentials.SessionToken} readonly />
        </div>

        <button onClick={fetchCredentials}>Generate Credentials</button>
      </div>
    </div>
  );
}

export default App;
