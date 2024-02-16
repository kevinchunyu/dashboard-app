import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [credentials, setCredentials] = useState({
    AccessKeyID: '',
    SecretAccessKey: '',
    SessionToken: ''
  });

  const [publicIP, setPublicIP] = useState("");

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

  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_API_ENDPOINT}:7778/api/v1/ec2/public-ipv4`)
      .then(response => response.text())
      .then(ip => {
        setPublicIP(ip);
      })
      .catch(error => {
        console.error('Error fetching public IP:', error);
      });
  }, []);

  return (
    <div className='container'>
      <nav>
        <h1 className='navHeader'>open-devsecops</h1>
        <ul>
          <li><a href='https://github.com/open-devsecops/open-devsecops' target='_blank' rel='noreferrer'>Github</a></li>
        </ul>
      </nav>
      <div className='linkContainer'>
        <div className='infoBox'>
          <label htmlFor="JenkinsLink">Jenkins URL</label>
          <input type="text" id="JenkinsLink" value="http://jenkins.internal" readOnly />
        </div>
        <div className='infoBox'>
          <label htmlFor="JenkinsWebhookLink">Jenkins Webhook URL</label>
          <input type="text" id="JenkinsWebhookLink" value={publicIP ? "http://" + publicIP + ":8081/github-webhook/" : ""} readOnly />
        </div>
      </div>
      <div className='credentialBox'>
        <h1>AWS IAM Assume Role</h1>
        <p>Generate temporary AWS credentials to perform actions on certain AWS resources.</p>
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
