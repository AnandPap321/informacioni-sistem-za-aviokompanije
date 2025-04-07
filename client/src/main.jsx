import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./redux/store.jsx";
import AppRuter from "./AppRuter.jsx";
import { Provider } from "react-redux";
import "./stilovi/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppRuter />
    </Provider>
  </StrictMode>
);
