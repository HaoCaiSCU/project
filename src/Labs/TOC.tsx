import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function TOC() {
    const { pathname } = useLocation();
    return (
        <div>
            <a
                href="https://github.com/HaoCaiSCU/kanbas-react-web-app"
                id="wd-github"
                target="_blank"
                rel="noopener noreferrer"
            >
                My GitHub
            </a>
            <br />
            <ul>
                <li><Link to="/Labs">Labs</Link></li>
                <li><Link to="/Labs/Lab1"
                className={`nav-link ${pathname.includes("Lab1") ? "active" : ""}`}>Lab 1</Link></li>
                <li><Link to="/Labs/Lab2"
                className={`nav-link ${pathname.includes("Lab2") ? "active" : ""}`}>Lab 2</Link></li>
                <li><Link to="/Labs/Lab3"
                className={`nav-link ${pathname.includes("Lab3") ? "active" : ""}`}>Lab 3</Link></li>
                <li><Link to="/Kanbas">Kanbas</Link></li>
            </ul>
        </div>
    );
}
