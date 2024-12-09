import { IoMdMore } from "react-icons/io";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoBan } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import QuizTextEditor from "./QuizTextEditor";
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


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzes = await client.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
        setEditQuiz(quiz);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchQuizzes();
  }, [cid, dispatch]);
  
  const handleSave = async () => {
    dispatch(updateQuiz(editQuiz));
    await client.updateQuiz(editQuiz);
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/Details`);
  };

  const handleSaveAndPublish = async () => {
    try {
      const updatedQuiz = { ...editQuiz, status: true };
      await client.updateQuiz(updatedQuiz); // Use the existing updateQuiz method
      dispatch(updateQuiz(updatedQuiz)); // Update the state with the new quiz status
      navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } catch (err) {
      console.log(err);
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
                            setEditQuiz({...editQuiz, title: e.target.value})
                        }
                        className="form-control border"
                        style={{borderColor: "#d51a2c"}}
                    />
                  </div>

                  {/* Quiz Instructions */}
                  <div className="mb-3">
                    <label htmlFor="quizInstructions" className="form-label">
                      Quiz Instructions
                    </label>
                    <textarea
                        id="quizInstructions"
                        defaultValue={editQuiz.quiz_instructions}
                        onChange={(e) => {
                          const target = e.target as unknown as HTMLInputElement;
                          console.log("Previous state:", editQuiz.shuffle_answers);
                          console.log("New value:", target.checked);
                          setEditQuiz({...editQuiz, quiz_instructions: e.target.value});
                        }}
                        className="form-control border"
                        style={{
                          borderColor: "#d51a2c",
                          minHeight: "200px",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "14px",
                        }}
                    />
                  </div>

                  {/* Points */}
                  <div className="mb-3">
                    <label htmlFor="quizTitle" className="form-label">
                      Points
                    </label>
                    <input
                        id="quizPoints"
                        defaultValue={editQuiz.points}
                        onChange={(e) =>
                            setEditQuiz({...editQuiz, points: e.target.value})
                        }
                        className="form-control border"
                        style={{borderColor: "#d51a2c"}}
                    />
                  </div>

                  {/* Type */}
                  <div className="mb-3">
                    <label htmlFor="quizType" className="form-label">
                      Quiz Type
                    </label>
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

                    {/* Assignment Group */}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="assignmentGroup" className="form-label">
                      Assignment Group
                    </label>
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

                  {/* Shuffle */}
                  <div className="form-check mb-3">
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
                    <label className="form-check-label" htmlFor="shuffleAnswers">
                      Shuffle Answers
                    </label>
                  </div>

                  {/* Time Limit */}
                  <div className="mb-3">
                    <label htmlFor="timeLimit" className="form-label">
                      Time Limit (minutes)
                    </label>
                    <input
                        id="timeLimit"
                        type="number"
                        value={editQuiz.time_limit}
                        onChange={(e) =>
                            setEditQuiz({...editQuiz, time_limit: e.target.value})
                        }
                        className="form-control"
                    />
                  </div>

                  {/* Multiple Attempts */}
                  <div className="form-check mb-3">
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
                    <label
                        className="form-check-label"
                        htmlFor="multipleAttempts"
                    >
                      Allow Multiple Attempts
                    </label>
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