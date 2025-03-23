import { useState } from 'react';
import { useRouter } from 'next/router';
import Header1 from '../components/Header1';
import styles from '../styles/Login.module.css';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add input validation logic here
    // For example, check if email and password are not empty

    // Redirect to homepage if login is successful
    router.push('/');
  };

  return (
    <div>
      <Header1 />
      <div className={styles.container}>
      <h1 className={styles.title}>EDU-PULSE HUB</h1>
        <div className={styles.loginForm}>
          <h2>Login</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;