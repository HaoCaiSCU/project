import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, { payload: quiz }) => {
      const newQuiz = {
        name: quiz.name || "Default Quiz Name",
        course: quiz.course || "",
        status: quiz.status || false,
        questions: [],
        type: quiz.type || "Graded Quiz",
        points: quiz.points || 0,
        assignmentGroup: quiz.assignmentGroup || "Quizzes",
        shuffleAnswers: quiz.shuffleAnswers ?? true,
        timeLimit: quiz.timeLimit || 20,
        multipleAttempts: quiz.multipleAttempts ?? false,
        howManyAttempts: quiz.multipleAttempts ? quiz.howManyAttempts || 1 : 1,
        showCorrectAnswers: quiz.showCorrectAnswers || null,
        accessCode: quiz.accessCode || "",
        oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
        webcamRequired: quiz.webcamRequired ?? false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering ?? false,
        dueDate: quiz.dueDate || new Date().getTime(),
        availableDate: quiz.availableDate || new Date().getTime(),
        untilDate: quiz.untilDate || new Date().getTime(),
      };
      state.quizzes = [newQuiz, ...state.quizzes] as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
    editQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId ? { ...q, editing: true } : q
      ) as any;
    },
  },
});

export const { setQuizzes, addQuiz, deleteQuiz, updateQuiz, editQuiz } =
  quizzesSlice.actions;

export default quizzesSlice.reducer;