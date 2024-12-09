import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaPencilAlt } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import "./QuestionForm.css";

interface Choice {
  answer: string;
  correct: boolean;
}

const QuestionForm = ({
                        question,
                        onCancel,
                        onSave,
                      }: {
  question: any;
  onCancel: () => void;
  onSave: (question: any) => void;
}) => {
  const [type, setType] = useState<string>(
      question ? question.type : "multiple_choice"
  );
  const [title, setTitle] = useState<string>(question ? question.title : "");
  const [points, setPoints] = useState<number>(question ? question.points : 0);
  const [questionText, setQuestionText] = useState<string>(
      question ? question.question : ""
  );
  const [choices, setChoices] = useState<Choice[]>(
      question?.choices || [
        { answer: "Answer 1", correct: false },
        { answer: "Answer 2", correct: false },
        { answer: "Answer 3", correct: true },
        { answer: "Answer 4", correct: false },
      ]
  );
  const [answer, setAnswer] = useState<string>(question?.answer || "");

  useEffect(() => {
    if (question) {
      setType(question.type);
      setTitle(question.title);
      setPoints(question.points);
      setQuestionText(question.question);
      setChoices(
          question.choices || [
            { answer: "Answer 1", correct: false },
            { answer: "Answer 2", correct: false },
            { answer: "Answer 3", correct: true },
            { answer: "Answer 4", correct: false },
          ]
      );
      setAnswer(question.answer || "");
    }
  }, [question]);

  const handleSave = () => {
    const updatedQuestion = {
      ...question,
      type,
      title,
      points,
      question: questionText,
      choices: type === "multiple_choice" ? choices : undefined,
      answer: type !== "multiple_choice" ? answer : undefined,
    };
    onSave(updatedQuestion);
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = choices.map((choice, i) =>
        i === index ? { ...choice, answer: value } : choice
    );
    setChoices(updatedChoices);
  };

  const handleCorrectChoiceChange = (index: number) => {
    const updatedChoices = choices.map((choice, i) => ({
      ...choice,
      correct: i === index,
    }));
    setChoices(updatedChoices);
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleEditChoice = (index: number) => {
    const editedAnswer =
        prompt("Edit Answer", choices[index]?.answer || "") || "";
    if (editedAnswer.trim() !== "") {
      handleChoiceChange(index, editedAnswer);
    }
  };

  const handleAddChoice = () => {
    setChoices([...choices, { answer: "", correct: false }]);
  };

  // Rendering Logic
  const renderChoices = () => {
    return choices.map((choice, index) => (
        <div key={index} className="choice-row d-flex align-items-center mb-2">
        <span className="icon me-3">
          {choice.correct ? (
              <span style={{ color: "green", fontWeight: "bold" }}>
              Correct Answer
            </span>
          ) : (
              "Possible Answer"
          )}
        </span>
          <input
              type="text"
              placeholder={`Answer ${index + 1}`}
              value={choice.answer}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              className="form-control me-3"
          />
          <input
              type="radio"
              name="correctChoice"
              checked={choice.correct}
              onChange={() => handleCorrectChoiceChange(index)}
              className="form-check-input me-3"
          />
          <button
              type="button"
              className="border-0 bg-transparent p-0 me-2"
              onClick={() => handleEditChoice(index)}
              style={{ cursor: "pointer" }}
          >
            <FaPencilAlt />
          </button>
          <button
              type="button"
              className="border-0 bg-transparent p-0"
              onClick={() => handleRemoveChoice(index)}
              style={{ cursor: "pointer" }}
          >
            <FaRegTrashAlt />
          </button>
        </div>
    ));
  };

  const renderTrueFalse = () => (
      <div>
        <div className="form-check">
          <input
              type="radio"
              id="trueOption"
              name="trueFalseAnswer"
              value="true"
              checked={answer === "true"}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-check-input"
          />
          <label className="form-check-label" htmlFor="trueOption">
            True
          </label>
        </div>
        <div className="form-check">
          <input
              type="radio"
              id="falseOption"
              name="trueFalseAnswer"
              value="false"
              checked={answer === "false"}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-check-input"
          />
          <label className="form-check-label" htmlFor="falseOption">
            False
          </label>
        </div>
      </div>
  );

  const renderFillInTheBlank = () => (
      <div>
        <input
            type="text"
            placeholder="Enter the correct answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control"
        />
      </div>
  );

  return (
      <div className="question-form">
        {/* Header Row */}
        <div className="form-row d-flex align-items-center">
          <input
              type="text"
              placeholder="Easy Question"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control me-2"
              style={{ maxWidth: "150px" }}
          />
          <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-select me-2"
              style={{ maxWidth: "200px" }}
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="fill_in_blanks">Fill in the Blank</option>
          </select>
          <div className="d-flex justify-content-end">
            <label className="me-1" style={{ fontWeight: "bold" }}>
              pts:
            </label>
            <input
                type="text"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="form-control"
                style={{ maxWidth: "80px" }}
            />
          </div>
        </div>
        <div className="form-group mt-3">
          <p className="mb-1">Enter your question and multiple answers.</p>
          <label className="mb-2">
            <strong>Question:</strong>
          </label>
          <ReactQuill
              theme="snow"
              value={questionText}
              onChange={(value) => setQuestionText(value)}
              style={{ height: "150px", marginBottom: "20px" }}
          />
        </div>
        <div className="form-group">
          <label className="mt-3 mb-2">
            <strong>Answers:</strong>
          </label>
          {type === "multiple_choice" && renderChoices()}
          {type === "true_false" && renderTrueFalse()}
          {type === "fill_in_blanks" && renderFillInTheBlank()}
          {type === "multiple_choice" && (
              <button
                  type="button"
                  className="btn btn-link mt-2 text-danger"
                  style={{ float: "right", textDecoration: "underline" }}
                  onClick={handleAddChoice}
              >
                + Add Another Answer
              </button>
          )}
        </div>
        <div className="form-actions mt-3 d-flex justify-content-start">
          <button
              className="btn btn-outline-secondary me-2"
              type="button"
              onClick={onCancel}
          >
            Cancel
          </button>
          <button className="btn btn-danger" type="button" onClick={handleSave}>
            Update Question
          </button>
        </div>
      </div>
  );
};

export default QuestionForm;
