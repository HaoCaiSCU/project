import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AssignmentsControls from "./AssignmentsControls";
import { BsGripVertical } from "react-icons/bs";
import { GiNotebook } from "react-icons/gi";
import { GoTriangleDown } from "react-icons/go";
import { BsTrash3Fill } from "react-icons/bs";
import AssignControlButtons from "./AssignControlButtons";
import { setAssignment, deleteAssignment } from "./reducer";
import * as assignmentsClient from "./client";
import Editing from "./WarningWindow";
import "./style.css";
import AssignmentsControlButtons from "./AssignmentsControlButtons";

export default function Assignments() {
  const { cid } = useParams(); // 获取课程编号
  const dispatch = useDispatch();

  // 本地状态管理作业列表（只显示简单的名称列表）
  const [simpleAssignments, setSimpleAssignments] = useState<any[]>([]);

  // 从 Redux 状态中获取数据
  const assignments = useSelector((state: any) => state.assignmentReducer.assignments);
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  
  // 确保过滤时的 `cid` 是课程编号
  const courseAssignments = assignments.filter((assignment: any) => {
    const courseField = typeof assignment.course === "object" ? assignment.course.number : assignment.course;
    return courseField === cid;
  });
  
  //const courseAssignments = assignments.filter((assignment: any) => assignment.course === cid);
  const isFaculty = currentUser?.role === "FACULTY";

  // 获取作业列表的函数
  const fetchAssignments = useCallback(async () => {
    if (!cid) return; // 确保 `cid` 存在
    try {
      const assignments = await assignmentsClient.findAssignmentsForCourse(cid); // 使用课程编号
      dispatch(setAssignment(assignments)); // 将作业保存到 Redux
      setSimpleAssignments(assignments); // 将作业保存到本地状态
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  }, [cid, dispatch]);

  // 删除作业的函数
  const removeAssignment = async (assignmentId: string) => {
    try {
      await assignmentsClient.deleteAssignment(assignmentId);
      dispatch(deleteAssignment(assignmentId));
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div id="wd-assignments">
      {/* 如果是 FACULTY，显示作业控制面板 */}
      {isFaculty && <AssignmentsControls courseId={cid as string} />}
      <br />
      <br />
      <br />

      {/* 详细作业列表 */}
      <ul id="wd-assignments-title" className="list-group round-0 w-100">
        <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
          <div className="we-title p-3 ps-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f1f2f3" }}>
            <div>
              <BsGripVertical className="me-2 fs-3" /> <GoTriangleDown /> ASSIGNMENTS
            </div>
            {/* 只有 FACULTY 用户显示控制按钮 */}
            {isFaculty && <AssignControlButtons />}
          </div>
          <ul id="wd-assignment-list" className="list-group rounded-0">
            {courseAssignments.map((assignment: any) => (
              <li
                key={assignment._id}
                className="wd-assignment-list-item list-group-item d-flex justify-content-between align-items-center position-relative"
                style={{ borderLeft: "5px solid green", paddingLeft: "10px" }}
              >
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <GiNotebook className="me-2 fs-3" />
                  <div>
                    <a
                      className="wd-assignment-link"
                      href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                      style={{ color: "black", textDecoration: "none" }}
                    ><a
                    className="wd-assignment-link"
                    href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    {assignment.title ? assignment.title : "New Assignment"}
                  </a>
                    </a>
                    <br />
                    <span style={{ color: "red" }}>{assignment.title}</span> | <b>Not available until</b> May 6 at 12:00am |
                    <br />
                    <span>
                      <b>Due</b> May 13 at 11:59pm | 100 pts
                    </span>
                  </div>
                </div>

                {/* FACULTY 用户显示删除按钮 */}
                {isFaculty && (
                  <div className="ms-auto">
                    <BsTrash3Fill
                      className="text-danger me-2 mb-1"
                      data-bs-toggle="modal"
                      data-bs-target={`#deleteModal-${assignment._id}`}
                      style={{ fontSize: "1.1em" }}
                    />
                  </div>
                )}

                {/* FACULTY 用户显示编辑组件 */}
                {isFaculty && (
                  <Editing assignmentId={assignment._id} removeAssignment={() => removeAssignment(assignment._id)} />
                  
                )}

                <div className="d-flex align-items-center">
                  {/* FACULTY 用户显示控制按钮 */}
                  {isFaculty && <AssignmentsControlButtons />}
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
