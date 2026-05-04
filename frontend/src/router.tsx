import {Routes, Route} from "react-router"
import Home from "./components/Home/Home"
import Register from "./components/Register/Register"

function RouterApp() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}

export default RouterApp