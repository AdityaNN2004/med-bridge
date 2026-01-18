import { Route } from "react-router-dom";
import DonarDashboard from "../Pages/Donar/DonarDashboard";
import AddMedicine from "../Pages/Donar/AddMedicine";
import DonarAlert from "../Pages/Donar/DonarAlert";
import DonorLogin from "../Pages/Donar/DonorLogin";
import ViewMedicine from "../Pages/Donar/ViewMedicine";
import DonorRegistration from "../Pages/Donar/DonorRegistration.jsx";
// import DonorChatbot from "../Compoments/Donarchatbot.jsx";
import DonarChatbot from "../Compoments/DonarChatbot.jsx";
import ViewStatus from "../Pages/Donar/VewStatus.jsx";
import ListedMedicine from "../Pages/Donar/ListedMedicine.jsx";
import DonorProfile from "../Pages/Donar/DonarProfile.jsx";
export const DonorRoutes = (
  <>
    <Route path="/donor/dashboard" element={<DonarDashboard/>} />
    <Route path="/donor/add-medicine" element={<AddMedicine/>} />
    <Route path="/donor/alert" element={<DonarAlert />} />
    <Route path="/donor/view-medicine" element={<ViewMedicine />} />
    <Route path="/donor/register" element={<DonorRegistration />} />
    <Route path="/donar/login" element= {<DonorLogin/>} />
    <Route path="/donor/chatbot" element={<DonarChatbot />} />
    <Route path="/donor/viewstatus/:id" element={<ViewStatus />} />
    <Route path="/donor/listedmedicine" element={<ListedMedicine />} />
    <Route path="/donor/viewprofile" element={<DonorProfile />} />
  </>
);
