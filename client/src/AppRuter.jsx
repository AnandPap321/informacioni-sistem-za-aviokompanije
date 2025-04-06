import { BrowserRouter, Route, Routes } from "react-router";
import Pocetna from "./glavne-komponente/Pocetna";
import AdminUserManagement from "./glavne-komponente/AdminUserDashboard";

import AdminRoute from "./rute/adminRuta";
import "./stilovi/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pocetna />} />
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/korisnici" element={<AdminUserManagement />} />
          {/* Add more admin routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
