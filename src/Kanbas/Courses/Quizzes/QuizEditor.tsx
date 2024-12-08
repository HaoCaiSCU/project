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
  // const fetchQuizzes = async () => {
  //   try {
  //     const quizzes = await client.findQuizzesForCourse(cid as string);
  //     dispatch(setQuizzes(quizzes));
  //     setEditQuiz(quiz);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzes = await client.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
        setEditQuiz(quiz);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchQuizzes();
  }, [cid, dispatch, quiz]);
  
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
  
  // useEffect(() => {
  //   fetchQuizzes();
  // }, []);


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
                <div className="mb-3">
                  <label htmlFor="quizTitle" className="form-label">
                    Title
                  </label>
                  <input
                    id="quizTitle"
                    value={editQuiz.title}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, title: e.target.value })
                    }
                    className="form-control border"
                    style={{ borderColor: "#d51a2c" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="quizInstructions" className="form-label">
                    Quiz Instructions
                  </label>
                  <QuizTextEditor
                    value={editQuiz.quiz_instructions}
                    setValue={(e) =>
                      setEditQuiz({ ...editQuiz, quiz_instructions: e })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="quizTitle" className="form-label">
                    Points
                  </label>
                  <input
                    id="quizPoints"
                    value={editQuiz.points}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, points: e.target.value })
                    }
                    className="form-control border"
                    style={{ borderColor: "#d51a2c" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="quizType" className="form-label">
                    Quiz Type
                  </label>
                  <select
                    id="quizType"
                    value={editQuiz.quiz_type}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, quiz_type: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="Graded Quiz">Graded Quiz</option>
                    <option value="Practice Quiz">Practice Quiz</option>
                    <option value="Graded Survey">Graded Survey</option>
                    <option value="Ungraded Survey">Ungraded Survey</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="assignmentGroup" className="form-label">
                    Assignment Group
                  </label>
                  <select
                    id="assignmentGroup"
                    value={editQuiz.assignment_group}
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
                <div className="mb-3">
                  <label htmlFor="timeLimit" className="form-label">
                    Time Limit (minutes)
                  </label>
                  <input
                    id="timeLimit"
                    type="number"
                    value={editQuiz.time_limit}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, time_limit: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
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
                <div className="form-check mb-3">
                  <input
                    id="showCorrectAnswers"
                    type="checkbox"
                    checked={editQuiz.show_correct_answers}
                    onChange={(e) =>
                      setEditQuiz({
                        ...editQuiz,
                        show_correct_answers: e.target.checked,
                      })
                    }
                    className="form-check-input"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="showCorrectAnswers"
                  >
                    Show Correct Answers
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="accessCode" className="form-label">
                    Access Code
                  </label>
                  <input
                    id="accessCode"
                    type="text"
                    value={editQuiz.access_code}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, access_code: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="form-check mb-3">
                  <input
                    id="oneQuestionAtATime"
                    type="checkbox"
                    checked={editQuiz.one_question_at_a_time}
                    onChange={(e) =>
                      setEditQuiz({
                        ...editQuiz,
                        one_question_at_a_time: e.target.checked,
                      })
                    }
                    className="form-check-input"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="oneQuestionAtATime"
                  >
                    One Question at a Time
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    id="webcamRequired"
                    type="checkbox"
                    checked={editQuiz.webcam_required}
                    onChange={(e) =>
                      setEditQuiz({
                        ...editQuiz,
                        webcam_required: e.target.checked,
                      })
                    }
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="webcamRequired">
                    Webcam Required
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    id="lockQuestionsAfterAnswering"
                    type="checkbox"
                    checked={editQuiz.lock_questions_after_answering}
                    onChange={(e) =>
                      setEditQuiz({
                        ...editQuiz,
                        lock_questions_after_answering: e.target.checked,
                      })
                    }
                    className="form-check-input"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="lockQuestionsAfterAnswering"
                  >
                    Lock Questions After Answering
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="assignInput" className="form-label">
                    Assign
                  </label>
                  <div className="d-flex align-items-center border rounded p-2">
                    <div
                      style={{ backgroundColor: "#c7cdd1" }}
                      className="ps-2  me-2"
                    >
                      Everyone
                      <button
                        type="button"
                        className="btn-close ms-2"
                        aria-label="Close"
                      ></button>
                    </div>
                    <input
                      id="assignInput"
                      type="text"
                      className="border-0 flex-grow-1"
                      placeholder=""
                      disabled
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">
                    Due
                  </label>
                  <input
                    id="dueDate"
                    type="datetime-local"
                    value={new Date(editQuiz.due_date)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, due_date: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="row ">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="availableDate" className="form-label">
                      Available from
                    </label>
                    <input
                      id="availableDate"
                      type="datetime-local"
                      value={new Date(editQuiz.available_date)
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
                  <div className="mb-3 col-md-6">
                    <label htmlFor="untilDate" className="form-label">
                      Until
                    </label>
                    <input
                      id="untilDate"
                      type="datetime-local"
                      value={new Date(editQuiz.until_date)
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        setEditQuiz({ ...editQuiz, until_date: e.target.value })
                      }
                      className="form-control"
                    />
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
                <QuestionsEditor />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}