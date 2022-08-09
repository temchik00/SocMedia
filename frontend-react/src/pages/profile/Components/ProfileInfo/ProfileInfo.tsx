import "./ProfileInfo.scss";
import { FC, useContext } from "react";
import { ProfileContext } from "../../../../shared/profileContext";

const ProfileInfo: FC<{}> = ({}) => {
    const { profileInfo } = useContext(ProfileContext);
    return (
        <div className="panel ProfileInfo">
            <h1 className="name">
                {profileInfo?.name} {profileInfo?.familyName}
            </h1>
            <div className="horizontal-line"></div>
            <div className="info-section">
                <div className="info-label">Дата рождения</div>
                <div className="info-entry">
                    {profileInfo?.birthDate
                        ? profileInfo?.birthDate
                        : "не указано"}
                </div>
                <div className="info-label">Пол</div>
                <div className="info-entry">
                    {profileInfo?.gender
                        ? profileInfo?.gender.label
                        : "не указано"}
                </div>
                <div className="info-label">Город</div>
                <div className="info-entry">
                    {profileInfo?.city ? profileInfo?.city.label : "не указано"}
                </div>
            </div>
            <div className="section-break">
                <div className="section-name">Контактная информация</div>
                <div className="horizontal-line"></div>
            </div>
            <div className="info-section">
                <div className="info-label">Телефон</div>
                <div className="info-entry">
                    {profileInfo?.phone ? profileInfo?.phone : "не указано"}
                </div>
                <div className="info-label">Почта</div>
                <div className="info-entry">
                    {profileInfo?.email ? profileInfo?.email : "не указано"}
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
