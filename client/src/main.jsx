import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./redux/store.jsx";
import { AuthProvider } from "./context/authContext";
import AppRuter from "./AppRuter.jsx";
import "./stilovi/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider store={store}>
      <AppRuter />
    </AuthProvider>
  </StrictMode>
);
