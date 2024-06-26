import { lazy } from "react";
import { Navigate } from "react-router-dom";
import QuestionDetail from "../components/QuestionDetail.js";
import NoticeDetail from "../components/NoticeDetail.js";
import FindIDPW from "../views/FindIDPW.js";
import PrivateRoute from "./PrivateRoute";
import UptoMy from "../components/main/UptoMy.js";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Login = lazy(() => import("../pages/Login.jsx"));
const Signup = lazy(() => import("../pages/Signup.jsx"));
const Auth = lazy(() => import("../pages/Auth.jsx"));

/***** Views ****/
const Localmap = lazy(() => import("../views/Localmap.js"));
const Mymap = lazy(() => import("../views/Mymap.js"));
const Othersmap = lazy(() => import("../views/Othersmap.js"));
const Upload = lazy(() => import("../views/Upload.js"));
const Chatting = lazy(() => import("../views/Chatting.js"));
const Search = lazy(() => import("../views/Search.js"));
const MyPage = lazy(() => import("../views/MyPage.js"));
const OtherPage = lazy(() => import("../views/OtherPage.js"));

const Modi_profile = lazy(() => import("../components/main/ModifyProfile.js"));
const BlockList = lazy(() => import("../views/ui/BlockList"));
const Notices = lazy(() => import("../views/ui/Notices"));
const Questions = lazy(() => import("../views/ui/Questions"));
const Withdrawal = lazy(() => import("../views/ui/Withdrawal"));

const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/findidpw",
    element: <FindIDPW />,
  },
  {
    path: "/",
    element: <PrivateRoute element={<FullLayout />} />,
    children: [
      { path: "localmap", exact: true, element: <Localmap /> },
      { path: "/mymap", exact: true, element: <Mymap /> },
      { path: "/othersmap", exact: true, element: <Othersmap /> },
      { path: "/uptomy", exact: true, element: <UptoMy /> },
      { path: "/upload", exact: true, element: <Upload /> },
      { path: "/chatting", exact: true, element: <Chatting /> },
      { path: "/search", exact: true, element: <Search /> },
      { path: "/mypage", exact: true, element: <MyPage /> },
      { path: "/profile/:nickname", exact: true, element: <OtherPage /> },

      { path: "/modify_profile", exact: true, element: <Modi_profile /> },
      { path: "/blocklist", exact: true, element: <BlockList /> },
      { path: "/notices", exact: true, element: <Notices /> },
      { path: "/notices/:id", exact: true, element: <NoticeDetail /> },
      { path: "/questions", exact: true, element: <Questions /> },
      { path: "/questions/:id", exact: true, element: <QuestionDetail /> },
      { path: "/withdrawal", exact: true, element: <Withdrawal /> },

      { path: "/table", exact: true, element: <Tables /> },
      { path: "/forms", exact: true, element: <Forms /> },
      { path: "/breadcrumbs", exact: true, element: <Breadcrumbs /> },
    ],
  },
];

export default ThemeRoutes;
