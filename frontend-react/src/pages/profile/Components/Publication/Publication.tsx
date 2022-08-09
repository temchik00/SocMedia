import "./Publication.scss";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { IPublication } from "../../../../interfaces/publication";
import { AuthContext } from "../../../../shared/authContext";
import axios from "../../../../api/axios";
import { ProfileContext } from "../../../../shared/profileContext";

const Publication: FC<{
    publication: IPublication;
}> = ({ publication }) => {
    const [likes, setLikes] = useState<number[]>([]);
    const [liked, setLiked] = useState<boolean>(false);
    const { userId, accessToken } = useContext(AuthContext);
    const { profileInfo } = useContext(ProfileContext);

    const isLiked = useCallback(() => {
        return userId !== undefined && likes.includes(userId);
    }, [userId, likes]);

    async function getLikes(): Promise<number[]> {
        const response = await axios.get<{ user_ids: number[] }>(
            `/publication/${publication.id}/likes/`
        );
        return response.data.user_ids;
    }

    async function toggleLike(): Promise<void> {
        if (userId !== undefined) {
            console.log(accessToken);
            await axios.put(
                `/publication/${publication.id}/like/`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );
            const likes = await getLikes();
            setLikes(likes);
        }
    }

    useEffect(() => {
        getLikes().then((likes) => {
            setLikes(likes);
        });
    }, [publication]);

    useEffect(() => {
        setLiked(isLiked());
    }, [isLiked]);

    return (
        <div className="panel Publication">
            <div className="info">
                <img src={profileInfo!.avatar} alt="" className="avatar" />
                <div className="right-side">
                    <div className="name">
                        {profileInfo!.name} {profileInfo!.familyName}
                    </div>
                    <div className="time">
                        {publication.timePosted.toLocaleString()}
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="text">{publication.content}</div>
                {publication.image && (
                    <img src={publication.image} className="image" />
                )}
            </div>
            <div className="likes">
                <button
                    className="like-container"
                    style={{
                        cursor: userId !== undefined ? "pointer" : "default",
                        borderColor: liked ? "#EA3A3A" : "#4E5259",
                    }}
                    disabled={userId === undefined}
                    onClick={toggleLike}
                >
                    <svg
                        className="heart"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 497 470"
                    >
                        <path
                            d="M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z"
                            stroke={liked ? "#EA3A3A" : "#5F646D"}
                            strokeWidth="50"
                            fill={liked ? "#EA3A3A" : "none"}
                        />
                    </svg>
                    <div className="like-count">{likes.length}</div>
                </button>
            </div>
        </div>
    );
};

export default Publication;
