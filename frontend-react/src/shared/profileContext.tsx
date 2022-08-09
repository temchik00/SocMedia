import React, { FC, ReactNode, useState, useEffect, useContext } from "react";
import { IPublication, IPublicationResponse } from "../interfaces/publication";
import { IUserInfo, IUserResponse } from "../interfaces/userInfo";
import axios from "../api/axios";
import { IOption } from "../interfaces/option";
import { AuthContext } from "./authContext";

type SetProfileId = (profileId: string | null) => void;
type PostPublication = (
    content: string,
    image: File | undefined
) => Promise<void>;

export const ProfileContext = React.createContext<{
    profileId: string | null;
    profileInfo: IUserInfo | undefined;
    publications: IPublication[];
    setProfileId: SetProfileId;
    postPublication: PostPublication;
}>({
    profileId: null,
    profileInfo: undefined,
    publications: [],
    setProfileId: () => {},
    postPublication: async () => {},
});

export const ProfileProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [profileId, setProfileId] = useState<string | null>(null);
    const [profileInfo, setProfileInfo] = useState<IUserInfo | undefined>(
        undefined
    );
    const [publications, setPublications] = useState<IPublication[]>([]);
    const { authState, accessToken } = useContext(AuthContext);

    useEffect(() => {
        if (profileId !== null) {
            getProfileInfo().then((profileInfo) => {
                setProfileInfo(profileInfo);
            });
            getPublications().then((publications) => {
                setPublications(publications);
            });
        } else {
            setProfileInfo(undefined);
            setPublications([]);
        }
    }, [profileId]);

    async function getGender(genderId: number): Promise<IOption> {
        const genderResponse = await axios.get<{
            id: number;
            name: string;
        }>(`/sex/${genderId}/`);
        return {
            value: genderResponse.data.id.toString(),
            label: genderResponse.data.name,
        };
    }

    async function getCity(cityId: number): Promise<IOption> {
        const cityResponse = await axios.get<{
            id: number;
            name: string;
        }>(`/city/${cityId}/`);
        return {
            value: cityResponse.data.id.toString(),
            label: cityResponse.data.name,
        };
    }

    async function getProfileInfo(): Promise<IUserInfo> {
        const userResponse = (
            await axios.get<IUserResponse>(`/user/${profileId}/`)
        ).data;
        let gender: IOption | null = null;
        if (userResponse.sex !== null) {
            gender = await getGender(userResponse.sex);
        }
        let city: IOption | null = null;
        if (userResponse.city !== null) {
            city = await getCity(userResponse.city);
        }
        return {
            id: userResponse.id,
            email: userResponse.email,
            name: userResponse.first_name,
            familyName: userResponse.last_name,
            gender: gender,
            city: city,
            birthDate: userResponse.birth_date,
            phone: userResponse.phone,
            avatar:
                userResponse.avatar.length === 0
                    ? "/icons/nophoto.svg"
                    : `${process.env.REACT_APP_BACKEND_URL}/file/${userResponse.avatar}/`,
        };
    }

    function repackPublication(
        publication: IPublicationResponse
    ): IPublication {
        return {
            id: publication.id,
            userId: publication.user_id,
            timePosted: new Date(publication.time_posted),
            content: publication.content,
            image: publication.image
                ? `${process.env.REACT_APP_BACKEND_URL}/file/${publication.image}/`
                : null,
        };
    }

    async function getPublications(): Promise<IPublication[]> {
        const response = (
            await axios.get<IPublicationResponse[]>(
                `/publication/${profileId}/`
            )
        ).data;
        let publications: IPublication[] = [];
        response.forEach((publication) => {
            publications.push(repackPublication(publication));
        });
        return publications;
    }

    async function sendImage(image: File): Promise<string> {
        let formData = new FormData();
        formData.set("file", image, image.name);
        const response = await axios.post<{ filename: string }>(
            "/file/",
            formData,
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        );
        return response.data.filename;
    }

    async function postPublication(
        content: string,
        image: File | undefined
    ): Promise<void> {
        if (authState !== true) return;
        let body: any = {};
        if (image === undefined && content.length === 0) return;
        if (image !== undefined) {
            body["image"] = await sendImage(image);
        }
        if (content.length > 0) {
            body["content"] = content;
        }
        await axios.post("/publication/", body, {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        });
        getPublications().then((publications) => {
            setPublications(publications);
        });
    }

    return (
        <ProfileContext.Provider
            value={{
                profileId: profileId,
                profileInfo: profileInfo,
                publications: publications,
                setProfileId: setProfileId,
                postPublication: postPublication,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};
