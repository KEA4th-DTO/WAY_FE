import React, { useState } from "react";
import {
  Button,
  Nav,
  NavItem,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModifyProfile from "../components/main/ModifyProfile";
import "../assets/scss/layout/_sidebar.scss"; // 스타일 추가

const navigation = [
  {
    title: "프로필 수정",
    href: "#",
  },
  {
    title: "공지사항",
    href: "/notices",
  },
  {
    title: "문의사항",
    href: "/questions",
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const granttype = localStorage.getItem("grantType");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const Server_IP = process.env.REACT_APP_Server_IP;
    const response = await fetch(`${Server_IP}/auth-service/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      body: JSON.stringify({
        granttype: granttype,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
    });

    if (response.ok) {
      window.localStorage.clear();
      navigate("/login");
    } else {
      alert("로그아웃에 실패했습니다");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleProfileUpdate = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="p-3">
        <div className="d-flex align-items-center">
          <NavItem>
            <Logo />
          </NavItem>
          <span className="ms-auto d-lg-none">
            <Button
              close
              size="sm"
              className="ms-auto d-lg-none"
              onClick={toggleSidebar}
            ></Button>
          </span>
        </div>
        <div className="pt-4 mt-2">
          <Nav vertical className="sidebarNav">
            {navigation.map((navi, index) => (
              <NavItem key={index} className="sidenav-bg">
                <Link
                  to={navi.href}
                  className={
                    location.pathname === navi.href
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                  onClick={navi.title === "프로필 수정" ? toggleModal : null}
                >
                  <span className="ms-3 d-inline-block">{navi.title}</span>
                </Link>
              </NavItem>
            ))}
            <Button
              color="danger"
              tag="a"
              target="_blank"
              className="mt-3"
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </Nav>
        </div>
        <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
          <ModalHeader toggle={toggleModal}>프로필 수정</ModalHeader>
          <ModalBody>
            <ModifyProfile onProfileUpdate={handleProfileUpdate} />
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default Sidebar;
