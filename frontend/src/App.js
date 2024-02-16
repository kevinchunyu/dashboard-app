import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [credentials, setCredentials] = useState({
    AccessKeyID: '',
    SecretAccessKey: '',
    SessionToken: ''
  });

  const buttonRef = useRef(false);
  
  const fetchCredentials = () => {
    buttonRef.current.disabled = true;
    fetch(`http://${process.env.REACT_APP_API_ENDPOINT}:7778/api/v1/roles`)
      .then(response => response.json())
      .then(data => {
        // Update state with the credentials received
        setCredentials({
          AccessKeyID: data.AccessKeyID,
          SecretAccessKey: data.SecretAccessKey,
          SessionToken: data.SessionToken
        });

        buttonRef.current.disabled = false;
      })
      .catch(error => {
        console.error('Error fetching credentials:', error);
        buttonRef.current.disabled = false;
      });
  };

  return (
    <div className='container'>
      <h1>AWS IAM Role Temporary Credential Generator</h1>
      <div className='credentialBox'>
        <div>
          <label htmlFor="AccessKeyID">AccessKeyID</label>
          <input type="text" id="AccessKeyID" value={credentials.AccessKeyID} readOnly />
        </div>
        <div>
            <label htmlFor="SecretAccessKey">SecretAccessKey</label>
            <input type="text" id="SecretAccessKey" value={credentials.SecretAccessKey} readOnly />
        </div>
        <div>
            <label htmlFor="SessionToken">SessionToken</label>
            <input type="text" id="SessionToken" value={credentials.SessionToken} readOnly />
        </div>

        <button ref={buttonRef} onClick={fetchCredentials}>Generate Credentials</button>
      </div>
    </div>
  );
}

export default App;
