import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";

const FullLayout = () => {
  return (
    <main>
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
              <span>
                © {new Date().getFullYear()} DTO. All rights reserved.
              </span>
            </Container>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
