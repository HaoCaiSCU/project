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
// zys: 加了一个quiz
    const [quiz, setQuiz] = useState<any>(null);

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
            const response = await fetch(`/api/quizzes/${qid}/attempts/latest?user_id=${userId}`);
            const latestAttempt = await response.json();

            if (!response.ok) throw new Error(latestAttempt.error);

            setLatestAttempt(latestAttempt);
        } catch (err) {
            console.error("Failed to fetch latest attempt:", err);
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
        //console.log(updatedBlanks);
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
                break;
            case "fill_in_blanks":
                return Array.isArray(answer.blanks) && question.possible_answers.every((possible_answer: any, index: any) => possible_answer === answer.blanks[index]);
            default:
                return false;
        }
    }

// zys: handle 'Next'buton
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    /*const handleNextQuestion = () => {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };*/


    /*const handleRetake = () => {
      setAnswers({});
      setScore(null);
    }*/
    const handleAnswerChange = (questionId: string, selectedAnswer: string | boolean) => {
        setAnswers((prevAnswers: any) => ({
            ...prevAnswers,
            [questionId]: selectedAnswer,
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (!questions || questions.length === 0) {
            console.error("No questions available to submit.");
            return;
        }
        let totalPoints = 0; // Total possible points
        let calculatedScore = 0;

        questions.forEach((question) => {
            totalPoints += question.points;
            const userAnswer = answers[question._id];

            if (question.type === "multiple_choice") {
                // Check if user's choice matches the correct answer
                const correctChoice = question.choices.find((choice: any) => choice.correct);
                if (correctChoice && correctChoice.answer === userAnswer?.choice) {
                    calculatedScore += question.points;
                }
            } else if (question.type === "true_false") {
                // Check if user's true/false answer matches the correct answer
                if (question.is_true === userAnswer?.is_true) {
                    calculatedScore += question.points;
                }
            } else if (question.type === "fill_in_blanks") {
                // Check all blanks for correctness
                const userBlanks = userAnswer?.blanks || [];
                question.possible_answers.forEach((correctAnswer: any, index: number) => {
                    if (correctAnswer === userBlanks[index]) {
                        calculatedScore += question.points / question.possible_answers.length;
                    }
                });
            }
        });

        setScore(calculatedScore);
        console.log("Quiz submitted! Score:", calculatedScore);

        // Update attempts and latest attempt
        if (role === "STUDENT") {
            setAttemptsNumber((prev) => Math.max(0, prev - 1));
        }
    }
    /*// Optionally: Send score or attempt data to the server
    try {
      const attemptData = {
        user_id: userId,
        quiz_id: qid,
        answers: Object.keys(answers).map((questionId) => ({
          question_id: questionId,
          ...answers[questionId],
        })),
        score: calculatedScore,
      };
      await client.submitAttempt(attemptData); // Assume `submitAttempt` sends the data to the backend
      console.log("Attempt submitted successfully!");
    } catch (err) {
      console.error("Failed to submit attempt:", err);
    }
  };*/

    const attempts = [
        {
            attemptNumber: 1,
            time: "15 minutes",
            score: "20 out of 20",
            isLatest: true,
            submittedAt: "Nov 6 at 12:28am",
            duration: "15 minutes",
        },
    ];

    const handleRetake = () => {
        setAnswers({});
        setScore(null);
    }
    return (

        <div style={{ display: 'flex' }}>
            {/* Left Section: Quiz Preview */}
            <div style={{ flex: 2, padding: '20px', overflowY: 'auto', borderRight: '1px solid #ccc' }}>
                <h1>{quiz?.title}</h1>
                <p><strong>Started:</strong> {new Date().toLocaleString()}</p>
                <p className="warning-message">⚠️ This is a preview of the published version of the quiz</p>

                <hr />

                <h2>Quiz Instructions</h2>
                <RenderHtmlString htmlString={quizInstructions} />

                <hr />

                <div>

                    <section className="quiz-questions">
                        {questions.length > 0 && (
                            <div className="question-container">
                                <div className="question-header">
                                    <p className="question-number">Question {currentQuestionIndex + 1}</p>
                                    <p className="question-points">{questions[currentQuestionIndex].points} pts</p>
                                </div>
                                <RenderHtmlString htmlString={questions[currentQuestionIndex].question}/>

                                {/* Answer Options */}
                                {/* Multiple Choice*/}
                                <div className="answer-options">
                                    {questions[currentQuestionIndex].type === 'multiple_choice' &&
                                        questions[currentQuestionIndex].choices.map((choice: any, index: number) => (
                                            <div key={choice._id} className="choice-container">
                                                {index > 0 &&
                                                    <hr className="option-separator"/>} {/* Horizontal line */}
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestionIndex}`}
                                                    value={choice.answer}
                                                    checked={answers[questions[currentQuestionIndex]._id]?.choice === choice.answer}
                                                    onChange={() => handleMultipleChoiceAnswerChange(questions[currentQuestionIndex]._id, choice.answer)}

                                                />
                                                <span className="choice-text">{choice.answer}</span>

                                            </div>
                                        ))}


                                    {/* True/False */}
                                    {questions[currentQuestionIndex].type === 'true_false' && (
                                        <div className="true-false-options">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestionIndex}`}
                                                    value="true"
                                                    checked={answers[questions[currentQuestionIndex]._id]?.is_true === true}
                                                    onChange={() => handleTrueFalseAnswerChange(questions[currentQuestionIndex]._id, true)}
                                                />
                                                True
                                            </label>
                                            <hr/>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestionIndex}`}
                                                    value="false"
                                                    checked={answers[questions[currentQuestionIndex]._id]?.is_true === false}
                                                    onChange={() => handleTrueFalseAnswerChange(questions[currentQuestionIndex]._id, false)}
                                                />
                                                False
                                            </label>
                                        </div>
                                    )}

                                    {/* Fill-in-the-Blanks */}
                                    {questions[currentQuestionIndex].type === "fill_in_blanks" &&
                                        questions[currentQuestionIndex].possible_answers.map(
                                            (blank: any, index: number) => (
                                                <div key={index} className="answer-option">
                                                    <input
                                                        type="text"
                                                        id={`blank-${index}`}
                                                        value={
                                                            answers[questions[currentQuestionIndex]._id]?.blanks?.[index] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleBlanksAnswerChange(questions[currentQuestionIndex]._id, index, e.target.value)}
                                                        style={{
                                                            padding: "5px",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                            width: "100%",
                                                            maxWidth: "300px",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Navigation and Submit */}
                    <div className="navigation-bar">
                        <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="btn btn-secondary navigation-btn"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className="btn btn-secondary navigation-btn"
                        >
                            Next
                        </button>
                        <button className="btn btn-danger" onClick={handleSubmit}>Submit Quiz</button>
                        <button className="btn btn-danger" onClick={handleRetake}>Retake Quiz</button>

                    </div>

                    {/* Footer */}
                    <div className="footer">
                        <Link
                            to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Editor`}
                            className="btn btn-outline-secondary footer-btn"
                        >
                            Keep Editing This Quiz
                        </Link>
                    </div>
                </div>
                <hr/>
            </div>

            {/* Score Display */}

            {/* Right Section: Popup or Next Section */}
            <div style={{flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f9f9f9" }}>
                <h3>Attempt History</h3>
                <table className="attempt-history-table">
                    <thead>
                    <tr>
                        <th>Attempt</th>
                        <th>Time</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {attempts.map((attempt, index) => (
                        <tr key={index}>
                            <td>{`Attempt ${attempt.attemptNumber}`}</td>

                            <td>{attempt.time}</td>
                            <td>{score} / 100</td> {/* Use normalized score */}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <hr />
                {attempts[0] && (
                    <div>

                        <p>
                            <strong>Submitted:</strong> {attempts[0].submittedAt}
                        </p>

                    </div>
                )}
                {score !== null && <p>Your Score: {score}</p>}
            </div>
        </div>
    );
};

export default QuizPreview;
