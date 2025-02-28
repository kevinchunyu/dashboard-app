import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [credentials, setCredentials] = useState({
    accessToken: '',
    expiresOn: ''
  });

  const [publicIP, setPublicIP] = useState("");
  const [registryURL, setRegistryURL] = useState("");

  const buttonRef = useRef(null);
  
  const fetchCredentials = () => {
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    // fetch env URL : http://${process.env.REACT_APP_API_ENDPOINT}:7778/api/v1/roles
    // local host testing: http://localhost:7778/api/v1/roles
    fetch(`http://${process.env.REACT_APP_API_ENDPOINT}:7778/api/v1/roles`)
      .then(response => response.json())
      .then(data => {
        setCredentials({
          accessToken: data.AccessToken,
          expiresOn: data.ExpiresOn
        });
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }
      })
      .catch(error => {
        console.error('Error fetching credentials:', error);
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }
      });
  };

  useEffect(() => {
    // fetch env URL :http://${process.env.REACT_APP_API_ENDPOINT}:7778/api/v1/ec2/public-ipv4
    // local host testing: http://localhost:7778/api/v1/ec2/public-ipv4
    fetch(`http://${process.env.REACT_APP_API_ENDPOINT}:7778/api/v1/ec2/public-ipv4`)
      .then(response => response.text())
      .then(ip => {
        setPublicIP(ip);
      })
      .catch(error => {
        console.error('Error fetching public IP:', error);
      });

    // Fetch the Azure Container Registry (ACR) URL.
    fetch(`http://${process.env.REACT_APP_API_ENDPOINT}:7778/api/v1/acr/url`)
      .then(response => response.text())
      .then(url => {
        setRegistryURL(url);
      })
      .catch(error => {
        console.error('Error fetching registry URL:', error);
      });
  }, []);

  return (
    <div className='container'>
      <nav>
        <h1 className='navHeader'>open-devsecops</h1>
        <ul>
          <li>
            <a
              href='https://github.com/open-devsecops/open-devsecops'
              target='_blank'
              rel='noreferrer'
            >
              Github
            </a>
          </li>
        </ul>
      </nav>
      <div className='linkContainer'>
        <div className='infoBox'>
          <label htmlFor="JenkinsLink">Jenkins URL</label>
          <input type="text" id="JenkinsLink" value="http://jenkins.internal" readOnly />
        </div>
        <div className='infoBox'>
          <label htmlFor="JenkinsWebhookLink">Jenkins Webhook URL</label>
          <input
            type="text"
            id="JenkinsWebhookLink"
            value={publicIP ? "http://" + publicIP + ":8081/github-webhook/" : ""}
            readOnly
          />
        </div>
      </div>
      <div className='registryBox'>
        <label htmlFor="RegistryLink">Shared Container Registry URL</label>
        <input type="text" id="RegistryLink" value={registryURL} readOnly />
      </div>
      <div className='credentialBox'>
        <h1>Azure AD Token for ACR</h1>
        <p>
          Generate a temporary Azure AD token to authenticate with your Azure Container Registry.
        </p>
        <div>
          <label htmlFor="AccessToken">Access Token</label>
          <input type="text" id="AccessToken" value={credentials.accessToken} readOnly />
        </div>
        <div>
          <label htmlFor="ExpiresOn">Expires On</label>
          <input type="text" id="ExpiresOn" value={credentials.expiresOn} readOnly />
        </div>
        <button ref={buttonRef} onClick={fetchCredentials}>
          Generate Token
        </button>
      </div>
    </div>
  );
}

export default App;
