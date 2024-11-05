import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { enrollCourse, unenrollCourse, loadEnrollments } from "./Courses/Enrollment/EnrollmentReducer";

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: () => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const enrollments = useSelector((state: any) => state.enrollmentReducer.enrollments);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  useEffect(() => {
    const storedEnrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
    dispatch(loadEnrollments(storedEnrollments));
  }, [dispatch]);

  const toggleShowAllCourses = () => {
    setShowAllCourses(!showAllCourses);
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) => enrollment.course === courseId && enrollment.user === currentUser._id
    );
  };

  const handleCourseNavigation = (courseId: string) => {
    if (isEnrolled(courseId) || isFaculty) {
      navigate(`/Kanbas/Courses/${courseId}/Home`);
    } else {
      alert("You must enroll first!!!");
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {/* Faculty Add, Update, and Edit Course */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <input
            value={course.name}
            className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <textarea
            value={course.description}
            className="form-control"
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}

      {/* Student Enrolled Courses */}
      {isStudent && (
        <button
          className="btn btn-primary float-end mb-3"
          onClick={toggleShowAllCourses}
        >
          {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
        </button>
      )}
      
      <h2 id="wd-dashboard-published">Published Courses</h2>
      <hr />

      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses
            .filter((course) => isFaculty || showAllCourses || isEnrolled(course._id))
            .map((course) => (
              <div
                key={course._id}
                className="wd-dashboard-course col"
                style={{ width: "300px" }}
              >
                <div className="card rounded-3 overflow-hidden">
                  <div
                    onClick={() => handleCourseNavigation(course._id)}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <img
                      src="/images/reactjs.jpg"
                      width="100%"
                      height={160}
                      alt=""
                    />
                    <div className="card-body">
                      <h5 className="wd-dashboard-course-title card-title">
                        {course.name}
                      </h5>
                      <p
                        className="wd-dashboard-course-title card-text overflow-y-hidden"
                        style={{ maxHeight: 100 }}
                      >
                        {course.description}
                      </p>
                      <button className="btn btn-primary" onClick={(e) => {
                        e.stopPropagation();
                        handleCourseNavigation(course._id);
                      }}>Go</button>

                      {/* Faculty Delete and Edit */}
                      {isFaculty ? (
                        <>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation(); 
                              deleteCourse(course._id);
                            }}
                            className="btn btn-danger float-end"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </button>
                          <button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setCourse(course);
                            }}
                            className="btn btn-warning me-2 float-end"
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        /* Student Enroll*/
                        <>
                          {isStudent && (
                            isEnrolled(course._id) ? (
                              <button
                                className="btn btn-danger float-end"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(unenrollCourse({ userId: currentUser._id, courseId: course._id }));
                                }}
                              >
                                Unenroll
                              </button>
                            ) : (
                              <button
                                className="btn btn-success float-end"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(enrollCourse({ userId: currentUser._id, courseId: course._id }));
                                }}
                              >
                                Enroll
                              </button>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
