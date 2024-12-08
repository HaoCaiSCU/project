import axios from 'axios';

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER || "http://localhost:4000";
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const fetchAllCourses = async () => {
  const response = await axios.get(COURSES_API);
  return response.data;
};

export const enrollInCourse = async (userId: any, courseId: any) => {
  const response = await axios.post(`${ENROLLMENTS_API}`, { userId, courseId });
  return response.data;
};

export const unenrollFromCourse = async (userId: any, courseId: any) => {
    const response = await axios.delete(ENROLLMENTS_API, { data: { userId, courseId } });
    return response.data;
};

export const getEnrollmentsForUser = async (userId: any) => {
  const response = await axios.get(`${ENROLLMENTS_API}/user/${userId}`);
  return response.data;
};

