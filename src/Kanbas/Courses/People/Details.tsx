import { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../../Account/client";

export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingRole, setEditingRole] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      const user = await client.findUserById(uid);
      setUser(user);
      setName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
      setRole(user.role);
    };
  
    if (uid) fetchUser();
  }, [uid]); 
  


  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = { ...user, firstName, lastName, email, role };
    await client.updateUser(updatedUser); // 更新到后端
    setUser(updatedUser);
    setEditingName(false);
    setEditingEmail(false);
    setEditingRole(false);
  };


  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0 wd-close-details">
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      {/* Name Section */}
      <div className="text-danger fs-4">
        {!editingName ? (
          <>
            <span className="wd-name">{name}</span>
            <FaPencil onClick={() => setEditingName(true)} className="float-end fs-5 mt-2 wd-edit" />
          </>
        ) : (
          <>
            <input
              className="form-control w-75 wd-edit-name"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveUser();
              }}
            />
            <FaCheck onClick={saveUser} className="float-end fs-5 mt-2 me-2 wd-save" />
          </>
        )}
      </div>
      {/* Email Section */}
      <b>Email:</b>
      {!editingEmail ? (
        <>
          <span className="wd-email">{email}</span>
          <FaPencil onClick={() => setEditingEmail(true)} className="float-end fs-5 mt-2 wd-edit" />
        </>
      ) : (
        <>
          <input
            type="email"
            className="form-control w-75 wd-edit-email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
          <FaCheck onClick={saveUser} className="float-end fs-5 mt-2 me-2 wd-save" />
        </>
      )}
      <br />
      {/* Role Section */}
      <b>Role:</b>
      {!editingRole ? (
        <>
          <span className="wd-role">{role}</span>
          <FaPencil onClick={() => setEditingRole(true)} className="float-end fs-5 mt-2 wd-edit" />
        </>
      ) : (
        <>
          <select
            className="form-select w-75 wd-edit-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="STUDENT">Student</option>
            <option value="TA">Teaching Assistant</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Administrator</option>
            <option value="USER">User</option>
          </select>
          <FaCheck onClick={saveUser} className="float-end fs-5 mt-2 me-2 wd-save" />
        </>
      )}
      <br />

      <b>Login ID:</b>        <span className="wd-login-id">      {user.loginId}      </span> <br />
      <b>Section:</b>         <span className="wd-section">       {user.section}      </span> <br />
      <b>Total Activity:</b>  <span className="wd-total-activity">{user.totalActivity}</span> 
      <hr />
      <button onClick={() => navigate(-1)} className="btn btn-secondary float-end me-2 wd-cancel">
        Cancel
      </button>
    </div>
  );
}
