import { useParams, Link } from "react-router-dom";
import * as db from "../../Database"; // Importing the database
import { BsGripVertical } from "react-icons/bs";
import { GiNotebook } from "react-icons/gi";
import AssignmentsControlButtons from "./AssignmentsControlButtons";
import './style.css';

export default function Assignments() {
    const { cid } = useParams();


    const courseAssignments = db.assignments.filter(assignment => assignment.course === cid);

    return (
        <div id="wd-assignments">
            <h2 className="mb-4">Assignments for Course: {cid}</h2>
            <ul id="wd-assignments-title" className="list-group round-0 w-100">
                {courseAssignments.map((assignment) => (
                    <li key={assignment._id} className="wd-assignment-list-item list-group-item d-flex justify-content-between align-items-center position-relative assignment-item">
                        <div className="d-flex align-items-center">
                            <BsGripVertical className="me-2 fs-3" />
                            <GiNotebook className="me-2 fs-3 green-icon" />
                            <div>
                                <Link className="wd-assignment-link" to={`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}>
                                    <b>{assignment.title}</b>
                                </Link>
                                <br />
                                <span className="red-icon">Assignment ID: {assignment._id}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <AssignmentsControlButtons />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
