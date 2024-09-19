import Labs from "./Labs";
import Kanbas from "./Kanbas";
//import { HashRouter } from "react-router-dom";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
export default function App() {
 return (
  <HashRouter>
   <div>
    <Routes>
     <Route path="/" element={<Navigate to="Kanbas"/>}/>
     <Route path="/Labs/*" element={<Labs />} />
     <Route path="/Kanbas/*" element={<Kanbas />} />
    </Routes>
   </div>
  </HashRouter>
);}