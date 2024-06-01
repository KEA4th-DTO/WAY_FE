import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  Collapse,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { EventSourcePolyfill } from "event-source-polyfill";
import wayLogo from "../assets/images/logos/way_logo.png";
import user from "../assets/images/users/user.png";
import alarm from "../assets/images/logos/alarm.png";
import hamburger from "../assets/images/logos/hamburger.png";
import NotificationList from "../components/NotificationList";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alarmDropdownOpen, setAlarmDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [lastEventId, setLastEventId] = useState(null);

  useEffect(() => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const token = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Last-Event-ID": lastEventId !== null ? lastEventId : "null",
    };

    const eventSource = new EventSourcePolyfill(
      `${Server_IP}/notification-service/see-connection`,
      {
        headers: headers,
      }
    );

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [...prev, newNotification]);
      setHasNewNotification(true);
      setLastEventId(event.lastEventId);
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [lastEventId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const Server_IP = process.env.REACT_APP_Server_IP;
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          `${Server_IP}/notification-service/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(response.data.result);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggleAlarmDropdown = () =>
    setAlarmDropdownOpen((prevState) => !prevState);

  const handleAlarmClick = () => {
    setHasNewNotification(false);
  };

  return (
    <Navbar color="light" dark expand="md" sticky="top">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="d-lg-none">
          <img src={wayLogo} alt="Way Logo" style={{ maxWidth: "100px" }} />
        </NavbarBrand>
      </div>
      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink to="/localmap" className="nav-link">
              로컬맵
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/mymap" className="nav-link">
              마이맵
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/upload" className="nav-link">
              업로드
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/chatting" className="nav-link">
              채팅
            </NavLink>
          </NavItem>
          <div className="menu-divider"></div>
          <NavItem>
            <NavLink to="/search" className="nav-link">
              검색
            </NavLink>
          </NavItem>
        </Nav>

        <Dropdown isOpen={alarmDropdownOpen} toggle={toggleAlarmDropdown}>
          <DropdownToggle
            style={{
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
            }}
            onClick={handleAlarmClick}
          >
            <img
              src={alarm}
              alt="alarm"
              style={{
                width: "30px",
                height: "30px",
                filter: hasNewNotification
                  ? "grayscale(0%)"
                  : "grayscale(100%)",
              }}
            />
          </DropdownToggle>

          <DropdownMenu
            style={{ width: "350px", maxHeight: "500px", overflowY: "auto" }}
          >
            {notifications.length === 0 ? (
              <DropdownItem header>알림이 없습니다</DropdownItem>
            ) : (
              <NotificationList notifications={notifications} />
            )}
          </DropdownMenu>
        </Dropdown>

        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            style={{
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
            }}
          >
            <img
              src={user}
              alt="profile"
              className="rounded-circle"
              width="30"
            />
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem>My Account</DropdownItem>
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
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        >
          <img
            src={hamburger}
            alt="Menu"
            style={{ width: "25px", height: "25px" }}
          />
        </Button>
      </Collapse>
    </Navbar>
  );
};

export default Header;
