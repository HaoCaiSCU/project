export default function WarningWindow({
    assignmentId,
    removeAssignment,
  }: {
    assignmentId: string;
    removeAssignment: () => void;
  }) {
    return (
      <div
        id={`deleteModal-${assignmentId}`}
        className="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="deleteAssignmentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 
                className="modal-title fs-5" 
                id="deleteAssignmentModalLabel"
              >
                WARNING!!!
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            
            <div className="modal-body">
              DELETING CONFIRM
            </div>
            
            <div className="modal-footer">
              <button
                onClick={removeAssignment}
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Confirmed
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Cancle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  