import React from 'react';
import { useHistory } from "react-router-dom";
import { authenticate } from './services/auth';

function Login() {
  const [user, setUser] = React.useState({ email: '', password: '' });
  const history = useHistory();

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    authenticate(user).then(authenticatedUser => {
      if (authenticatedUser) {
        history.push('/');
      }
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 id='welcome'>CSE183 Authenticated Books Example</h2>
      <input
        type="email"
        name="email"
        placeholder="EMail"
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleInputChange}
        required
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default Login;
