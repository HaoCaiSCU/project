import React from "react";
import { FaPlus } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";

type AssignmentsControlsProps = {
  onAddAssignmentClick?: () => void;
  cid?: string; 
};

export default function AssignmentsControls({ onAddAssignmentClick, cid }: AssignmentsControlsProps) {
  const navigate = useNavigate();
  const params = useParams();
  
  const courseId = cid || params.cid;


  const handleAddAssignment = () => {
    if (onAddAssignmentClick) {
      onAddAssignmentClick();
    } else if (courseId) {
      navigate(`/Kanbas/Courses/${courseId}/Assignments/AssignmentEditor`);
    } else {
      console.warn("No course ID provided");
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="input-group me-3" style={{ width: '300px' }}>
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
        <button id="wd-add-assignment-group" className="btn btn-outline-secondary me-1">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group
        </button>
        
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
