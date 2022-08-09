import "./Menu.scss";
import { FC, useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import { Link } from "react-router-dom";

const Menu: FC = () => {
    const { authState, logOut } = useContext(AuthContext);
    return (
        <nav className="Menu">
            <ul>
                <li>
                    <Link to="/profile">Профиль</Link>
                </li>
                <li>
                    <Link to="/authorization">Друзья</Link>
                </li>
                <li>
                    <Link to="/authorization">Люди</Link>
                </li>
                <li>
                    <Link to="/authorization">Сообщения</Link>
                </li>
                {authState ? (
                    <li
                        onClick={() => {
                            logOut();
                        }}
                    >
                        <Link to="/authorization">Выйти</Link>
                    </li>
                ) : (
                    <li>
                        <Link to="/authorization">Войти</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Menu;
