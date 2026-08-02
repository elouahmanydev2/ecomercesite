import { ChangeEvent } from "react";

  interface Props{
    label:string;
    name:string;
    value:string;
    inputType?: React.HTMLInputTypeAttribute;
    placeholder:string;
    onChange:(e: ChangeEvent<HTMLInputElement, HTMLInputElement>)=>void;
    labelClass:string;
    inputClass:string;
  }

export default  function InputField({label,name,value,inputType,placeholder,onChange,labelClass,inputClass}:Props) {
    return(
          <div>
              <label className={labelClass}>
                {label}
              </label>

              <input
                type={inputType}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={inputClass}
                required
              />
            </div>
    )
}