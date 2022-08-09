import "./App.scss";
import Authorization from "./pages/authorization/Authorization";
import Registration from "./pages/registration/Registration";
import Profile from "./pages/profile/Profile";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./shared/authContext";
import { ProfileProvider } from "./shared/profileContext";
import { RedactProfile } from "./pages/redactProfile/RedactProfile";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="/authorization" element={<Authorization />} />
                <Route
                    path="/profile"
                    element={
                        <ProfileProvider>
                            <Profile />
                        </ProfileProvider>
                    }
                />
                <Route path="/profile/redact" element={<RedactProfile />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
