import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  totalPoints: 0,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
      state.totalPoints = action.payload.reduce((sum:any, question:any) => sum + question.points, 0);
    },
    addQuestion: (state, { payload: question }) => {
      const newQuestion = {
        ...question,
        // 添加必要的默认值或处理
      };
      state.questions = [newQuestion, ...state.questions] as any;
      state.totalPoints += newQuestion.points;
    },
    deleteQuestion: (state, { payload: questionId }) => {
      const questionToDelete = state.questions.find((q: any) => q._id === questionId) as any;
      if (questionToDelete) {
        state.questions = state.questions.filter((q: any) => q._id !== questionId);
        state.totalPoints -= questionToDelete.points;
      }
    },
    updateQuestion: (state, { payload: updatedQuestion }) => {
      state.questions = state.questions.map((q: any) =>
        q._id === updatedQuestion._id ? updatedQuestion : q
      ) as any;
      state.totalPoints = state.questions.reduce((sum, question:any) => sum + question.points, 0);
    },
  },
});

export const { setQuestions, addQuestion, deleteQuestion, updateQuestion } =
  questionsSlice.actions;

export default questionsSlice.reducer;