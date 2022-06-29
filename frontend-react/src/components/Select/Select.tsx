import "./Select.scss";
import SelectLib, { components, DropdownIndicatorProps } from "react-select";
import { FC } from "react";
import { IOption } from "../../interfaces/option";

interface IProps {
    id: string;
    className: string;
    option: { value: string; label: string } | undefined;
    options: { value: any; label: string }[];
    placeholder: string;
    onChange: (newValue: IOption) => void;
    onBlur?: () => void;
}

const DropdownIndicator = (
    props: DropdownIndicatorProps<{ value: string; label: string }, true>
) => {
    return (
        <components.DropdownIndicator {...props}>
            <img
                src={process.env.PUBLIC_URL + "/icons/chevron.svg"}
                alt=""
                className="indicator"
            />
        </components.DropdownIndicator>
    );
};

const Select: FC<IProps> = ({
    className,
    option,
    options,
    placeholder,
    onChange,
    id,
    onBlur,
}: IProps) => {
    const updateValue = (val: any, val2: any) => {
        onChange(val);
    };
    return (
        <SelectLib
            id={id}
            className={className}
            value={option}
            options={options}
            placeholder={placeholder}
            classNamePrefix="customSelect"
            isSearchable={false}
            onChange={updateValue}
            components={{ DropdownIndicator }}
            onBlur={onBlur}
        />
    );
};

export default Select;
