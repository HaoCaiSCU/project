import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Enrollment {
  user: string;
  course: string;
}

interface EnrollmentState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentState = {
  enrollments: JSON.parse(localStorage.getItem("enrollments") || "[]"),
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    enrollCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      const newEnrollment = { user: action.payload.userId, course: action.payload.courseId };
      state.enrollments.push(newEnrollment);
      localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
    },
    unenrollCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) =>
          !(enrollment.user === action.payload.userId && enrollment.course === action.payload.courseId)
      );
      localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
    },
    loadEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
  },
});

export const { enrollCourse, unenrollCourse, loadEnrollments } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
