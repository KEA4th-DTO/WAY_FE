import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import "../assets/scss/layout/_fullLayout.scss"; // 스타일 추가

const FullLayout = () => {
  return (
    <main className="mainLayout">
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header />
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <Outlet />
          </Container>
          {/********Footer**********/}
          <footer className="footer">
            <Container fluid className="text-center p-3">
              <div className="footer-content">
                <div className="footer-section about">
                  <h5>About Us</h5>
                  <p>Gachon Univ. KEA 4기 DTO</p>
                </div>
                <div className="footer-section links">
                  <h5>Links</h5>
                  <ul>
                    <li><a href="https://github.com/KEA4th-DTO" target="_blank">GitHub</a></li>
                    <li><a href="https://www.notion.so/Develop-Together-Overnight-b4a5a74cfbd84dcf8e880deb57add202?pvs=4" target="_blank">About</a></li>
                    <li><a href="#" target="_blank">Contact</a></li>
                  </ul>
                </div>
                <div className="footer-section links">
                  <h5>Follow Us</h5>
                  <ul>
                  <li><a href="#" target="_blank"><i></i>PM</a></li>
                  <li><a href="#" target="_blank"><i></i>Architecture</a></li>
                  <li><a href="#" target="_blank"><i></i>AppDev</a></li>
                  </ul>
                </div>
                <div className="footer-section contact">
                  <h5>Contact Us</h5>
                  <p>Email: shc3113@gachon.ac.kr</p>
                  <p>Phone: +82 010 8356 9899</p>
                </div>
              </div>
              <div className="footer-bottom">
                <span>
                  © {new Date().getFullYear()} DTO. All rights reserved.
                </span>
              </div>
            </Container>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
