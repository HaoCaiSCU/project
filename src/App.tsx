import store from "./Kanbas/store";
import { Provider } from "react-redux";
import Labs from "./Labs";
import Kanbas from "./Kanbas";
//import { HashRouter } from "react-router-dom";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./landingPage";
export default function App() {
    return (
        <HashRouter>
            <Provider store={store}>
                <div>
                    <Routes>
                        <Route path="/" element={<Navigate to="Landing" />} />
                        <Route path="/Labs/*" element={<Labs />} />
                        <Route path="/Kanbas/*" element={<Kanbas />} />
                        <Route path="/Landing/*" element={<Landing />} />
                    </Routes>
                </div>
            </Provider>
        </HashRouter >
    );
}