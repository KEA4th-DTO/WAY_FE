<<<<<<< Updated upstream
import React, { Suspense } from "react";
// import ReactDOM from "react-dom";
import {createRoot} from 'react-dom/client';
import "./assets/scss/style.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import Loader from "./layouts/loader/Loader";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
=======
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "../src/fonts/Fonts.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
>>>>>>> Stashed changes

root.render(
<<<<<<< Updated upstream
  <Suspense fallback={<Loader />}>
    <HashRouter>
      <App />
    </HashRouter>
  </Suspense>,

  // document.getElementById("root")
=======
  <React.StrictMode>
    <App />
  </React.StrictMode>
>>>>>>> Stashed changes
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
