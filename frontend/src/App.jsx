import { useCallback, useState } from 'react';
import AdminLogin from './AdminLogin.jsx';
import AdminPage from './AdminPage.jsx';
import PublicSite from './PublicSite.jsx';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const [adminUser, setAdminUser] = useState(null);
  const authenticate = useCallback((user) => setAdminUser(user), []);

  if (path === '/management' || path === '/management/login') {
    if (!adminUser) {
      return <AdminLogin onAuthenticated={authenticate} />;
    }

    return <AdminPage user={adminUser} onSignOut={() => setAdminUser(null)} />;
  }

  return <PublicSite />;
}
