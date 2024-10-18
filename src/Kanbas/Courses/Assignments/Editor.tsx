import { FaRegCalendarAlt } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as db from "../../Database";


export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const [assignment, setAssignment] = useState<Assignment | null>(null);

    useEffect(() => {
        const foundAssignment = db.assignments.find(a => a._id === aid) || null;
        setAssignment(foundAssignment);
    }, [aid]);

    if (!assignment) {
        return <div>Assignment not found or loading...</div>;
    }

    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name"><b>Assignment Name</b></label><br /><br />
            <input
                id="wd-name"
                value={assignment.title} 
                className="form-control"
                readOnly
            /><br /><br />

            <textarea
                id="wd-description"
                className="form-control"
                cols={45}
                rows={9}
                value={assignment.description || 'N/P'} 
                readOnly
            ></textarea><br /><br />

            <table>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td className="ps-3">
                        <input
                            id="wd-points"
                            className="form-control"
                            value={assignment.points || 100}
                            readOnly
                        />
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td className="ps-3">
                        <select id="wd-group" className="form-select" defaultValue="ASSIGNMENTS">
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="PROJECT">PROJECT</option>
                            <option value="EXAM">EXAM</option>
                        </select>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-display-grade-as">Display Grade as</label>
                    </td>
                    <td className="ps-3">
                        <select id="wd-display-grade-as" className="form-select" defaultValue="Percentage">
                            <option value="Percentage">Percentage</option>
                            <option value="Letter Grades">Letter Grades</option>
                            <option value="GPA">GPA</option>
                        </select>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td className="ps-3">
                        <div className="border p-3">
                            <select id="wd-submission-type" className="form-select mb-3" defaultValue="Online">
                                <option value="Online">Online</option>
                                <option value="In Class">In Class</option>
                            </select>

                            <label><b>Online Entry Options</b></label>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="wd-text-entry" />
                                <label className="form-check-label" htmlFor="wd-text-entry">Text Entry</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="wd-website-url" defaultChecked />
                                <label className="form-check-label" htmlFor="wd-website-url">Website URL</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="wd-media-recordings" />
                                <label className="form-check-label" htmlFor="wd-media-recordings">Media Recordings</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="wd-student-annotation" />
                                <label className="form-check-label" htmlFor="wd-student-annotation">Student Annotation</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="wd-file-upload" />
                                <label className="form-check-label" htmlFor="wd-file-upload">File Uploads</label>
                            </div>
                        </div>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-assign-to" className="form-label">Assign to</label>
                    </td>
                    <td className="ps-3">
                        <div className="border p-3">
                            <div className="mb-3">
                                <label htmlFor="wd-assign-to"><b>Assign to</b></label>
                                <div className="form-control d-flex align-items-center" style={{ height: "auto" }}>
                                    <span className="badge bg-light text-dark px-3 py-2">Everyone
                                        <button type="button" className="btn-close ms-2" aria-label="Close"></button>
                                    </span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="wd-due-date" className="form-label"><b>Due</b></label>
                                <div className="input-group">
                                    <input id="wd-due-date" type="text" className="form-control" value="May 13, 2024, 11:59 PM" readOnly />
                                    <span className="input-group-text">
                                        <FaRegCalendarAlt />
                                    </span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="wd-available-from" className="form-label"><b>Available from</b></label>
                                    <div className="input-group">
                                        <input id="wd-available-from" type="text" className="form-control" value="May 6, 2024, 12:00 PM" readOnly />
                                        <span className="input-group-text">
                                            <FaRegCalendarAlt />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="wd-available-until" className="form-label"><b>Until</b></label>
                                    <div className="input-group">
                                        <input id="wd-available-until" type="text" className="form-control" value="May 20, 2024, 12:00 PM" readOnly />
                                        <span className="input-group-text">
                                            <FaRegCalendarAlt />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

            <hr />
            <div className="d-flex justify-content-end mt-3">
                <Link to={`/Kanbas/Courses/${cid}/Assignments`} className="btn btn-secondary me-2">Cancel</Link>
                <Link to={`/Kanbas/Courses/${cid}/Assignments`} className="btn btn-danger">Save</Link>
            </div>
        </div>
    );
    interface Assignment {
        _id: string;
        title: string;
        course: string;
        points?: number;
        description?: string;
    }

}

