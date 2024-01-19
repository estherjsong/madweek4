import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FullLayout = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
    
  const navigate = useNavigate();

  useEffect(() => {
    // Check the authentication status when the component mounts
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    const token = localStorage.getItem('login-token');
    setIsLoggedIn(!!token);
  };

  const logout = () => {
    localStorage.removeItem('login-token');
    localStorage.clear();
    checkAuthenticationStatus();

    navigate('/');
  };

  return (
    <main>
      {/********header**********/}
      <Header isLoggedIn={isLoggedIn} onLogout={logout}/>
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        {/********Content Area**********/}
        <div className="contentArea">
          {/********Middle Content**********/}
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
