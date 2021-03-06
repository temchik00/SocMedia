import "./Registration.scss";
import { Link, Navigate } from "react-router-dom";
import {
    FC,
    FormEvent,
    useState,
    useEffect,
    useCallback,
    useReducer,
    Dispatch,
    useContext,
} from "react";
import Select from "../../components/Select/Select";
import { IOption } from "../../interfaces/option";
import axios from "../../api/axios";
import { AuthContext } from "../../shared/authContext";

enum Step {
    FIRST,
    SECOND,
}

enum EmailError {
    NONE,
    INCORRECT,
    TAKEN,
    EMPTY,
}

enum PasswordError {
    NONE,
    SHORT,
    MISMATCH,
}

enum Action {
    STEP,
    GENDER,
    EMAIL,
    PASSWORD,
    REPASSWORD,
    NAME,
    FAMILYNAME,
}

interface IRegistrationState {
    step: Step;
    gender: IOption | undefined;
    email: string;
    password: string;
    rePassword: string;
    name: string;
    familyName: string;
}

const emailValidator = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
);

const reducer = (
    state: IRegistrationState,
    action: { type: Action; value: any }
): IRegistrationState => {
    switch (action.type) {
        case Action.STEP:
            return { ...state, step: action.value };
        case Action.GENDER:
            return { ...state, gender: action.value };
        case Action.EMAIL:
            return { ...state, email: action.value };
        case Action.PASSWORD:
            return { ...state, password: action.value };
        case Action.REPASSWORD:
            return { ...state, rePassword: action.value };
        case Action.NAME:
            return { ...state, name: action.value };
        case Action.FAMILYNAME:
            return { ...state, familyName: action.value };
        default:
            throw new Error();
    }
};

const Registration: FC = () => {
    const { authState, registerUser } = useContext(AuthContext);

    const [state, dispatch] = useReducer(reducer, {
        gender: undefined,
        step: Step.FIRST,
        email: "",
        password: "",
        rePassword: "",
        name: "",
        familyName: "",
    });

    function validateData(): boolean {
        return (
            state.email.length > 0 &&
            state.password.length >= 8 &&
            state.password === state.rePassword &&
            state.name.length > 0 &&
            state.familyName.length > 0 &&
            state.gender !== undefined &&
            emailValidator.test(state.email)
        );
    }

    function register(): void {
        if (validateData())
            registerUser(
                state.email,
                state.password,
                state.name,
                state.familyName,
                state.gender!
            );
    }

    return (
        <div className="registration-container">
            <Stepper step={state.step} />
            <>
                {state.step === Step.FIRST ? (
                    <FirstStep
                        email={state.email}
                        password={state.password}
                        rePassword={state.rePassword}
                        dispatch={dispatch}
                    />
                ) : (
                    <SecondStep
                        gender={state.gender}
                        name={state.name}
                        familyName={state.familyName}
                        dispatch={dispatch}
                        register={register}
                    />
                )}
            </>
            {authState && <Navigate to="/profile" replace={true} />}
        </div>
    );
};
export default Registration;

const FirstStep: FC<{
    email: string;
    password: string;
    rePassword: string;
    dispatch: Dispatch<{ type: Action; value: any }>;
}> = ({ dispatch, email, password, rePassword }) => {
    const [formCorrect, setFormCorrect] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<EmailError>(EmailError.NONE);
    const [passwordError, setPasswordError] = useState<PasswordError>(
        PasswordError.NONE
    );
    const [formTouched, setFormTouched] = useState<boolean>(false);

    function next(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (testForm()) dispatch({ type: Action.STEP, value: Step.SECOND });
    }

    const testForm = useCallback((): boolean => {
        return (
            emailError === EmailError.NONE &&
            password === rePassword &&
            password.length >= 8 &&
            formTouched
        );
    }, [emailError, password, rePassword, formTouched]);

    const validateForm = useCallback(
        () => setFormCorrect(testForm()),
        [testForm]
    );

    function testEmail(): boolean {
        return emailValidator.test(email);
    }

    useEffect(() => {
        validateForm();
    });

    async function isEmailTaken(): Promise<boolean> {
        const response = await axios.get<{ exists: boolean }>(
            `/user/exists/${email}/`
        );
        return response.data.exists;
    }

    async function validateEmail(): Promise<void> {
        if (email.length === 0) {
            setEmailError(EmailError.EMPTY);
            return;
        }
        if (!testEmail()) {
            setEmailError(EmailError.INCORRECT);
            return;
        }
        if (await isEmailTaken()) {
            setEmailError(EmailError.TAKEN);
            return;
        }
        setEmailError(EmailError.NONE);
    }

    function renderEmailError(): string {
        switch (emailError) {
            case EmailError.EMPTY:
                return "?????????? ???? ????????????";
            case EmailError.INCORRECT:
                return "???????????? ???????????????????????? ??????????";
            case EmailError.TAKEN:
                return "?????????????????? ?????????? ?????? ??????????";
            default:
                return "";
        }
    }

    function clearEmailError(): void {
        if (emailError !== EmailError.NONE) setEmailError(EmailError.NONE);
    }

    function validatePasswords(): void {
        if (password.length < 8) {
            setPasswordError(PasswordError.SHORT);
            return;
        }
        if (password !== rePassword) {
            setPasswordError(PasswordError.MISMATCH);
            return;
        }
        setPasswordError(PasswordError.NONE);
    }

    function renderPasswordError(): string {
        switch (passwordError) {
            case PasswordError.MISMATCH:
                return "???????????? ???? ??????????????????";
            case PasswordError.SHORT:
                return "???????????? ?????????????? ????????????????";
            default:
                return "";
        }
    }

    function clearPasswordError(): void {
        if (passwordError !== PasswordError.NONE)
            setPasswordError(PasswordError.NONE);
    }

    return (
        <form
            className="Registration panel"
            onSubmit={next}
            onBlur={() => setFormTouched(true)}
        >
            <h1 className="header">??????????????????????</h1>
            <div className="input-group">
                <label htmlFor="mail">??????????</label>
                <input
                    id="mail"
                    name="email"
                    type="text"
                    className="input"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => {
                        dispatch({ type: Action.EMAIL, value: e.target.value });
                        clearEmailError();
                    }}
                    onBlur={validateEmail}
                    autoComplete="email"
                />
                {emailError !== EmailError.NONE && (
                    <div className="input-error">{renderEmailError()}</div>
                )}
            </div>
            <div className="input-group">
                <label htmlFor="password">????????????</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="input"
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                        dispatch({
                            type: Action.PASSWORD,
                            value: e.target.value,
                        });
                        clearPasswordError();
                    }}
                    onBlur={() => {
                        validatePasswords();
                    }}
                    autoComplete="new-password"
                />
                {passwordError !== PasswordError.NONE && (
                    <div className="input-error">{renderPasswordError()}</div>
                )}
            </div>
            <div className="input-group">
                <label htmlFor="repeatPassword">?????????????????? ????????????</label>
                <input
                    id="repeatPassword"
                    name="repeatPassword"
                    type="password"
                    className="input"
                    placeholder="password"
                    value={rePassword}
                    onChange={(e) => {
                        dispatch({
                            type: Action.REPASSWORD,
                            value: e.target.value,
                        });
                        clearPasswordError();
                    }}
                    onBlur={() => {
                        validatePasswords();
                    }}
                    autoComplete="new-password"
                />
                {passwordError !== PasswordError.NONE && (
                    <div className="input-error">{renderPasswordError()}</div>
                )}
            </div>
            <button
                className="apply-button"
                type="submit"
                disabled={!formCorrect}
            >
                <span>??????????</span>
                <img
                    src={process.env.PUBLIC_URL + "/icons/arrow-right.svg"}
                    className="arrow"
                    alt=""
                />
            </button>
            <div className="link-container">
                <Link to="/authorization" className="link">
                    ?????? ???????? ???????????????
                </Link>
            </div>
        </form>
    );
};

const SecondStep: FC<{
    gender: IOption | undefined;
    name: string;
    familyName: string;
    dispatch: Dispatch<{ type: Action; value: any }>;
    register: () => void;
}> = ({ gender, name, familyName, dispatch, register }) => {
    const [nameError, setNameError] = useState<boolean>(false);
    const [familyNameError, setFamilyNameError] = useState<boolean>(false);
    const [genderError, setGenderError] = useState<boolean>(false);
    const [formError, setFormError] = useState<boolean>(true);
    const [genderOptions, setGenderOptions] = useState<IOption[]>([]);

    async function getGenderOptions(): Promise<IOption[]> {
        const response = await axios.get<{ name: string; id: number }[]>(
            "/sex/"
        );
        const options = response.data;
        let repackedOptions: IOption[] = [];
        options.forEach((option: { name: string; id: number }) => {
            repackedOptions.push({
                value: option.id.toString(),
                label: option.name,
            });
        });
        return repackedOptions;
    }

    useEffect(() => {
        const fetchData = async () => {
            const options = await getGenderOptions();
            setGenderOptions(options);
        };
        fetchData();
    }, []);

    function setGender(gender: IOption): void {
        dispatch({ type: Action.GENDER, value: gender });
    }

    function validateName(): void {
        setNameError(name.length === 0);
    }

    function validateFamilyName(): void {
        setFamilyNameError(familyName.length === 0);
    }

    function validateGender(): void {
        setGenderError(gender === undefined);
    }

    const validateForm = useCallback(() => {
        setFormError(
            name.length === 0 || familyName.length === 0 || gender === undefined
        );
    }, [name, familyName, gender]);

    useEffect(() => {
        validateForm();
    });

    return (
        <form className="Registration panel">
            <h1 className="header">??????????????????????</h1>
            <div className="input-group">
                <label htmlFor="name">??????</label>
                <input
                    id="name"
                    type="text"
                    className="input"
                    placeholder="????????"
                    value={name}
                    onChange={(e) => {
                        dispatch({ type: Action.NAME, value: e.target.value });
                        setNameError(false);
                    }}
                    onBlur={validateName}
                />
                {nameError && <div className="input-error">?????? ???? ??????????????</div>}
            </div>
            <div className="input-group">
                <label htmlFor="familyName">??????????????</label>
                <input
                    id="familyName"
                    type="text"
                    className="input"
                    placeholder="????????????"
                    autoComplete="family-name"
                    value={familyName}
                    onChange={(e) => {
                        dispatch({
                            type: Action.FAMILYNAME,
                            value: e.target.value,
                        });
                        setFamilyNameError(false);
                    }}
                    onBlur={validateFamilyName}
                />
                {familyNameError && (
                    <div className="input-error">?????????????? ???? ??????????????</div>
                )}
            </div>
            <div className="input-group">
                <label htmlFor="gender">??????</label>
                <Select
                    id="gender"
                    className="select"
                    option={gender}
                    options={genderOptions}
                    placeholder="???????????????? ??????"
                    onChange={(e) => {
                        setGender(e);
                        setGenderError(false);
                    }}
                    onBlur={validateGender}
                />
                {genderError && (
                    <div className="input-error">?????? ???? ????????????</div>
                )}
            </div>
            <button
                disabled={formError}
                className="apply-button"
                type="submit"
                onClick={(e) => {
                    e.preventDefault();
                    register();
                }}
            >
                ????????????????????????????????????
            </button>
            <div className="link-container">
                <Link to="/authorization" className="link">
                    ?????? ???????? ???????????????
                </Link>
            </div>
        </form>
    );
};

function Stepper({ step }: { step: Step }) {
    return (
        <div className="Stepper">
            <button
                className={`step-circle ${
                    step === Step.FIRST ? "active" : "inactive"
                }`}
            >
                1
            </button>
            <button
                className={`step-circle ${
                    step === Step.SECOND ? "active" : "inactive"
                }`}
            >
                2
            </button>
        </div>
    );
}
