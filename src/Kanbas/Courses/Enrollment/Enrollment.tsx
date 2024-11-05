import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useEffect, useState } from "react";

export default function EnrolledList({ courses }: { courses: any[] }) {
  //const [] = useState("");
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [userCourses, setUserCourses] = useState<any[]>([]);

  const removeCourse = async (userId: any, courseId: any) => {
    try {
      
      
      const updatedUserCourses = userCourses.filter(
        (course) => course._id !== courseId
      );
      setUserCourses(updatedUserCourses);
   
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };
  useEffect(() => {
    const filteredCourses = courses.filter((course) =>
      currentUser.courses.includes(course._id)
    );
    setUserCourses(filteredCourses);
  }, [currentUser.courses]);

  return (
    <div id="wd-dashboard">
      <h2 id="wd-dashboard-published">
        Enrolled Courses ({userCourses.length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {userCourses.map((course: any) => (
            <div
              key={course._id}
              className="wd-dashboard-course col"
              style={{ width: "300px" }}
            >
              <Link
                to={`/Kanbas/Courses/${course._id}/Home`}
                className="text-decoration-none"
              >
                <div className="card rounded-3 overflow-hidden">
                  <img src="/images/reactjs.jpg" height="{160}" />
                  <div className="card-body">
                    <span
                      className="wd-dashboard-course-link"
                      style={{
                        textDecoration: "none",
                        color: "navy",
                        fontWeight: "bold",
                      }}
                    >
                      {course.name}
                    </span>

                    <p
                      className="wd-dashboard-course-title card-text"
                      style={{ maxHeight: 53, overflow: "hidden" }}
                    >
                      {course.description}
                    </p>

                    <div>
                      <button
                        id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          removeCourse(currentUser._id, course._id);
                        }}
                        className="btn btn-primary me-2"
                      >
                        Drop
                      </button>
                      <Link
                        to={`/Kanbas/Courses/${course._id}/Home`}
                        className="btn btn-warning float-end"
                      >
                        Go
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

