import { Route, Routes } from "react-router-dom"
import { DonorRoutes } from "./Routes/DonorRoutes"
import LandingPage from "./Pages/LandingPage/LandingPage"
import { NGORoutes } from "./Routes/NGORoutes"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
<div>
  <Routes>
    <Route path="/" element={<LandingPage/>} />
    {DonorRoutes}
    {NGORoutes}
  </Routes>
 <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  toastStyle={{ zIndex: 99999 }}
/>

</div>
  )
}

export default App
