import React, { useCallback, useEffect } from "react";
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
import './style.css';
import AssignmentsControlButtons from "./AssignmentsControlButtons";

export default function Assignments() {
  const { cid } = useParams();
  //const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchAssignments = useCallback(async () => {
    const assignments = await assignmentsClient.findAssignmentsForCourse(cid as string);
    dispatch(setAssignment(assignments));
  }, [cid, dispatch]);
  const removeAssignment = async (assignmentId: string) => {
    await assignmentsClient.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };
  

  const assignments = useSelector((state: any) => state.assignmentReducer.assignments);
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const courseAssignments = assignments.filter((assignment: any) => assignment.course === cid);
  const isFaculty = currentUser?.role === "FACULTY";


  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div id="wd-assignments">
      {/* Only show the AssignmentsControls component if the user is FACULTY */}
      {isFaculty && <AssignmentsControls courseId={cid as string} />}
      <br/><br /><br />
      <ul id="wd-assignments-title" className="list-group round-0 w-100">
        <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
          <div className="we-title p-3 ps-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f1f2f3' }}>
            <div>
              <BsGripVertical className="me-2 fs-3" /> <GoTriangleDown /> ASSIGNMENTS
            </div>
            {/* Only show control buttons if the user is FACULTY */}
            {isFaculty && <AssignControlButtons />}
          </div>
          <ul id="wd-assignment-list" className="list-group rounded-0">
            {courseAssignments.map((assignment: any) => (
              <li key={assignment._id} className="wd-assignment-list-item list-group-item d-flex justify-content-between align-items-center position-relative" style={{ borderLeft: '5px solid green', paddingLeft: '10px' }}>
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <GiNotebook className="me-2 fs-3" />
                  <div>
                    <a className="wd-assignment-link" href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`} style={{ color: 'black', textDecoration: 'none' }}>
                      {assignment._id}
                    </a>
                    <br />
                    <span style={{ color: 'red' }}>{assignment.title}</span> | <b>Not available until</b> May 6 at 12:00am |
                    <br />
                    <span><b>Due</b> May 13 at 11:59pm | 100 pts</span>
                  </div>
                </div>
                
                {/* Only show delete button if the user is FACULTY */}
                {isFaculty && (
                  <div className="ms-auto">
                    <BsTrash3Fill
                      className="text-danger me-2 mb-1"
                      data-bs-toggle="modal"
                      data-bs-target={`#deleteModal-${assignment._id}`}
                      style={{ fontSize: '1.1em' }}
                    />
                  </div>
                )}

                {/* Only show the Editing component if the user is FACULTY */}
                {isFaculty && (
                  <Editing
                    assignmentId={assignment._id}
                    removeAssignment={() => removeAssignment(assignment._id)}
                  />
                )}

                <div className="d-flex align-items-center">
                  {/* Only show control buttons if the user is FACULTY */}
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
