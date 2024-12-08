import { BsGripVertical } from "react-icons/bs";
import { IoMdMore } from "react-icons/io";
import { FaRocket } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { IoBan } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import {
  setQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as client from "./client";

export default function Quizzes() {
  const { cid } = useParams();
  const [, setError] = useState("");
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const [quiz] = useState({ points: 0, course: cid });
  const dispatch = useDispatch();
  const currentDate = new Date();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const role = currentUser.role;

  const createQuiz = async (quiz: any) => {
    try {
      const newQuiz = await client.createQuiz(cid as string, quiz);
      dispatch(addQuiz(newQuiz));
    } catch (err) {
      setError("Error creating quiz");
    }
  };

  const removeQuiz = async (quizId: string) => {
    try {
      await client.deleteQuiz(quizId);
      dispatch(deleteQuiz(quizId));
    } catch (err) {
      setError("Error deleting quiz");
    }
  };

  // const saveQuiz = async (quiz: any) => {
  //   try {
  //     await client.updateQuiz(quiz);
  //     dispatch(updateQuiz(quiz));
  //   } catch (err) {
  //     setError("Error updating quiz");
  //   }
  // };

  const handleTogglePublish = async (quiz: any) => {
    try {
      const updatedQuiz = { ...quiz, status: !quiz.status };
      await client.updateQuiz(updatedQuiz); // Use the existing updateQuiz method
      dispatch(updateQuiz(updatedQuiz)); // Update the state with the new quiz status
    } catch (err) {
      setError("Error updating quiz status");
    }
  };
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzes = await client.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
      } catch (err) {
        setError("Error fetching quizzes");
      }
    };
  
    fetchQuizzes();
  }, [cid, dispatch]);
  

  return (
    <div id="wd-quizzes">
      <div className="row mb-3 d-flex justify-content-between">
        <div className=" col-md-6">
          <div className="input-group">
            <input
              type="text"
              id="search-students"
              className="form-control"
              placeholder="Search..."
            />
          </div>
        </div>

        <div
          id="quiz-button-group"
          className="d-flex col-md-6 justify-content-end"
        >
          {role === "FACULTY" && (
            <button
              id="wd-add-assignment-group"
              className="btn btn-lg btn-danger text-nowrap me-1"
              onClick={() => {
                createQuiz(quiz);
              }}
            >
              + Quiz
            </button>
          )}

          <button
            id="wd-add-assignment"
            style={{ backgroundColor: "#c7cdd1" }}
            className="btn btn-lg  text-nowrap"
            //onClick={}
          >
            <IoMdMore className="fs-4" />
          </button>
        </div>
      </div>
      <ul id="wd-quizzes" className="list-group rounded-0">
        <li
          style={{ backgroundColor: "#c7cdd1" }}
          className="list-group-item wd-assignment-list-item d-flex align-items-center border fs-5 p-4"
        >
          <FaCaretDown className="me-3" />
          <b> Assignment Quizzes</b>
        </li>
        {quizzes.map((quiz: any, index: any) => (
          <li
            key={quiz._id}
            id={`wd-assignment-${index + 1}`}
            className="list-group-item wd-assignment-list-item d-flex align-items-center border"
          >
            <BsGripVertical className="me-1 fs-3 align-middle" />
            <FaRocket className={quiz.status ? "text-success me-3" : "me-3"} />

            <div>
              <a
                id={`wd-assignment-link-${index + 1}`}
                className="wd-assignment-link fw-bold text-black"
                href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/Details`}
              >
                {quiz.title}
              </a>
              <br />
              <span id={`wd-assignment-${index + 1}-details`}>
                {currentDate < new Date(quiz.available_date) ? (
                  <span>
                    <b>Not available until</b>{" "}
                    {new Date(quiz.available_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(quiz.available_date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                ) : currentDate < new Date(quiz.due_date) ? (
                  <span>Available</span>
                ) : (
                  <span>Closed</span>
                )}
                <span>
                  {" "}
                  | <b>Due </b>
                  {new Date(quiz.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(quiz.due_date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>{" "}
                | <span>{quiz.points} pts</span> |{" "}
                <span>{quiz.questions.length} Questions</span>
              </span>
            </div>
            <div className="ms-auto">
              {quiz.status ? (
                <GreenCheckmark />
              ) : (
                <IoBan className="fs-4 me-1" />
              )}
              {role === "FACULTY" && (
                <div className="dropdown d-inline me-1">
                  <IoMdMore
                    id="wd-quiz-menu-btn"
                    //className="btn btn-lg dropdown-toggle fs-4"
                    className="dropdown-toggle fs-4"
                    type="button"
                    data-bs-toggle="dropdown"
                  />
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        id="wd-edit-quiz-btn"
                        className="dropdown-item"
                        href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/Details`}
                        type="button"
                        // onClick={() => {
                        //   console.log("Edit quiz");
                        // }}
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        id="wd-delete-quiz-btn"
                        className="dropdown-item"
                        // href="#"
                        type="button"
                        onClick={() => {
                          removeQuiz(quiz._id);
                        }}
                      >
                        Delete
                      </a>
                    </li>
                    <li>
                      <a
                        id="wd-publish-quiz-btn"
                        className="dropdown-item"
                        //href="#"
                        type="button"
                        onClick={() => {
                          handleTogglePublish(quiz);
                        }}
                      >
                        {quiz.status ? "Unpublish" : "Publish"}
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}