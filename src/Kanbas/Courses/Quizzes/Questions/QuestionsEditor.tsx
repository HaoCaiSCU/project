import QuestionForm from "./QuestionForm";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as client from "./clients";
import { updateQuizPoints } from "../client";
import { setQuestions, addQuestion, deleteQuestion, updateQuestion } from "./reducer";

export default function QuestionsEditor() {
  const { qid } = useParams();
  const dispatch = useDispatch();
  const questions = useSelector((state: any) => state.questionsReducer.questions);
  const totalPoints = useSelector((state: any) => state.questionsReducer.totalPoints);

  const [deletedQuestions, setDeletedQuestions] = useState<any[]>([]); // 用于保存已删除的问题，以便保存时删除数据库中的问题
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const fetchQuestions = async () => {
    try {
      const questions = await client.findQuestionsByQuizId(qid as string);
      dispatch(setQuestions(questions));
    } catch (err) {
      console.error("Failed to fetch questions: ", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [qid]);

  const handleDelete = (questionId: string) => {
    const question = questions.find((q: any) => q._id === questionId);
    if (question._id) {
      dispatch(deleteQuestion(question._id)); // 更新全局状态
      setDeletedQuestions([...deletedQuestions, question]); // 保存已删除的问题
    }
  };

  const handleNewQuestionClick = () => {
    setIsAddingQuestion(true);
    setEditingQuestion(null);
  };

  const handleCancel = () => {
    setIsAddingQuestion(false);
    setEditingQuestion(null);
  };

  const handleSave = (question: any) => {
    if (editingQuestion) {
      dispatch(updateQuestion(question)); // 更新全局状态
    } else {
      dispatch(addQuestion(question)); // 更新全局状态
    }
    setIsAddingQuestion(false);
    setEditingQuestion(null);
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    setIsAddingQuestion(true);
  };

  const handleSaveAll = async () => {
    try {
      // 保存全局状态的所有问题到数据库，对于已删除的问题同步删除
      await Promise.all(questions.map((question:any) => {
        if (question._id) {
          return client.updateQuestion(question._id, question);
        } else {
          return client.createQuestion(qid as string, question);
        }
      })); 
      await Promise.all(deletedQuestions.map((question: any) => {
        return client.deleteQuestion(question._id);
      }));
      await updateQuizPoints(qid as string, totalPoints); // 更新数据库中测验的总分
      alert("Questions Saved!");
    } catch (err) {
      console.error("Failed to save questions: ", err);
    }
  };

  const handleCancelAll = async () => {
    // 得到数据库中的问题列表
    const questions = await client.findQuestionsByQuizId(qid as string);
    // 用数据库状态覆盖全局状态
    dispatch(setQuestions(questions));
    setDeletedQuestions([]); // 清空已删除的问题
    // navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    alert("Changes Canceled!");
  };

  return (
    <div>
      <ul id="wd-questions" className="list-group rounded-0">
        {questions.map((question: any) => (
          <li key={question._id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>{question.title}</div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(question)}>Edit</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(question._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isAddingQuestion ? (
        <QuestionForm
          question={editingQuestion}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      ) : (
        <div className="d-flex justify-content-center mt-3">
          <button onClick={handleNewQuestionClick} className="btn btn-primary">
            + New Question
          </button>
        </div>
      )}
      <div className="mt-3 float-end">
        <button className="btn btn-secondary me-2" onClick={handleCancelAll}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSaveAll}>
          Save
        </button>
      </div>
    </div>
  );
}