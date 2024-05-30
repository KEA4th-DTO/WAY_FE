import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";

const App = () => {
  const serviceName = process.env.REACT_APP_SERVICE_NAME;
  const secretToken = process.env.REACT_APP_SECRET_TOKEN;
  const serverUrl = process.env.REACT_APP_APM_SERVER_URL;
  const environment = process.env.REACT_APP_ENVIRONMENT;

  var apm = require("elastic-apm-node").start({
    serviceName: serviceName,
    secretToken: secretToken,
    serverUrl: serverUrl,
    environment: environment,
  });

  const routing = useRoutes(Themeroutes);
  return <div className="dark">{routing}</div>;
};

export default App;
