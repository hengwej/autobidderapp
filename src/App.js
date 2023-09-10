import logo from './logo.svg';
import './App.css';
import { Auth0Provider } from '@auth0/auth0-react';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';



function App() {
  return (

        <main className="column">
          <h1> Auth0 Login Test</h1>
          <LoginButton />
          <LogoutButton />
          <Profile />
        </main>
  );
}

export default App;
