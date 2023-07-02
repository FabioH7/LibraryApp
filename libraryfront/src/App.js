import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import { AuthProvider } from "./Contexts/authContext";
import { useEffect } from "react";
import Login from "./Pages/Login";

function App() {

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      const user = localStorage.getItem("user")
      if (user === null) {
        window.location.pathname = '/admin/login'
      }
      if (window.location.pathname === '/admin/login' && user !== null)
      {
        window.location.pathname = '/admin'
      }
    }
  }, [])

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <BrowserRouter>
      <AuthProvider>
          <Routes>
            <Route path="/admin"element={<AdminPage />} />
            <Route path="/admin/login" element={<Login/>} />
          </Routes>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
