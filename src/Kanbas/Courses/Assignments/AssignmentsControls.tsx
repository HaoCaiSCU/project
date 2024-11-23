import React from "react";
import { FaPlus } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { createAssignment } from "./client";
import { addAssignment } from "./reducer";

type AssignmentsControlsProps = {
  courseId: string;
};

export default function AssignmentsControls({ courseId }: AssignmentsControlsProps) {
  const dispatch = useDispatch();

  const handleAddAssignment = async () => {
    const newAssignment = {
      title: "New Assignment",
      availableFromDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后
      points: 100,
    };

    const createdAssignment = await createAssignment(courseId, newAssignment);

    dispatch(addAssignment(createdAssignment));
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="input-group me-3" style={{ width: "300px" }}>
        <div className="input-group-text bg-white border-end-0">
          <SlMagnifier />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="form-control border-start-0"
        />
      </div>

      <div className="d-flex">
        <button
          id="wd-add-assignment"
          className="btn btn-danger me-1"
          onClick={handleAddAssignment}
        >
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Assignment
        </button>
      </div>
    </div>
  );
}
