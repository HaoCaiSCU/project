import AssignmentsControls from "./AssignmentsControls";
import { BsGripVertical } from "react-icons/bs";
import AssignmentsControlButtons from "./AssignmentsControlButtons";
import AssignControlButtons from "./AssignControlButtons";
import { GiNotebook } from "react-icons/gi";
import { GoTriangleDown } from "react-icons/go";
import './style.css';

export default function Assignments() {
    return (
        <div id="wd-assignments">
            <AssignmentsControls /><br /><br /><br />
            <ul id="wd-assignments-title" className="list-group round-0 w-100">
                <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
                    <div className="we-title p-3 ps-2 d-flex justify-content-between align-items-center title-background">
                        <div>
                            <BsGripVertical className="me-2 fs-3" /> <GoTriangleDown /> ASSIGNMENTS
                        </div>
                        <AssignControlButtons />
                    </div>

                    <ul id="wd-assignment-list" className="list-group rounded-0">

                        <li className="wd-assignment-list-item list-group-item d-flex justify-content-between align-items-center position-relative assignment-item">
                            <div className="d-flex align-items-center">
                                <BsGripVertical className="me-2 fs-3" />
                                <GiNotebook className="me-2 fs-3 green-icon" />
                                <div>
                                    <a className="wd-assignment-link" href="#/Kanbas/Courses/1234/Assignments/123"><b>A1</b></a>
                                    <br />
                                    <span className="red-icon">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am |
                                    <br />
                                    <span><b>Due</b> May 13 at 11:59pm | 100 pts</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <AssignmentsControlButtons />
                            </div>
                        </li>

                        <li className="wd-assignment-list-item list-group-item d-flex justify-content-between align-items-center position-relative assignment-item">
                            <div className="d-flex align-items-center">
                                <BsGripVertical className="me-2 fs-3" />
                                <GiNotebook className="me-2 fs-3 green-icon" />
                                <div>
                                    <a className="wd-assignment-link" href="#/Kanbas/Courses/1234/Assignments/123"><b>A2</b></a>
                                    <br />
                                    <span className="red-icon">Multiple Modules</span> | <b>Not available until</b> May 13 at 12:00am |
                                    <br />
                                    <span><b>Due</b> May 20 at 11:59pm | 100 pts</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <AssignmentsControlButtons />
                            </div>
                        </li>

                        <li className="wd-assignment-list-item list-group-item d-flex justify-content-between align-items-center position-relative assignment-item">
                            <div className="d-flex align-items-center">
                                <BsGripVertical className="me-2 fs-3" />
                                <GiNotebook className="me-2 fs-3 green-icon" />
                                <div>
                                    <a className="wd-assignment-link" href="#/Kanbas/Courses/1234/Assignments/123"><b>A3</b></a>
                                    <br />
                                    <span className="red-icon">Multiple Modules</span> | <b>Not available until</b> May 20 at 12:00am |
                                    <br />
                                    <span><b>Due</b> May 27 at 11:59pm | 100 pts</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <AssignmentsControlButtons />
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}
