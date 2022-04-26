import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatProvider from "./Context/ChatProvider";
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// reportWebVitals();
