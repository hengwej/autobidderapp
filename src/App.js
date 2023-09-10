import logo from './logo.svg';
import './App.css';
import { Auth0Provider } from '@auth0/auth0-react';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientid = process.env.REACT_APP_AUTH0_CLIENT_ID;

function App() {
  return (

        <main className="column">
          <h1> AUth0 Login</h1>
          <LoginButton />
          <LogoutButton />
          <Profile />
        </main>
  );
}

export default App;
