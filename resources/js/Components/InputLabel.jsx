export default function InputLabel({
    value,
    className = '',
    children,
    htmlFor,
    for: labelFor,
    ...props
}) {
    return (
        <label
            htmlFor={htmlFor || labelFor}
            {...props}
            className={`block text-sm font-medium text-gray-700 ${className}`}
        >
            {value || children}
        </label>
    );
}
