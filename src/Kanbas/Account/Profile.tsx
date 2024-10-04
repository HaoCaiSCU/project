import { Link } from "react-router-dom";
import './style.css';  // 导入 CSS 文件

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input id="wd-username" value="alice" placeholder="username" className="form-control" />
      <input id="wd-password" value="123" placeholder="password" type="password" className="form-control" />
      <input id="wd-firstname" value="Alice" placeholder="First Name" className="form-control" />
      <input id="wd-lastname" value="Wonderland" placeholder="Last Name" className="form-control" />
      <input id="wd-dob" type="date" className="form-control" />
      <input id="wd-email" value="alice@wonderland" type="email" className="form-control" />
      <input id="wd-user" value="User" type="user" className="form-control" />
      <Link id="wd-signup-btn" to="/Kanbas/Account/Signin" className="btn btn-danger w-100">Sign out</Link>
    </div>
  );
}
