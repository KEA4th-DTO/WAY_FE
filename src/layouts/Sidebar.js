import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navigation = [
  {
    title: "프로필 수정",
    href: "/modify_profile",
  },
  // {
  //   title: "차단 목록",
  //   href: "/blocklist",
  // },
  {
    title: "공지사항",
    href: "/notices",
  },
  {
    title: "문의사항",
    href: "/questions",
  },
  // {
  //   title: "회원탈퇴",
  //   href: "/withdrawal",
  // },
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
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
      navigate("/login"); // Redirect to login page after logout
    } else {
      console.error("Logout failed");
    }
  };
  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <NavItem>
          <Logo></Logo>
        </NavItem>
        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={() => showMobilemenu()}
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
              >
                <i className={navi.icon}></i>
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
    </div>
  );
};

export default Sidebar;
