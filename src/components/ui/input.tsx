import { InputHTMLAttributes, forwardRef } from "react";



const input =  forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, placeholder, onChange, value, ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                className={className}
                {...props}
            />
        )
    }
)


export default input;