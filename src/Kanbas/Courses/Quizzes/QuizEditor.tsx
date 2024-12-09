import { IoMdMore } from "react-icons/io";
import { useParams } from "react-router";
import {useState, useEffect, useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoBan } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import {
  setQuizzes,
  updateQuiz,
} from "./reducer";
import QuestionsEditor from "./Questions/QuestionsEditor";

export default function QuizEditor() {
  const { qid } = useParams();
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((quiz: any) => quiz._id === qid);
  const [editQuiz, setEditQuiz] = useState(quiz);
  const [detailsTabActive, setDetailsTabActive] = useState(true);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzes = await client.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
        if (!editQuiz) {
          const quiz = quizzes.find((q: any) => q._id === qid);
          setEditQuiz(quiz);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuizzes();
  }, [cid, dispatch, qid, editQuiz]);

  useEffect(() => {
    if (editorRef.current || !editQuiz) return; // Prevent multiple initializations or if editQuiz is undefined

    const quill = new Quill("#quizInstructionsEditor", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    editorRef.current = quill;

    // Load existing instructions into the editor
    quill.clipboard.dangerouslyPasteHTML(editQuiz.quiz_instructions || "");

    // Update state on text change
    quill.on("text-change", () => {
      setEditQuiz({
        ...editQuiz,
        quiz_instructions: quill.root.innerHTML, // Extract HTML content
      });
    });
  }, [editQuiz]);

  const handleSave = async () => {
    dispatch(updateQuiz(editQuiz));
    await client.updateQuiz(editQuiz);
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/Details`);
  };

  const handleSaveAndPublish = async () => {
    try {
      const updatedQuiz = { ...editQuiz, status: true };
      await client.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
      navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  const totalPoints = useSelector((state: any) => state.questionsReducer.totalPoints);

  return (
      <div>
        {editQuiz && (
            <div className="container">
              <div className="d-flex gap-3 justify-content-end align-items-center">
            <span>
              <b>Points:</b> {totalPoints}
            </span>
                {quiz?.status ? (
                    <span>
                <FaCheckCircle color="green" className="me-3" />
                Published
              </span>
                ) : (
                    <span>
                <IoBan color="gray" className="me-3" />
                Not Published
              </span>
                )}
                <button className="btn btn-light">
                  <IoMdMore color="gray" />
                </button>
              </div>

              <nav className="nav nav-tabs mt-3">
                <Link
                    className={`nav-link ${detailsTabActive ? "active" : ""}`}
                    to={""}
                    style={{ color: detailsTabActive ? "black" : "#d51a2c" }}
                    onClick={() => setDetailsTabActive(true)}
                >
                  Details
                </Link>
                <Link
                    className={`nav-link ${!detailsTabActive ? "active" : ""}`}
                    to={""}
                    style={{ color: !detailsTabActive ? "black" : "#d51a2c" }}
                    onClick={() => setDetailsTabActive(false)}
                >
                  Questions
                </Link>
              </nav>

              <div className="container mt-3">
                {detailsTabActive ? (
                    <div>
                      {/* Title */}
                      <div className="mb-3">
                        <label htmlFor="quizTitle" className="form-label">
                          Title
                        </label>
                        <input
                            id="quizTitle"
                            defaultValue={editQuiz.title}
                            onChange={(e) =>
                                setEditQuiz({ ...editQuiz, title: e.target.value })
                            }
                            className="form-control border"
                            style={{ borderColor: "#d51a2c" }}
                        />
                      </div>

                      {/* Quiz Instructions */}
                      <div className="mb-3">
                        <label htmlFor="quizInstructionsEditor" className="form-label">
                          Quiz Instructions
                        </label>
                        <div
                            id="quizInstructionsEditor"
                            style={{
                              border: "1px solid #d51a2c",
                              borderRadius: "5px",
                              minHeight: "200px",
                              fontFamily: "Arial, sans-serif",
                              fontSize: "14px",
                            }}
                        ></div>
                      </div>

                  {/* Points */}
                  <div className="row mb-3">
                    <div className="col-md-3 text-end">
                      <label htmlFor="quizPoints">Points</label>
                    </div>
                    <div className="col-md-9">
                      <input
                          id="quizPoints"
                          type="number" /* 确保输入为数字 */
                          defaultValue={editQuiz.points}
                          onChange={(e) =>
                              setEditQuiz({ ...editQuiz, points: e.target.value })
                          }
                          className="form-control"
                          style={{ borderColor: "#d51a2c" }}
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="row mb-3">
                    <div className="col-md-3 text-end">
                      <label htmlFor="quizType" className="form-label">
                        Quiz Type
                      </label>
                    </div>
                    <div className="col-md-9">
                      <select
                          id="quizType"
                          defaultValue={editQuiz.quiz_type}
                          onChange={(e) =>
                              setEditQuiz({...editQuiz, quiz_type: e.target.value})
                          }
                          className="form-select"
                      >
                        <option value="Graded Quiz">Graded Quiz</option>
                        <option value="Practice Quiz">Practice Quiz</option>
                        <option value="Graded Survey">Graded Survey</option>
                        <option value="Ungraded Survey">Ungraded Survey</option>
                      </select>
                    </div>
                  </div>

                  {/* Assignment Group */}
                  <div className="row mb-3">
                    <div className="col-md-3 text-end">
                      <label htmlFor="assignmentGroup" className="form-label">
                        Assignment Group
                      </label>
                    </div>
                    <div className="col-md-9">
                      <select
                          id="assignmentGroup"
                          defaultValue={editQuiz.assignment_group}
                          onChange={(e) =>
                              setEditQuiz({
                                ...editQuiz,
                                assignment_group: e.target.value,
                              })
                          }
                          className="form-select"
                      >
                        <option value="Quizzes">Quizzes</option>
                        <option value="Exams">Exams</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Project">Project</option>
                      </select>
                    </div>
                  </div>

                  {/* Options Title */}
                  <div className="row mb-3">
                    <div className="col-md-3 text-end">
                    </div>
                    <div className="col-md-9">
                      <span style={{ fontWeight: "bold", color: "black" }}>Options</span>
                    </div>
                  </div>

                  {/* Shuffle Answers */}
                  <div className="row mb-3 align-items-center">
                    <div className="col-md-3 text-end">
                      <input
                          id="shuffleAnswers"
                          type="checkbox"
                          checked={editQuiz.shuffle_answers}
                          onChange={(e) =>
                              setEditQuiz({
                                ...editQuiz,
                                shuffle_answers: e.target.checked,
                              })
                          }
                          className="form-check-input"
                      />
                    </div>
                    <div className="col-md-9">
                      <label
                          className="form-check-label"
                          htmlFor="shuffleAnswers"
                      >
                        Shuffle Answers
                      </label>
                    </div>
                  </div>

                  {/* Time Limit */}
                  <div className="row mb-3 align-items-center">
                    <div className="col-md-3 text-end">
                      <input
                          id="timeLimitEnabled"
                          type="checkbox"
                          checked={editQuiz.time_limit_enabled}
                          onChange={(e) =>
                              setEditQuiz({
                                ...editQuiz,
                                time_limit_enabled: e.target.checked,
                              })
                          }
                          className="form-check-input"
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="row align-items-center">
                        <div className="col-auto"> {/* Time Limit 字段缩短宽度 */}
                          <label
                              className="form-label mb-0"
                              htmlFor="timeLimit"
                              style={{ marginRight: "5px" }} /* 减少与后面输入框的间距 */
                          >
                            Time Limit
                          </label>
                        </div>
                        <div className="col-auto">
                          <input
                              id="timeLimit"
                              type="number"
                              value={editQuiz.time_limit}
                              onChange={(e) =>
                                  setEditQuiz({ ...editQuiz, time_limit: e.target.value })
                              }
                              className="form-control"
                              style={{ width: "80px" }}
                          />
                        </div>
                        <div className="col-auto"> {/* Minutes 字段紧贴输入框 */}
                          <span style={{ marginLeft: "0px" }}>Minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Allow Multiple Attempts */}
                  <div
                      className="row mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "10px",
                        backgroundColor: "#fff",
                        marginLeft: "calc(11rem)",
                        marginRight: "calc(0.1rem)",
                      }}
                  >
                    <div className="col-md-1 text-end">
                      <input
                          id="multipleAttempts"
                          type="checkbox"
                          checked={editQuiz.multiple_attempts}
                          onChange={(e) =>
                              setEditQuiz({
                                ...editQuiz,
                                multiple_attempts: e.target.checked,
                              })
                          }
                          className="form-check-input"
                      />
                    </div>
                    <div className="col-md-9">
                      <label
                          className="form-check-label"
                          htmlFor="multipleAttempts"
                      >
                        Allow Multiple Attempts
                      </label>
                    </div>
                  </div>


                  <div className="row mb-3">
                    {/* Assign */}
                    <div className="col-md-3 text-end">
                      <label htmlFor="assignInput">Assign</label>
                    </div>
                    <div className="col-md-9">
                      <div className="border p-3">
                        <div className="mb-3">
                          <label htmlFor="assignInput">Assign to</label>
                          <input id="wd-assign-to" className="form-control" value="Everyone"/>
                        </div>

                        {/* Due */}
                        <div className="mb-3">
                          <label htmlFor="dueDate">Due</label>
                          <input
                              id="dueDate"
                              type="datetime-local"
                              defaultValue={new Date(editQuiz.due_date)
                                  .toISOString()
                                  .slice(0, 16)}
                              onChange={(e) =>
                                  setEditQuiz({...editQuiz, due_date: e.target.value})
                              }
                              className="form-control"
                          />
                        </div>

                        {/* Available from and Until */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label htmlFor="availableDate">Available from</label>
                            <input
                                id="availableDate"
                                type="datetime-local"
                                defaultValue={new Date(editQuiz.available_date)
                                    .toISOString()
                                    .slice(0, 16)}
                                onChange={(e) =>
                                    setEditQuiz({
                                      ...editQuiz,
                                      available_date: e.target.value,
                                    })
                                }
                                className="form-control"
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="untilDate">Until</label>
                            <input
                                id="untilDate"
                                type="datetime-local"
                                defaultValue={new Date(editQuiz.until_date)
                                    .toISOString()
                                    .slice(0, 16)}
                                onChange={(e) =>
                                    setEditQuiz({...editQuiz, until_date: e.target.value})
                                }
                                className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleSaveAndPublish}
                    >
                      Save and Publish
                    </button>
                  </div>
                </div>
            ) : (
                <div>
                  <QuestionsEditor/>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}