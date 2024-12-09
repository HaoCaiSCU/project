import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;

// 创建问题
export const createQuestion = async (quizId: string, question: any) => {
  // 不仅新增一条question，也更新quiz的points字段
  const response = await axios.post(`${QUIZZES_API}/${quizId}`, question);
  
  return response.data;
};

// 根据测验ID获取所有问题
export const findQuestionsByQuizId = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
  return response.data;
};

// 根据问题ID获取问题
export const findQuestion = async (questionId: string) => {
  const response = await axios.get(`${QUESTIONS_API}/${questionId}`);
  return response.data;
};

// 更新问题
export const updateQuestion = async (questionId: string, question: any) => {
  console.log("Question being created:", questionId, question);
  const response = await axios.put(`${QUESTIONS_API}/${questionId}`, question);
  return response.data;
};

// 删除问题
export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await axios.delete(`${QUESTIONS_API}/${questionId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete question ${questionId}:`, err);
    throw err;
  }
};
