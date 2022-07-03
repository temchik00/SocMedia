import { FormEvent, useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../shared/authContext";
import "./Authorization.scss";

function Authorization() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [authError, setAuthError] = useState<boolean>(false);
    const { authState, logIn } = useContext(AuthContext);

    async function authorize(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const result = await logIn(email, password);
        if (!result) {
            setAuthError(true);
        }
    }

    function clearAuthError(): void {
        if (authError) setAuthError(false);
    }

    return (
        <div className="auth-container">
            <form
                className="Authorization panel"
                onSubmit={authorize}
                onChange={clearAuthError}
            >
                <h1 className="header">Авторизация</h1>
                <div className="input-group">
                    <label htmlFor="">Почта</label>
                    <input
                        id="mail"
                        name="email"
                        type="text"
                        className="input"
                        placeholder="example@email.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="">Пароль</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="input"
                        placeholder="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <div className="button-wrapper">
                    <button className="apply-button" type="submit">
                        Войти
                    </button>
                    {authError && (
                        <div className="input-error">
                            Указаны неверные данные
                        </div>
                    )}
                </div>
                <div className="link-container">
                    <Link to="/registration" className="link">
                        Нет аккаунта?
                    </Link>
                </div>
            </form>
            {authState && <Navigate to="/profile" replace={true} />}
        </div>
    );
}

export default Authorization;
