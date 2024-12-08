import { useParams } from "react-router";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as client from "./client";
import { useEffect } from "react";
import { setQuizzes } from "./reducer";
export default function QuizDetails() {
  const { qid } = useParams();
  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  
  // 用户信息
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const userId = currentUser._id;
  const role = currentUser.role;

  const quiz = quizzes.find((quiz: any) => quiz._id === qid);
  const dispatch = useDispatch();
  const fetchQuizzes = async () => {
    try {
      const quizzes = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(quizzes));
    } catch (err) {
      console.log(err);
    }
  };

  
  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div>
      {quiz && (
        <div>
          <div className="d-flex  justify-content-end">
          <Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Preview`}>
              <button
                id="wd-add-assignment-group"
                style={{ backgroundColor: "#c7cdd1" }}
                className="btn btn-lg text-nowrap me-2"
              >
                Preview
              </button>
            </Link>

            
            <Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Editor`}>
            { role === "FACULTY" && (
              <button
                id="wd-add-assignment"
                style={{ backgroundColor: "#c7cdd1" }}
                className="btn btn-lg  text-nowrap me-2"
              >
                <FaPencilAlt className="me-2" />
                Edit
              </button>)}
            </Link>
          </div>
          <div id="wb-quiz-detail" className="container  mt-4">
            <div className="card">
              <div className="card-header">
                <h3> {quiz.title}</h3>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Quiz Type:</strong>
                  </div>
                  <div className="col-6">{quiz.quiz_type}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Points:</strong>
                  </div>
                  <div className="col-6">{quiz.points}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Assignment Group:</strong>
                  </div>
                  <div className="col-6">{quiz.assignment_group}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Shuffle Answers:</strong>
                  </div>
                  <div className="col-6">{quiz.shuffle_answers + ""}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Time Limit:</strong>
                  </div>
                  <div className="col-6">{quiz.time_limit} Minutes</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Multiple Attempts</strong>
                  </div>
                  <div className="col-6">{quiz.multiple_attempts + ""}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>View Responses:</strong>
                  </div>
                  <div className="col-6">Always</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Show Correct Answers:</strong>
                  </div>
                  <div className="col-6">{quiz.show_correct_answers}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>One Question at a Time:</strong>
                  </div>
                  <div className="col-6">
                    {quiz.one_question_at_a_time + ""}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Require Respondus LockDown Browser:</strong>
                  </div>
                  <div className="col-6">Yes</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Required to View Quiz Results:</strong>
                  </div>
                  <div className="col-6">No</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Webcam Required:</strong>
                  </div>
                  <div className="col-6">{quiz.webcam_required + ""}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 text-md-end">
                    <strong>Lock Questions After Answering:</strong>
                  </div>
                  <div className="col-6">
                    {quiz.lock_questions_after_answering + ""}
                  </div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Due</th>
                      <th>For</th>
                      <th>Available from</th>
                      <th>Until</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
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
                      </td>
                      <td>Everyone</td>
                      <td>
                        {new Date(quiz.available_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        at{" "}
                        {new Date(quiz.available_date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </td>
                      <td>
                        {new Date(quiz.until_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(quiz.until_date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}