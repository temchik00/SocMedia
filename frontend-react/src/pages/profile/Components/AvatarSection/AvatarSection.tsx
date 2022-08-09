import "./AvatarSection.scss";
import { FC, useContext } from "react";
import { ProfileContext } from "../../../../shared/profileContext";
import { Link } from "react-router-dom";

const AvatarSection: FC<{ canModify: boolean }> = ({ canModify }) => {
    const { profileInfo } = useContext(ProfileContext);
    return (
        <div className="panel AvatarSection">
            <img
                src={process.env.PUBLIC_URL + profileInfo?.avatar}
                alt="avatar"
                className="avatar"
            />
            {canModify && (
                <Link to="/profile/redact" className="link">
                    <button className="base-button redact-button">
                        Редактировать
                    </button>
                </Link>
            )}
        </div>
    );
};

export default AvatarSection;
