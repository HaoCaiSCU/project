import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import { FaRegCalendarAlt } from "react-icons/fa";
import * as assignmentsClient from "./client";


export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const assignments = useSelector((state: any) => state.assignmentReducer.assignments);
    const isEdit = assignments.findIndex((a: any) => a._id === aid) !== -1;

    const initialAssignment = assignments.find((a: any) => a._id === aid) || {
        _id: aid,
        title: "New Assignment",
        description: "New Description",
        points: 100,
        course: cid,
        dueDate: "2024-05-13",
        availableFromDate: "2024-05-06",
        availableUntilDate: "2024-05-15",
    };

    const createAssignment = async (assignment: any) => {
        try {
          const newAssignment = await assignmentsClient.createAssignment(
            cid as string,
            assignment
          );
          dispatch(addAssignment(newAssignment));
        } catch (error) {
          console.error("Failed to create assignment:", error);
        }
      };
      
      const saveAssignment = async (assignment: any) => {
        try {
          await assignmentsClient.updateAssignment(assignment._id, assignment); 
          dispatch(updateAssignment(assignment));
        } catch (error) {
          console.error("Failed to save assignment:", error);
        }
      };
      
      

    const [editedAssignment, setEditedAssignment] = useState(initialAssignment);

    const handleSave = async () => {
        if (!editedAssignment.title) {
          console.error("Assignment title is required!");
          return;
        }
      
        try {
          if (isEdit) {
            await saveAssignment(editedAssignment); // 更新现有作业
          } else {
            await createAssignment(editedAssignment); // 创建新作业
          }
          navigate(`/Kanbas/Courses/${cid}/Assignments`);
        } catch (error) {
          console.error("Failed to save assignment:", error);
        }
      };
      
      

    const handleCancel = () => {
        navigate(`/Kanbas/Courses/${cid}/Assignments`);
    };

    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name"><b>Assignment Name</b></label><br /><br />
            <input
                id="wd-name"
                className="form-control"
                value={editedAssignment.title}
                onChange={(e) => setEditedAssignment({ ...editedAssignment, title: e.target.value })}
            /><br /><br />

        
                <textarea
                    id="wd-description"
                    className="form-control"
                    cols={45}
                    rows={9}
                    value={assignments.description || 'N/P'}
                    onChange={(e) => setEditedAssignment({ ...editedAssignment, description: e.target.value })}
                />
                <br /><br />

                <table>
                    <tr>
                        <td align="right" valign="top">
                            <label htmlFor="wd-points">Points</label>
                        </td>
                        <td className="ps-3">
                            <input
                                id="wd-points"
                                className="form-control"
                                value={assignments.points || 100}
                                onChange={(e) => setEditedAssignment({ ...editedAssignment, points: Number(e.target.value) })}
                            />
                        </td>
                    </tr>
                    <br />

                    <tr>
                        <td align="right" valign="top">
                            <label htmlFor="wd-group">Assignment Group</label>
                        </td>
                        <td className="ps-3">
                            <select
                                id="wd-group"
                                className="form-select"
                                value={editedAssignment.group || "ASSIGNMENTS"}
                                onChange={(e) => setEditedAssignment({ ...editedAssignment, group: e.target.value })}>
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
                                        <input id="wd-due-date" type="text" className="form-control" value="May 13, 2024, 11:59 PM" onChange={(e) => setEditedAssignment({ ...editedAssignment, dueDate: e.target.value })} />
                                        <span className="input-group-text">
                                            <FaRegCalendarAlt />
                                        </span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="wd-available-from" className="form-label"><b>Available from</b></label>
                                        <div className="input-group">
                                            <input id="wd-available-from" type="text" className="form-control" value="May 6, 2024, 12:00 PM" onChange={(e) => setEditedAssignment({ ...editedAssignment, availableFromDate: e.target.value })} />
                                            <span className="input-group-text">
                                                <FaRegCalendarAlt />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="wd-available-until" className="form-label"><b>Until</b></label>
                                        <div className="input-group">
                                            <input id="wd-available-until" type="text" className="form-control" value="May 20, 2024, 12:00 PM" onChange={(e) => setEditedAssignment({ ...editedAssignment, availableUntilDate: e.target.value })} />
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
                <div className="mt-3 float-end">
                    <button className="btn btn-secondary me-2" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>

            </div>
        
    );
}
