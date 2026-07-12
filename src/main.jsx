import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "react-hot-toast";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <Provider store={store}>
    <Toaster position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000
      }} />
    <App />
  </Provider>
);