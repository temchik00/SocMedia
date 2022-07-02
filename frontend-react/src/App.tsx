import "./App.scss";
import Authorization from "./pages/authorization/Authorization";
import Registration from "./pages/registration/Registration";
import Profile from "./pages/profile/Profile";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./shared/authContext";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="/authorization" element={<Authorization />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
