import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import wayLogo from "../assets/images/logos/way_logo.png";
import user from "../assets/images/users/user.png";
import alarm from "../assets/images/logos/alarm.png";
import hamburger from "../assets/images/logos/hamburger.png";
import Logo from "./Logo";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Navbar color="light" dark expand="md">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="d-lg-none">
          <img src={wayLogo} alt="Way Logo" style={{ maxWidth: "100px" }} />
        </NavbarBrand>
      </div>
      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink to="/localmap" className="nav-link" activeClassName="active">
              로컬맵
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/mymap" className="nav-link" activeClassName="active">
              마이맵
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/upload" className="nav-link" activeClassName="active">
              업로드
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/chatting" className="nav-link" activeClassName="active">
              채팅
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/search" className="nav-link" activeClassName="active">
              검색
            </NavLink>
          </NavItem>
        </Nav>

        
        <Button isOpen={dropdownOpen} toggle={toggle}
        style={{
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        }}
      >
        <img src={alarm} alt="alarm" style={{ width: '30px', height: '30px' }} />
      </Button>
        
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        }}
      >
        <img src={user} alt="profile" className="rounded-circle" width="30" />
      </DropdownToggle>

          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <Link to="/mypage" style={{ textDecoration: "none", color: "inherit" }}>
            <DropdownItem>My Account</DropdownItem>
            </Link>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>My Balance</DropdownItem>
            <DropdownItem>Inbox</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
        className="d-lg-none"
        onClick={showMobilemenu}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
      >
        <img src={hamburger} alt="Menu" style={{ width: '25px', height: '25px' }} />
      </Button>


      </Collapse>
    </Navbar>
  );
};

export default Header;
