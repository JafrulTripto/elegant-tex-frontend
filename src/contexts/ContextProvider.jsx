import {createContext, useContext, useState} from "react";

const StateContext = createContext({
  user: null,
  token: null,
  roles:[],
  Permissions:[],
  setUser: () => {},
  setToken: () => {},
  setRoles: () => {},
  setPermissions:()=> {}
})

export const ContextProvider = ({children}) => {

  const [user, setUser] = useState({});
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const setToken = (token, expireTime) => {
    console.log(expireTime)
    _setToken(token);
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
      localStorage.setItem('TOKEN_EXPIRATION', new Date(Date.now() +expireTime * 1000).toString());
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('TOKEN_EXPIRATION');
    }
  }

  return (
    <StateContext.Provider value={{
      user,
      token,
      roles,
      permissions,
      setUser,
      setToken,
      setRoles,
      setPermissions
    }}>
      {children}
    </StateContext.Provider>
  )
}
export const useStateContext = () => useContext(StateContext);
