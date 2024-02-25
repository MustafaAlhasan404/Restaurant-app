// UserContext.js
import { createContext } from 'react';

const UserContext = createContext({
  username: '',
  role: '',
  setUser: () => {} // Placeholder for a function to update the context
});

export default UserContext;
