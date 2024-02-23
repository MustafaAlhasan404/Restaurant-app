import { useContext } from 'react';
import UserContext from './UserContext';

const MyComponent = () => {
  const { username, role } = useContext(UserContext);

  // Example usage
  const setUser = (username, role) => {
    // Update the context value here
  };

  return (
    // Component JSX
  );
};