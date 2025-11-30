import { Route } from "react-router-dom";
import DonarDashboard from "../Pages/Donar/DonarDashboard";
import AddMedicine from "../Pages/Donar/AddMedicine";
import DonarAlert from "../Pages/Donar/DonarAlert";
import FindNGO from "../Pages/Donar/FindNGO";
import Register from "../Pages/Donar/Register";
import Login from "../Pages/Login";


export const DonorRoutes = (
  <>
    <Route path="/donor/dashboard" element={<DonarDashboard/>} />
    <Route path="/donor/add-medicine" element={<AddMedicine/>} />
    <Route path="/donor/alert" element={<DonarAlert />} />
    <Route path="/donor/find-ngo" element={<FindNGO />} />
    <Route path="/donor/register" element={<Register />} />
    <Route path="/donor/login" element={<Login />} />
  </>
);
