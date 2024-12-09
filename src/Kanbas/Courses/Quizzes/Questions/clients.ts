import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;

export const createQuestion = async (quizId: string, question: any) => {
  if (!quizId) {
    throw new Error("Quiz ID is missing in createQuestion.");
  }
  console.log("Creating question for quiz ID:", quizId);
  const response = await axios.post(`${QUIZZES_API}/${quizId}`, question);
  return response.data;
};

export const findQuestionsByQuizId = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
  return response.data;
};

export const updateQuestion = async (questionId: string, question: any) => {
  const response = await axios.put(`${QUESTIONS_API}/${questionId}`, question);
  return response.data;
};

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await axios.delete(`${QUESTIONS_API}/${questionId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete question ${questionId}:`, err);
    throw err;
  }
};
