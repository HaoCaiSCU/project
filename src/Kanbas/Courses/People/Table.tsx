import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom"; // 获取课程 ID 和路由信息
import PeopleDetails from "./Details";
import { findUsersForCourse } from "../client"; // 引入获取课程学生的方法
import { useSelector } from "react-redux";

export default function PeopleTable({ users = [] }: { users?: any[] }) {
  const { cid } = useParams(); // 获取课程 ID
  const [students, setStudents] = useState<any[]>([]); // 保存课程学生数据

  const currentUser = useSelector((state: any) => state.accountReducer.currentUser); // 获取当前用户
  const isAdmin = currentUser?.role === "ADMIN"; // 判断是否为 ADMIN 用户
  const isFacultyOrStudentOrTA =
    currentUser?.role === "FACULTY" || currentUser?.role === "STUDENT" || currentUser?.role === "TA";

  // 使用 useEffect 动态获取课程的学生数据
  useEffect(() => {
    const fetchStudents = async () => {
      if (cid && isFacultyOrStudentOrTA) {
        const users = await findUsersForCourse(cid); // 获取课程关联的学生
        setStudents(users);
      }
    };
    fetchStudents();
  }, [cid, isFacultyOrStudentOrTA]);

  const displayedUsers = isAdmin ? users : students; // 根据角色显示所有用户或课程关联用户

  return (
    <div id="wd-people-table">
      <PeopleDetails />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <Link
                  to={`/Kanbas/Account/Users/${user._id}`}
                  className="text-decoration-none"
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </Link>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
