import { Link } from "react-router-dom";
import "./style.css";  // 导入 CSS 文件

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        id="wd-username"
        placeholder="username"
        className="form-control"
      />
      <input
        id="wd-password"
        placeholder="password"
        type="password"
        className="form-control"
      />
      <Link
        id="wd-signin-btn"
        to="/Kanbas/Account/Profile"
        className="btn btn-primary w-100"
      >
        Sign in
      </Link>
      <Link id="wd-signup-link" to="/Kanbas/Account/Signup">
        Sign up
      </Link>
    </div>
  );
}
