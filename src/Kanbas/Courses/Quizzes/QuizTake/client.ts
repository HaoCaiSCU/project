import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const postAttempt = async (attempt:any) => {
  if (!attempt.quiz_id || !attempt.answers) {
    console.error("Invalid attempt data:", attempt);
    throw new Error("Attempt data is invalid.");
  }
  try {
    const quizId = attempt.quiz_id;
    const response = await axios.post(`${QUIZZES_API}/${quizId}/newAttempt`, attempt);
    return response.data;
  } catch (err) {
    console.error("Failed to submit answers:", err);
    throw err;
  }
}

// find all attempts from same user and quiz
export const getAttempts = async (quizId:any, userId:any) => {
  try {
    const response = await axios.get(`${QUIZZES_API}/${quizId}/attempts`, userId);
    return response.data;
  } catch (err) {
    console.error("Failed to get attempts:", err);
  }
}

// get attempts number from same user and quiz
export const getPreviousAttemptsNumber = async (quizId:any, userId:any) => {
  try {
    const response = await axios.get(`${QUIZZES_API}/${quizId}/attempts/number`, {
      params: { userId }
    });
    return response.data.count;
  } catch (err) {
    console.error("Failed to get attempts:", err);
  }
}

// get the latest attempt from same user and quiz
export const getLatestAttempt = async (quizId:any, userId:any) => {
    try {
      const response = await axios.get(`${QUIZZES_API}/${quizId}/attempts/latest`, {
        params: { userId }
      });
      return response.data;
    } catch (err) {
      console.error("Failed to get attempts:", err);
    }
  }