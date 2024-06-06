import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EventSourcePolyfill } from "event-source-polyfill";
import wayLogo from "../assets/images/logos/way_logo.png";
import user from "../assets/images/users/user.png";
import alarm from "../assets/images/logos/alarm.png";
import hamburger from "../assets/images/logos/hamburger.png";
import NotificationList from "../components/NotificationList";
import Sidebar from "./Sidebar"; // Sidebar 컴포넌트 추가
import axios from "axios";
import "../assets/scss/layout/_header.scss"; // 스타일 추가

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 추가
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [lastEventId, setLastEventId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [firstConnection, setFirstConnection] = useState(true); // 첫 연결 여부를 확인하는 상태
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false); // 알림 박스 상태 추가
  const [alarmDropdownOpen, setAlarmDropdownOpen] = useState(false);
  const toggleAlarmDropdown = () =>
    setAlarmDropdownOpen((prevState) => !prevState);
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
          if (isValidJson(event.data)) {
            const newNotification = JSON.parse(event.data);
            setNotifications((prev) => [...prev, newNotification]);
            setHasNewNotification(true);
            setLastEventId(event.lastEventId);
            if (!firstConnection) {
              toast.info("알람이 왔습니다!");
            }
          } else {
            if (!firstConnection) {
              toast.info("새로운 알림이 있습니다");
            }
            setHasNewNotification(true);
          }
        } catch (error) {
        } finally {
          setFirstConnection(false); // 첫 연결 이후로 플래그 변경
        }
      };

      eventSource.onerror = (err) => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [token, lastEventId, firstConnection]);

  const fetchNotifications = async () => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    if (!token) return;

    try {
      const response = await axios.post(
        `${Server_IP}/notification-service/notification-list`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data.result);
    } catch (error) {}
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // 사이드바 상태 토글
  };

  const handleAlarmClick = () => {
    setHasNewNotification(false);
    fetchNotifications(); // 알람 아이콘 클릭 시 알람 리스트 새로고침
    setIsNotificationBoxOpen(!isNotificationBoxOpen); // 알림 박스 상태 토글
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/">
            <img src={wayLogo} alt="Way Logo" className="logo" />
          </NavLink>
        </div>
        <ul className={`navbar-nav ${isOpen ? "show" : ""}`}>
          <li className="nav-item">
            <NavLink to="/localmap" className="nav-link">
              로컬맵
            </NavLink>
          </li>
          <li className="nav-divider"></li> {/* 구분선 추가 */}
          <li className="nav-item">
            <NavLink to="/mymap" className="nav-link">
              마이맵
            </NavLink>
          </li>
          <li className="nav-divider"></li> {/* 구분선 추가 */}
          <li className="nav-item">
            <NavLink to="/upload" className="nav-link">
              업로드
            </NavLink>
          </li>
          <li className="nav-divider"></li> {/* 구분선 추가 */}
          <li className="nav-item">
            <NavLink to="/search" className="nav-link">
              검색
            </NavLink>
          </li>
        </ul>
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

            <DropdownMenu className="notification-dropdown-menu">
              {notifications.length === 0 ? (
                <DropdownItem header>알림이 없습니다</DropdownItem>
              ) : (
                <NotificationList notifications={notifications} />
              )}
            </DropdownMenu>
          </Dropdown>
          <div className="navbar-item" onClick={handleProfileClick}>
            <img src={user} alt="profile" className="profile-icon" />
          </div>
          <button className="navbar-toggler" onClick={toggleSidebar}>
            <img src={hamburger} alt="Menu" />
          </button>
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ToastContainer />
    </header>
  );
};

export default Header;
