import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as QuestionClient from '../Questions/clients';
import * as QuizClient from '../client';
import * as client from './client';
import { useSelector } from 'react-redux';
import './QuizPreview.css';
import RenderHtmlString from './RenderHtmlString';

const QuizPreview = () => {
  const { cid } = useParams() as any;
  const { qid } = useParams() as any;

  const [, setQuiz] = useState<any>(null);
  const [quizInstructions, setQuizInstructions] = useState<any>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [attemptsNumber, setAttemptsNumber] = useState<number>(0);
  
  // 用户信息
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const userId = currentUser._id;
  const role = currentUser.role;

  const fetchLatestAttempt = async () => {
    try {
      const latestAttempt = await client.getLatestAttempt(qid, userId);
      if (!latestAttempt) {
        return;
      }

      setLatestAttempt(latestAttempt);
      console.log(latestAttempt);

      // 更新answers状态
      const newAnswers: any = {};
      latestAttempt.answers.forEach((answer: any) => {
        newAnswers[answer.question_id] = {
          choice: answer.choice || null,
          is_true: answer.is_true !== undefined ? answer.is_true : null,
          blanks: answer.blanks || []
        };
      });
      setAnswers(newAnswers);

    } catch (err) {
      console.error("Failed to fetch latest attempts: ", err);
    }
  };

  // 渲染
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await QuizClient.findQuiz(cid as string, qid as string);
        setQuiz(quiz);
        setQuizInstructions(quiz.quiz_instructions);
        if (role === 'STUDENT') {
          const count = await client.getPreviousAttemptsNumber(qid, userId);
          setAttemptsNumber(quiz.how_many_attempts - count);
        }
      } catch (err) {
        console.error("Failed to fetch quiz: ", err);
      }
    };
  
    const fetchQuestions = async () => {
      try {
        const questions = await QuestionClient.findQuestionsByQuizId(qid as string);
        setQuestions(questions);
      } catch (err) {
        console.error("Failed to fetch questions: ", err);
      }
    };
  
    const fetchLatestAttempt = async () => {
      try {
        const latestAttempt = await client.getLatestAttempt(qid, userId);
        if (!latestAttempt) return;
  
        setLatestAttempt(latestAttempt);
  
        const newAnswers: any = {};
        latestAttempt.answers.forEach((answer: any) => {
          newAnswers[answer.question_id] = {
            choice: answer.choice || null,
            is_true: answer.is_true !== undefined ? answer.is_true : null,
            blanks: answer.blanks || [],
          };
        });
        setAnswers(newAnswers);
      } catch (err) {
        console.error("Failed to fetch latest attempts: ", err);
      }
    };
  
    fetchQuiz();
    fetchQuestions();
    fetchLatestAttempt();
  }, [qid, cid, role, userId]);
  

  // true false question
  const handleTrueFalseAnswerChange = (questionId: string, is_true: Boolean) => {
    const answer = {
      choice: null,
      is_true: is_true,
      blanks: []
    }
    setAnswers({ ...answers, [questionId]: answer });
  };

  // multiple choice question
  const handleMultipleChoiceAnswerChange = (questionId: string, choice: String) => {
    const answer = {
      choice: choice,
      is_true: null,
      blanks: []
    }
    setAnswers({ ...answers, [questionId]: answer });
  };

  // fill in blanks question
  const handleBlanksAnswerChange = (questionId: string, blankIndex: number, blank: String) => {
    const updatedBlanks = answers[questionId]?.blanks ? [...answers[questionId].blanks] : [];
    updatedBlanks[blankIndex] = blank.toLowerCase();
    const answer = {
      choice: null,
      is_true: null,
      blanks: updatedBlanks
    };
    console.log(updatedBlanks);
    setAnswers({ ...answers, [questionId]: answer });
  };

  // 组装一个attempt提交到后端
  const handleSubmit = async () => {

    // 如果role是学生且没有尝试次数了，弹窗提示
    if (role === 'STUDENT' && attemptsNumber <= 0) {
      alert("You have no attempts left!");
      return;
    }
    
    try {

      // 将answers转换成数组
      const attemptAnswers = Object.keys(answers).map(questionId => ({
        question_id: questionId,
        choice: answers[questionId].choice,
        is_true: answers[questionId].is_true,
        blanks: answers[questionId].blanks || []
      }));

      // 计算分数
      const score = countScore(attemptAnswers);
      setScore(score);

      // 组装一个attempt


      // 更新attemptsNumber
      setAttemptsNumber(attemptsNumber - 1);

      // 更新latestAnswers
      fetchLatestAttempt();

    } catch (err) {
      console.error("Failed to submit answers:", err);
    }
  };

  // 直接在前端计算分数
  const countScore = (answers: any) => {
    let score = 0;
    answers.forEach((answer:any) => {
        try {
            const question = questions.find(question => question._id === answer.question_id);
            console.log("counting score for question:", question, question.type);
            switch (question.type) {
                case "multiple_choice":
                    const correct_choice = question.choices.find((choice:any) => choice.correct);
                    if (correct_choice && correct_choice.answer === answer.choice) {
                        score += question.points;
                    }
                    console.log("correct choice:", correct_choice.answer, "answer:", answer.choice, "result:", correct_choice && correct_choice.answer === answer.choice);
                    break;
                case "true_false":
                    if (question.is_true === answer.is_true) {
                        score += question.points;
                    }
                    console.log("correct answer:", question.is_true, "answer:", answer.is_true, "result:", question.is_true === answer.is_true);
                    break;
                case "fill_in_blanks":
                    if (Array.isArray(answer.blanks)) {
                        question.possible_answers.forEach((possible_answer:any, index:any) => {
                            if (possible_answer === answer.blanks[index]) {
                                score += question.points / question.possible_answers.length;
                            }
                        });
                    }
                    console.log("possible answers:", question.possible_answers, "answer:", answer.blanks);
                    break;
                default:
                    console.error(`Unsupported question type: ${question.type}`);
                    break;
            }
        } catch (error) {
            console.error(`Error processing question ID ${answer.question_id}:`, error);
        }
      });
    return parseFloat(score.toFixed(2));
}

const isAnswerCorrect = (question: any, answer: any) => {
  switch (question.type) {
    case "multiple_choice":
      const correct_choice = question.choices.find((choice: any) => choice.correct);
      return correct_choice && correct_choice.answer === answer.choice;
    case "true_false":
      return question.is_true === answer.is_true;
    case "fill_in_blanks":
      return Array.isArray(answer.blanks) && question.possible_answers.every((possible_answer: any, index: any) => possible_answer === answer.blanks[index]);
    default:
      return false;
  }
}

const handleRetake = () => {
  setAnswers({});
  setScore(null);
}

  return (
    <div style={{ display: 'flex' }}>
      <div className="quiz-form" style={{ flex: 1 }}> 
      <Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Editor`}>
        {role === 'FACULTY' && (
        <button className="btn btn-primary">Edit Quiz</button>
        )}
      </Link> 
      <Link to = {`/Kanbas/Courses/${cid}/Quizzes`}>
        <button className="btn btn-secondary me-2">Back to Quizzes</button>
      </Link>
        <button className="btn btn-danger" onClick={handleSubmit}>Submit Quiz</button>
        <button className="btn btn-danger" onClick={handleRetake}>Retake Quiz</button>
        <hr /><div>
          <p> <strong>Attempts Left: </strong>{role !== 'FACULTY' ? attemptsNumber : 'Infinite'} </p>
          <p> <strong>Your score:</strong>{score !== null && <p> {score}</p>} </p>
          <p> <strong>Quiz Instructions:</strong> <RenderHtmlString htmlString={quizInstructions} /></p>
        </div><hr />
      <div>
        {questions.map((question) => (
          <div key={question._id}>
            <p><strong>Question: </strong> <RenderHtmlString htmlString={question.question} /></p>
            <p><strong>Points: </strong>{question.points}</p>
            <p><strong>Answer:</strong></p>
            {question.type === 'multiple_choice' && question.choices.map((choice: any) => (
              <div key={choice._id}>
                <input
                  type="radio"
                  name={question._id}
                  value={choice.answer}
                  checked={answers[question._id]?.choice === choice.answer}
                  onChange={() => handleMultipleChoiceAnswerChange(question._id, choice.answer)}
                />
                {choice.answer}
                </div>
            ))}
            {question.type === 'true_false' && (
              <div>
                <input
                  type="radio"
                  name={question._id}
                  value="true"
                  checked={answers[question._id]?.is_true === true}
                  onChange={() => handleTrueFalseAnswerChange(question._id, true)}
                />
                True
                <input
                  type="radio"
                  name={question._id}
                  value="false"
                  checked={answers[question._id]?.is_true === false}
                  onChange={() => handleTrueFalseAnswerChange(question._id, false)}
                />
                False
              </div>
            )}
            {question.type === 'fill_in_blanks' && question.possible_answers.map((blank: any, index: number) => (
              <div>
              <input
                key={index}
                type="text"
                value={answers[question._id]?.blanks?.[index] || ''}
                onChange={(e) => handleBlanksAnswerChange(question._id, index, e.target.value)}
              />
              <br />
              </div>
            ))}
          <hr /></div>
        ))}
      </div>
    </div>
    
    <div className="quiz-form" style={{ flex: 1, marginLeft: '20px' }}>
      <h3>Latest Attempt</h3>
      {latestAttempt && (
      <div>
      <p><strong>Take Time:</strong> {new Date(latestAttempt.created_at).toLocaleString()}</p>
      <p><strong>Get Score:</strong> {latestAttempt.score}</p>
      <h4>Answered:</h4>
      <ul>
        {latestAttempt.answers.map((answer: any) => {
          const question = questions.find(q => q._id === answer.question_id);
          if (!question) {
            throw new Error(`Question not found: ${answer.question_id}`);
          }
          const correct = isAnswerCorrect(question, answer);
          return (
            <li className="answered-question" key={answer.question_id} style={{ color: correct ? 'green' : 'red' }}>
              <p><strong>Question:</strong> {question?.question}</p>
              <p><strong>Answer:</strong> {answer.choice || (answer.is_true !== null ? answer.is_true.toString() : answer.blanks.join(', '))}</p>
              {correct ? <p>✔️ Correct</p> : <p>❌ Incorrect</p>}
            </li>
          );
        })}
      </ul>
      </div>
      )}
    </div>
  
    </div>
  );
};

export default QuizPreview;