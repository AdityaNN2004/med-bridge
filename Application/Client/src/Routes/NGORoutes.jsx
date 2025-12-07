import { Route } from "react-router-dom";
import NGODashboard from "../Pages/NGO/NGODashBoard";
import InventeroryManagement from "../Pages/NGO/Inventory/InventeroryManagement";
import NGOAlert from "../Pages/NGO/Alert/NGOAlert";
import ServiceArea from "../Pages/NGO/OtherRegistrationProcess/ServiceArea";
import NGORegisteration from "../Pages/NGO/Registration/NGORegisteration";
import DocumentVerification from "../Pages/NGO/OtherRegistrationProcess/DocumentVerification";
import VerifcationUnderReview from "../Pages/NGO/OtherRegistrationProcess/VerifcationUnderReview";
import NGOLogin from "../Pages/NGO/Login/NGOLogin";
import NGORequest from "../Pages/NGO/Request/NGORequest";
export const NGORoutes = (
  <>
    <Route path="/ngo/dashboard" element={<NGODashboard />} />
    <Route path="/ngo/verify" element={<DocumentVerification />} />
    <Route path="/ngo/inventory" element={<InventeroryManagement />} />
    <Route path="/ngo/alert" element={<NGOAlert />} />
    <Route path="/ngo/register" element={<NGORegisteration />} />
    <Route path="/ngo/requests" element={<NGORequest />} />
    <Route path="/ngo/service-area" element={<ServiceArea />} />
    <Route path="/ngo/review" element={<VerifcationUnderReview />} />
    <Route path="/ngo/login" element={<NGOLogin />} />
  </>
);
