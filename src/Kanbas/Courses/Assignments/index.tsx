import AssignmentsControls from "./AssignmentsControls";
import { BsGripVertical } from "react-icons/bs";
import AssignmentsControlButtons from "./AssignmentsControlButtons";
import AssignControlButtons from "./AssignControlButtons";
import { GiNotebook } from "react-icons/gi";
import { GoTriangleDown } from "react-icons/go";
import { useParams } from "react-router";
import './style.css';
import * as db from "../../Database";  

export default function Assignments() {
    const { cid } = useParams();  
    const assignments = db.assignments; 
    const courseAssignments = assignments.filter((assignment) => assignment.course === cid);
  
    return (
      <div id="wd-assignments">
        <AssignmentsControls /><br/><br /><br />
        <ul id="wd-assignments-title" className="list-group round-0 w-100">
          <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
            <div className="we-title p-3 ps-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f1f2f3'}}>
              <div>
                <BsGripVertical className="me-2 fs-3" /> <GoTriangleDown /> ASSIGNMENTS
              </div>
              <AssignControlButtons />
            </div>
  
            <ul id="wd-assignment-list" className="list-group rounded-0">
              {courseAssignments.map((assignment) => (
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
                  <div className="d-flex align-items-center">
                    <AssignmentsControlButtons />
                  </div>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    );
  }