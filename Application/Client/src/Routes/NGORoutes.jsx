import { Route } from "react-router-dom";
import NGODashboard from "../Pages/NGO/NGODashBoard";
import InventeroryManagement from "../Pages/NGO/InventeroryManagement";
import NGOAlert from "../Pages/NGO/NGOAlert";
import ServiceArea from "../Pages/NGO/OtherRegistrationProcess/ServiceArea";
import NGORegisteration from "../Pages/NGO/Registration/NGORegisteration";
import DocumentVerification from "../Pages/NGO/OtherRegistrationProcess/DocumentVerification";
import VerifcationUnderReview from "../Pages/NGO/OtherRegistrationProcess/VerifcationUnderReview";
import NGOLogin from "../Pages/NGO/NGOLogin";
import NGOChatBot from "../Compoments/NGOChatbot";
import NGOListedMedicineInArea from "../Pages/NGO/NGOListedMedicineInArea";
import NgoViewStatus from "../Pages/NGO/NgoViewStatus";
import NGOProfile from "../Pages/NGO/NGOProfile";
export const NGORoutes = (
  <>
    <Route path="/ngo/dashboard" element={<NGODashboard />} />
    <Route path="/ngo/verify" element={<DocumentVerification />} />
    <Route path="/ngo/inventory" element={<InventeroryManagement />} />
    <Route path="/ngo/alert" element={<NGOAlert />} />
    <Route path="/ngo/register" element={<NGORegisteration />} />
    <Route path="/ngo/listedmedicineinarea" element={<NGOListedMedicineInArea />} />
    <Route path="/ngo/service-area" element={<ServiceArea />} />
    <Route path="/ngo/review" element={<VerifcationUnderReview />} />
    <Route path="/ngo/login" element={<NGOLogin />} />
     <Route path="/ngo/chatbot" element={<NGOChatBot />} />
      <Route path="/ngo/viewstatus/:id" element={<NgoViewStatus />} />
      <Route path="/ngo/profile" element={<NGOProfile/>}/>
  </>
);
