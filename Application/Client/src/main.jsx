    import React from "react";
    import ReactDOM from "react-dom/client";
    import { BrowserRouter } from "react-router-dom";
    import App from "./App.jsx";
    import "./index.css";
    import { Provider } from "react-redux";
    import {store} from "./store.js"
import AppWrapper from "./AppWrapper.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <Provider store={store}>
          <AuthProvider>
         <BrowserRouter>
        <AppWrapper />
        </BrowserRouter>
          </AuthProvider>
        </Provider>
      </React.StrictMode>
    );
