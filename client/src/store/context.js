import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [model, setModel] = useState(false);


  return (
    <UserContext.Provider value={{ model, setModel, }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
