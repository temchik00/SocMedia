import axios from "../api/axios";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { IOption } from "../interfaces/option";

interface ITokenData {
    access_token: string;
    token_type: string;
}

interface IUserInfo {
    email: string;
    first_name: string;
    last_name: string;
    id: number;
    sex: number;
    city: number;
    birth_date: string;
    phone: string;
    avatar: string;
}

type LogIn = (email: string, password: string) => Promise<boolean>;

type LogOut = (callback?: () => void) => void;

type Register = (
    email: string,
    password: string,
    name: string,
    familyName: string,
    gender: IOption
) => Promise<boolean>;

export const AuthContext = React.createContext<{
    authState: boolean | undefined;
    userId: number | undefined;
    registerUser: Register;
}>({
    authState: undefined,
    userId: undefined,
    registerUser: async () => false,
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<boolean | undefined>(undefined);
    const [accessToken, setAccessToken] = useState<string>("");
    const [userId, setUserId] = useState<number | undefined>(undefined);

    const logIn: LogIn = async (email, password) => {
        let formData = new FormData();
        formData.set("username", email);
        formData.set("password", password);
        try {
            const response = await axios.post<ITokenData>(
                "/user/sign_in/",
                formData
            );
            setAccessToken(response.data.access_token);
            setAuthState(true);
            return true;
        } catch (error) {
            if (authState != false) setAuthState(false);
            return false;
        }
    };

    const logOut: LogOut = (callback?) => {
        setAuthState(false);
        setAccessToken("");
        if (callback) callback();
    };

    const register: Register = async (
        email,
        password,
        name,
        familyName,
        gender
    ) => {
        const body = {
            email: email,
            password: password,
            first_name: name,
            last_name: familyName,
        };
        try {
            const registerResponse = await axios.post<ITokenData>(
                "/user/sign_up/",
                body
            );
            const token = registerResponse.data.access_token;
            setAccessToken(token);
            await axios.patch(
                "/user/",
                { sex: gender.value },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            setAuthState(true);
            return true;
        } catch (error) {
            if (authState != false) setAuthState(false);
            return false;
        }
    };

    const getSelfInfo: () => Promise<IUserInfo> = () => {
        return axios.get("/user/", {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        });
    };

    const getSelfId: () => Promise<void> = async () => {
        const userInfoResponse = await getSelfInfo();
        setUserId(userInfoResponse.id);
    };

    useEffect(() => {
        if (accessToken.length > 0) {
            getSelfId();
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                authState: authState,
                userId: userId,
                registerUser: register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
