import logo from "@/images/logo.png";

export default function Logo({ className = "h-10 w-10" }) {
    return (
        <img
            src={logo}
            alt="Arfeels Furniture Trading"
            className={className}
        />
    );
}
