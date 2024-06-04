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
import { useNavigate } from "react-router-dom";
import "../assets/scss/layout/_header.scss"; // 스타일 추가

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alarmDropdownOpen, setAlarmDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [lastEventId, setLastEventId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/mypage"); // 프로필 페이지로 이동
  };

  const isValidJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem("accessToken");
      setToken(storedToken);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const Server_IP = process.env.REACT_APP_Server_IP;

      const headers = {
        Authorization: `Bearer ${token}`,
        "Last-Event-ID": lastEventId !== null ? lastEventId : "null",
      };

      const eventSource = new EventSourcePolyfill(
        `${Server_IP}/notification-service/sse-connection`,
        {
          headers: headers,
        }
      );

      eventSource.onmessage = (event) => {
        try {
          // JSON 형식의 데이터인지 확인
          if (isValidJson(event.data)) {
            const newNotification = JSON.parse(event.data);
            setNotifications((prev) => [...prev, newNotification]);
            setHasNewNotification(true);
            setLastEventId(event.lastEventId);
          } else {
            console.log("Non-JSON message received:", event.data);
          }
        } catch (error) {
          console.error("Error parsing SSE event data:", error);
        }
      };

      eventSource.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [token, lastEventId]);

  useEffect(() => {
    if (token) {
      const fetchNotifications = async () => {
        const Server_IP = process.env.REACT_APP_Server_IP;

        try {
          const response = await axios.post(
            `${Server_IP}/notification-service/notification-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setNotifications(response.data.result);
          console.log(response.data.result);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [token]);

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
        <Nav className="me-auto navbar-nav" navbar>
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

        <div className="navbar-buttons">
          <Dropdown isOpen={alarmDropdownOpen} toggle={toggleAlarmDropdown}>
            <DropdownToggle
              style={{
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={user}
              alt="profile"
              width="30"
              onClick={handleProfileClick} // 프로필 클릭 시 handleProfileClick 호출
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "none",
                padding: 0,
              }} // 커서가 포인터로 변경되어 클릭 가능함을 표시
            />
          </div>

          <Button
            className="d-lg-none"
            onClick={showMobilemenu}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={hamburger}
              alt="Menu"
              style={{ width: "25px", height: "25px" }}
            />
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default Header;
