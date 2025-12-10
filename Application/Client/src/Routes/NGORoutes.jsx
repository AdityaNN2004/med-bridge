import { Route } from "react-router-dom";
import NGODashboard from "../Pages/NGO/NGODashBoard";
import InventeroryManagement from "../Pages/NGO/InventeroryManagement";
import NGOAlert from "../Pages/NGO/NGOAlert";
import ServiceArea from "../Pages/NGO/OtherRegistrationProcess/ServiceArea";
import NGORegisteration from "../Pages/NGO/Registration/NGORegisteration";
import DocumentVerification from "../Pages/NGO/OtherRegistrationProcess/DocumentVerification";
import VerifcationUnderReview from "../Pages/NGO/OtherRegistrationProcess/VerifcationUnderReview";
import NGOLogin from "../Pages/NGO/NGOLogin";
import NGORequest from "../Pages/NGO/NGORequest";
import NGOChatBot from "../Compoments/NGOChatbot";

import NgoViewStatus from "../Pages/NGO/NgoViewStatus";
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
     <Route path="/ngo/chatbot" element={<NGOChatBot />} />
      <Route path="/ngo/viewstatus" element={<NgoViewStatus />} />
  </>
);
