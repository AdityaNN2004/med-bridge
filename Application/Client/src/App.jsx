import { Route, Routes } from "react-router-dom"
import { DonorRoutes } from "./Routes/DonorRoutes"
import LandingPage from "./Pages/LandingPage/LandingPage"
import { NGORoutes } from "./Routes/NGORoutes"

function App() {

  return (
<div>
  <Routes>
    <Route path="/" element={<LandingPage/>} />
    {DonorRoutes}
    {NGORoutes}
  </Routes>
</div>
  )
}

export default App
