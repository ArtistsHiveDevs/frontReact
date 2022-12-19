import { BrowserRouter as Router } from "react-router-dom";
import { Suspense } from "react";

import { RoutesApp } from "./routes";

const App = () => (
  <Router>
    <div className="wrapper">
      <Suspense fallback={<div>Loading...</div>}>
        <RoutesApp />
      </Suspense>
    </div>
  </Router>
);

export default App;
