import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import QuizTextEditor from "../QuizTextEditor";
import "./QuestionForm.css";

const QuestionForm = ({ question, onCancel, onSave }: { question: any, onCancel: () => void, onSave: (question: any) => void }) => {
  const [type, setType] = useState(question ? question.type : "multiple_choice");
  const [title, setTitle] = useState(question ? question.title : "");
  const [points, setPoints] = useState(question ? question.points : 0);
  const [questionText, setQuestionText] = useState(question ? question.question : "");
  const [possibleAnswers, setPossibleAnswers] = useState(question ? question.possible_answers || [] : []);
  const [choices, setChoices] = useState(question ? question.choices || [] : []);
  const [isTrue, setIsTrue] = useState(question ? question.is_true || false : false);

  useEffect(() => {
    if (question) {
      setType(question.type);
      setTitle(question.title);
      setPoints(question.points);
      setQuestionText(question.question);
      setPossibleAnswers(question.possible_answers || []);
      setChoices(question.choices || []);
      setIsTrue(question.is_true || false);
    }
  }, [question]);

  const handleSave = () => {
    const updatedQuestion = {
      ...question,
      type,
      title,
      points,
      question: questionText,
      possible_answers: type === "fill_in_blanks" ? possibleAnswers.map((answer:any) => answer.toLowerCase()) : undefined,
      choices: type === "multiple_choice" ? choices : undefined,
      is_true: type === "true_false" ? isTrue : undefined,
    };
    onSave(updatedQuestion);
  };

  const handleAddChoice = () => {
    setChoices([...choices, { answer: "", correct: false }]);
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_:any, i:any) => i !== index));
  };

  const handleChoiceChange = (index: number, field: string, value: any) => {
    const newChoices = choices.map((choice:any, i:any) => {
      if (i === index) {
        return { ...choice, [field]: value };
      }
      return choice;
    });
    setChoices(newChoices);
  };

  const handleCorrectChoiceChange = (index: number) => {
    const newChoices = choices.map((choice:any, i:any) => ({
      ...choice,
      correct: i === index,
    }));
    setChoices(newChoices);
  };

  const renderChoices = () => {
    return choices.map((choice:any, index:any) => (
      <div key={index}>
        <textarea
          value={choice.answer}
          onChange={(e) => handleChoiceChange(index, "answer", e.target.value)}
        />
        <input
          type="radio"
          name="correctChoice"
          checked={choice.correct}
          onChange={() => handleCorrectChoiceChange(index)}
        />
        <button type="button" onClick={() => handleRemoveChoice(index)}>Remove</button>
      </div>
    ));
  };

  const handleAddPossibleAnswer = () => {
    setPossibleAnswers([...possibleAnswers, ""]);
  };

  const handleRemovePossibleAnswer = (index: number) => {
    setPossibleAnswers(possibleAnswers.filter((_:any, i:any) => i !== index));
  };

  const handlePossibleAnswerChange = (index: number, value: string) => {
    const newAnswers = possibleAnswers.map((answer:any, i:any) => {
      if (i === index) {
        return value;
      }
      return answer;
    });
    setPossibleAnswers(newAnswers);
  };

  const renderPossibleAnswers = () => {
    return possibleAnswers.map((answer:any, index:any) => (
      <div key={index}>
        <input
          type="text"
          value={answer}
          onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
        />
        <button type="button" onClick={() => handleRemovePossibleAnswer(index)}>Remove</button>
      </div>
    ));
  };

  return (
    <div className="question-form">
      <div className="form-group">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="multiple_choice">Multiple Choice</option>
          <option value="true_false">True/False</option>
          <option value="fill_in_blanks">Fill in Blanks</option>
        </select>
      </div>
      <div className="form-group">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Points</label>
        <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
      </div>
      <div>
        <label><strong>Question</strong></label>
        <QuizTextEditor value={questionText} setValue={(e) => setQuestionText(e)} />
      </div>
      {type === "multiple_choice" && (
        <div>
          <label>Choices</label><br />
          {renderChoices()}
          <button className="btn btn-success" type="button" onClick={handleAddChoice}>Add Choice</button>
        </div>
      )}
      {type === "fill_in_blanks" && (
        <div>
          <label><strong>Blanks</strong></label>
          {renderPossibleAnswers()}<br />
          <button className="btn btn-success" type="button" onClick={handleAddPossibleAnswer}>Add Answer</button>
        </div>
      )}
      {type === "true_false" && (
        <div>
          <label>Is True</label>
          <input
            type="checkbox"
            checked={isTrue}
            onChange={(e) => setIsTrue(e.target.checked)}
          />
        </div>
      )}
      <br /><div>
        <button className="btn btn-secondary me-2" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" type="button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default QuestionForm;