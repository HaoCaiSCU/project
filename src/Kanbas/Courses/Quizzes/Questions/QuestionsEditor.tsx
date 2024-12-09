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


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await client.findQuestionsByQuizId(qid as string);
        dispatch(setQuestions(fetchedQuestions));
      } catch (err) {
        console.error("Failed to fetch questions: ", err);
      }
    };
  
    fetchQuestions();
  }, [qid, dispatch]);

  const handleDelete = (questionId: string) => {
    const question = questions.find((q: any) => q._id === questionId);

    if (question?._id) {
      // 如果问题已存在于数据库，移除它并加入 `deletedQuestions`
      dispatch(deleteQuestion(questionId));
      setDeletedQuestions((prev) => [...prev, question]);
    } else {
      // 如果问题是新添加的，仅从 Redux 状态中移除
      dispatch(deleteQuestion(questionId));
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
    const updatedQuestion = {
      ...question,
      _id: question._id || `temp-${Date.now()}`, // 如果没有 _id，则生成一个临时 ID
    };

    if (editingQuestion) {
      dispatch(updateQuestion(updatedQuestion)); // 更新 Redux 状态
    } else {
      dispatch(addQuestion(updatedQuestion)); // 添加到 Redux 状态
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
      // 保存新增和更新的问题
      await Promise.all(
          questions.map((question: any) => {
            if (question._id) {
              // 如果问题已有 `_id`，调用更新接口
              return client.updateQuestion(question._id, question);
            } else {
              // 如果问题是新添加的，调用创建接口
              return client.createQuestion(qid as string, question);
            }
          })
      );

      // 删除标记为删除的问题
      const deleteResults = await Promise.allSettled(
          deletedQuestions.map((question: any) =>
              client.deleteQuestion(question._id)
          )
      );

      // 记录删除失败的条目
      deleteResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
              `Failed to delete question: ${deletedQuestions[index]._id}`,
              result.reason
          );
        }
      });

      // 更新 Quiz 总分
      await updateQuizPoints(qid as string, totalPoints);

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
              <button onClick={handleNewQuestionClick}
                      className="btn btn-outline-secondary"
                      style={{backgroundColor: "#f0f0f0", color: "#333"}}>
                + New Question
              </button>
            </div>
        )}
        <hr className="separator"/>
        <div className="mt-3 float-center">
          <button className="btn btn-secondary me-2" onClick={handleCancelAll}
                  style={{backgroundColor: "#f0f0f0", color: "#333"}}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSaveAll}
                  style={{color: "#fff", backgroundColor: "#dc3545", border: "1px solid #dc3545"}}>
            Save
          </button>
        </div>
      </div>
  );
}