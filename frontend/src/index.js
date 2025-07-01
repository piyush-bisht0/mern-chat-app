import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "./components/ui/provider";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/chatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChatProvider>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </ChatProvider>
);
