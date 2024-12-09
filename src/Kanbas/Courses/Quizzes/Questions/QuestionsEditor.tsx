import QuestionForm from "./QuestionForm";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as client from "./clients";
import { updateQuizPoints } from "../client";
import { setQuestions, addQuestion, deleteQuestion, updateQuestion } from "./reducer";

import { Question } from "./reducer"; // 从 reducer 文件导出 Question 接口

export default function QuestionsEditor() {
  const { qid } = useParams();
  const dispatch = useDispatch();
  const questions = useSelector((state: any) => state.questionsReducer.questions) as Question[];
  const totalPoints = useSelector((state: any) => state.questionsReducer.totalPoints);

  const [deletedQuestions, setDeletedQuestions] = useState<Question[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

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

  // 处理新问题创建
  const handleNewQuestionClick = () => {
    setIsAddingQuestion(true);
    setEditingQuestion(null);
  };

  // 取消操作
  const handleCancel = () => {
    setIsAddingQuestion(false);
    setEditingQuestion(null);
  };

  // 保存单个问题
  const handleSave = (question: Partial<Question>) => {
    const updatedQuestion: Question = {
      ...question,
      _id: question._id || `temp-${Date.now()}`,
      title: question.title || "Untitled Question",
      points: question.points || 0,
      type: question.type || "multiple_choice",
      question: question.question || "",
      choices: question.choices || [],
      answer: question.answer || "",
      is_true: question.type === "true_false" ? question.is_true || false : undefined,
      possible_answers: question.type === "fill_in_blanks" ? question.possible_answers || [] : undefined,
    };

    if (editingQuestion) {
      dispatch(updateQuestion(updatedQuestion));
    } else {
      dispatch(addQuestion(updatedQuestion));
    }

    setIsAddingQuestion(false);
    setEditingQuestion(null);
  };

  // 编辑问题
  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsAddingQuestion(true);
  };

  // 删除问题
  const handleDelete = (questionId: string) => {
    const question = questions.find((q) => q._id === questionId);

    if (question?._id && !question._id.startsWith("temp-")) {
      setDeletedQuestions((prev) => [...prev, question]);
    }
    dispatch(deleteQuestion(questionId));
  };

  // 映射问题字段为后端支持的格式
  const formatQuestionForBackend = (question: Question) => {
    return {
      quiz_id: qid,
      type: question.type,
      title: question.title,
      points: question.points,
      question: question.question,
      possible_answers: question.type === "fill_in_blanks" ? question.possible_answers || [] : undefined,
      choices: question.type === "multiple_choice" ? question.choices || [] : undefined,
      is_true: question.type === "true_false" ? question.is_true : undefined,
    };
  };

  // 保存所有问题
  const handleSaveAll = async () => {
    try {
      await Promise.all(
          questions.map((question) => {
            const formattedQuestion = {
              quiz_id: qid,
              type: question.type, // 直接使用 question.type
              title: question.title,
              points: question.points,
              question: question.question,
              possible_answers: question.type === "fill_in_blanks" ? question.possible_answers || [] : undefined,
              choices: question.type === "multiple_choice" ? question.choices || [] : undefined,
              is_true: question.type === "true_false" ? question.is_true || false : undefined,
            };

            if (question._id && !question._id.startsWith("temp-")) {
              return client.updateQuestion(question._id, formattedQuestion);
            } else {
              return client.createQuestion(qid as string, formattedQuestion);
            }
          })
      );

      await Promise.allSettled(
          deletedQuestions.map((question) => client.deleteQuestion(question._id))
      );

      await updateQuizPoints(qid as string, totalPoints); // 更新总分
      alert("Questions Saved!");
    } catch (err) {
      console.error("Failed to save questions:", err);
    }
  };


  // 取消所有更改
  const handleCancelAll = async () => {
    try {
      const fetchedQuestions = await client.findQuestionsByQuizId(qid as string);
      dispatch(setQuestions(fetchedQuestions));
      setDeletedQuestions([]);
      alert("Changes Canceled!");
    } catch (err) {
      console.error("Failed to cancel changes:", err);
    }
  };

  return (
      <div>
        <ul id="wd-questions" className="list-group rounded-0">
          {questions.map((question) => (
              <li key={question._id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>{question.title}</div>
                  <div>
                    <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(question)}
                    >
                      Edit
                    </button>
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
            <QuestionForm question={editingQuestion} onCancel={handleCancel} onSave={handleSave} />
        ) : (
            <div className="d-flex justify-content-center mt-3">
              <button
                  onClick={handleNewQuestionClick}
                  className="btn btn-outline-secondary"
                  style={{ backgroundColor: "#f0f0f0", color: "#333" }}
              >
                + New Question
              </button>
            </div>
        )}
        <hr className="separator" />
        <div className="mt-3 float-center">
          <button
              className="btn btn-secondary me-2"
              onClick={handleCancelAll}
              style={{ backgroundColor: "#f0f0f0", color: "#333" }}
          >
            Cancel
          </button>
          <button
              className="btn btn-primary"
              onClick={handleSaveAll}
              style={{ color: "#fff", backgroundColor: "#dc3545", border: "1px solid #dc3545" }}
          >
            Save
          </button>
        </div>
      </div>
  );
}
