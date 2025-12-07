import { Route } from "react-router-dom";
import DonarDashboard from "../Pages/Donar/DonarDashboard";
import AddMedicine from "../Pages/Donar/AddMedicine";
import DonarAlert from "../Pages/Donar/DonarAlert";
import Register from "../Pages/Donar/Register";
import DonorLogin from "../Pages/Donar/DonorLogin";
import ViewMedicine from "../Pages/Donar/ViewMedicine";
import DonorRegistration from "../Pages/Donar/DonorRegistration.jsx";


export const DonorRoutes = (
  <>
    <Route path="/donor/dashboard" element={<DonarDashboard/>} />
    <Route path="/donor/add-medicine" element={<AddMedicine/>} />
    <Route path="/donor/alert" element={<DonarAlert />} />
    <Route path="/donor/view-medicine" element={<ViewMedicine />} />
    <Route path="/donor/register" element={<DonorRegistration />} />
    <Route path="/donor/login" element={<DonorLogin />} />
  </>
);
