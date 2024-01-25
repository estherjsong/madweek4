import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import Logo from "./Logo";
import { ReactComponent as LogoWhite } from "../assets/images/logos/adminprowhite.svg";
import RegisterForm from "../views/Register";
import LoginForm from "../views/Login";
import LogoutForm from "../views/Logout";
import { API_BASE_URL } from "../config";
import user0 from "../assets/images/users/user0.jpg";
import user1 from "../assets/images/users/user1.jpg";
import user2 from "../assets/images/users/user2.jpg";
import user3 from "../assets/images/users/user3.jpg";
import user4 from "../assets/images/users/user4.jpg";
import user5 from "../assets/images/users/user5.jpg";
const userImages = [user0, user1, user2, user3, user4, user5];

// const Header = ({ isLoggedIn, onLogout }) => {
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const id = localStorage.getItem('id');
  const [profileId, setProfileId] = useState(0);

  useEffect(() => {
    // Check the authentication status when the component mounts
    checkAuthenticationStatus();
    setProfileId(localStorage.getItem('profileId') ? localStorage.getItem('profileId') : 0);
  }, []);

  const checkAuthenticationStatus = async () => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  };

  const [isOpen, setIsOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const [howManyNoti, setHowManyNoti] = useState(0);
  const [notiColor, setNotiColor] = useState('secondary');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notification`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const result = await response.json();

        // console.log("response", response)

        if (response.ok) {
          // console.log('Notifications get successful', result);
          setHowManyNoti(result.length);
        } else {
          // console.log('Notifications get failed:', result);
        }
      } catch (error) {
        console.error('An error occurred during getting:', error);
        // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
      }
    };

    // 초기 실행
    fetchData();

    // 일정한 간격(예: 5초)으로 주기적으로 실행
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // 5000 밀리초마다 실행

    // 컴포넌트가 언마운트될 때 clearInterval을 사용하여 interval 정리
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  useEffect(() => {
    setNotiColor(howManyNoti === 0 ? 'secondary' : 'primary');
  }, [howManyNoti]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const toggleRegister = () => setRegisterModalVisible(!isRegisterModalVisible);
  const toggleLogin = () => setLoginModalVisible(!isLoginModalVisible);
  const toggleLogout = () => setLogoutModalVisible(!isLogoutModalVisible);

  return (
    <Navbar color="white" light expand="md" className="fix-header">
      <div className="d-flex align-items-center">
        <div className="d-lg-block d-none me-5 pe-3">
          <Logo />
        </div>
        <NavbarBrand href="/">
          <LogoWhite className="d-lg-none" />
        </NavbarBrand>
        <Button
          color="primary"
          className=" d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to="/starter" className="nav-link">
              Starter
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </NavItem>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle caret nav>
              DD Menu
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        <Link to="/notifications" className="nav-link">
          <Button color={notiColor} outline>
            Notifications <Badge color={notiColor}>{howManyNoti}</Badge>
          </Button>
        </Link>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="transparent">
            <img
              src={userImages[profileId]}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            {isLoggedIn && (
              <>
                <Link to={`/userpage/${id}`} style={{ textDecoration: 'none' }}>
                  <DropdownItem>My Account</DropdownItem>
                </Link>
              </>
            )}
            {/* <DropdownItem>My Balance</DropdownItem>
            <DropdownItem>Inbox</DropdownItem> */}
            <div>

              {isLoggedIn ? (
                <div>
                  <DropdownItem onClick={toggleLogout}>Logout</DropdownItem>
                </div>
              ) : (
                <div>
                  <DropdownItem onClick={toggleLogin}>Login</DropdownItem>
                  <DropdownItem onClick={toggleRegister}>Register</DropdownItem>
                </div>
              )}
            </div>
            {/* <DropdownItem>Logout</DropdownItem> */}
          </DropdownMenu>
        </Dropdown>

        {isRegisterModalVisible && (
          <RegisterForm
            isVisible={isRegisterModalVisible}
            onClose={toggleRegister}
            onLog={() => {
              toggleLogin();
              toggleRegister();
            }} />
        )}
        {isLoginModalVisible && (
          <LoginForm
            isVisible={isLoginModalVisible}
            onClose={toggleLogin}
            onReg={() => {
              toggleRegister();
              toggleLogin();
            }} />
        )}
        {isLogoutModalVisible && (
          <LogoutForm isVisible={isLogoutModalVisible} onClose={toggleLogout} />
        )}
      </Collapse>
    </Navbar>
  );
};

export default Header;
