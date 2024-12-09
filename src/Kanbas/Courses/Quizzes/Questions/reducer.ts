import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Choice {
  answer: string;
  correct: boolean;
}

export interface Question {
  _id: string;
  title: string;
  points: number;
  type: "multiple_choice" | "true_false" | "fill_in_blanks";
  question: string;
  choices?: Choice[];
  answer?: string;
  is_true?: boolean; // 用于 true_false 类型的题目
  possible_answers?: string[]; // 用于 fill_in_blanks 类型的题目
}

interface QuestionsState {
  questions: Question[];
  totalPoints: number;
}

const initialState: QuestionsState = {
  questions: [],
  totalPoints: 0,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    // 设置问题列表
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.totalPoints = action.payload.reduce(
          (sum, question) => sum + question.points,
          0
      );
    },

    // 添加新问题
    addQuestion: (state, action: PayloadAction<Partial<Question>>) => {
      const newQuestion: Question = {
        _id: action.payload._id || `temp-${Date.now()}`, // 生成临时 ID
        title: action.payload.title || "Untitled Question",
        points: action.payload.points || 0,
        type: action.payload.type || "multiple_choice",
        question: action.payload.question || "",
        choices: action.payload.choices || [],
        answer: action.payload.answer || "",
        is_true: action.payload.type === "true_false" ? action.payload.is_true || false : undefined,
        possible_answers:
            action.payload.type === "fill_in_blanks"
                ? action.payload.possible_answers || []
                : undefined,
      };
      state.questions.push(newQuestion);
      state.totalPoints += newQuestion.points;
    },

    // 删除问题
    deleteQuestion: (state, action: PayloadAction<string>) => {
      const questionToDelete = state.questions.find(
          (q) => q._id === action.payload
      );
      if (questionToDelete) {
        state.questions = state.questions.filter(
            (q) => q._id !== action.payload
        );
        state.totalPoints -= questionToDelete.points;
      }
    },

    // 更新问题
    updateQuestion: (state, action: PayloadAction<Question>) => {
      state.questions = state.questions.map((q) =>
          q._id === action.payload._id ? action.payload : q
      );
      state.totalPoints = state.questions.reduce(
          (sum, question) => sum + question.points,
          0
      );
    },
  },
});

export const { setQuestions, addQuestion, deleteQuestion, updateQuestion } =
    questionsSlice.actions;

export default questionsSlice.reducer;
