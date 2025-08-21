export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    localStorage.getItem('access') ? jwtDecode(localStorage.getItem('access')) : null
  );
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('access') && localStorage.getItem('refresh')
      ? {
          access: localStorage.getItem('access'),
          refresh: localStorage.getItem('refresh'),
        }
      : null
  );

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) setUser(jwtDecode(token));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authTokens, setAuthTokens }}>
      {children}
    </AuthContext.Provider>
  );
};
