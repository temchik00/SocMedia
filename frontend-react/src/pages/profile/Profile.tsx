import "./Profile.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../shared/authContext";
import Menu from "../../components/Menu/Menu";
import AvatarSection from "./Components/AvatarSection/AvatarSection";
import ProfileInfo from "./Components/ProfileInfo/ProfileInfo";
import PublicationList from "./Components/PublicationList/PublicationList";
import PostCreation from "./Components/PostCreation/PostCreation";
import { ProfileContext } from "../../shared/profileContext";

function Profile() {
    const [search, setSearch] = useSearchParams();
    const { authState, userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const { profileId, profileInfo, setProfileId } = useContext(ProfileContext);

    useEffect(() => {
        const id = search.get("id");
        if (authState === false && id === null) {
            navigate("/authorization");
        }
    }, [authState, search]);

    useEffect(() => {
        const id = search.get("id");
        setProfileId(id);
    }, [search]);

    useEffect(() => {
        const id = search.get("id");

        if (authState === true && id === null && userId !== undefined) {
            setSearch({ id: userId!.toString() });
        }
    }, [userId, search]);

    function canModify(): boolean {
        return (
            profileId !== null &&
            userId !== undefined &&
            profileId === userId.toString()
        );
    }

    return (
        <>
            {profileInfo && (
                <>
                    <Menu></Menu>
                    <div className="Profile">
                        <div className="container">
                            <AvatarSection canModify={canModify()} />

                            <div className="profile-left">
                                <ProfileInfo />
                                {canModify() && <PostCreation />}
                                <PublicationList />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Profile;
