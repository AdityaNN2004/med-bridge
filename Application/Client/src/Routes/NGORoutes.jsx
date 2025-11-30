import { Route } from "react-router-dom";
import NGODashBoard from "../Pages/NGO/NGODashBoard";
import DocumentVerification from "../Pages/NGO/DocumentVerification";
import InventeroryManagement from "../Pages/NGO/InventeroryManagement";
import NGOAlert from "../Pages/NGO/NGOAlert";
import NGORegisteration from "../Pages/NGO/NGORegisteration";
import NGORequestManagement from "../Pages/NGO/NGORequestManagement";
import ServiceArea from "../Pages/NGO/ServiceArea";
import VerifcationUnderReview from "../Pages/NGO/VerifcationUnderReview";



export const NGORoutes = (
  <>
    <Route path="/ngo/dashboard" element={<NGODashBoard />} />
    <Route path="/ngo/verify" element={<DocumentVerification />} />
    <Route path="/ngo/inventory" element={<InventeroryManagement />} />
    <Route path="/ngo/alert" element={<NGOAlert />} />
    <Route path="/ngo/register" element={<NGORegisteration />} />
    <Route path="/ngo/requests" element={<NGORequestManagement />} />
    <Route path="/ngo/service-area" element={<ServiceArea />} />
    <Route path="/ngo/review" element={<VerifcationUnderReview />} />
  </>
);
