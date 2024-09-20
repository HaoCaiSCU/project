import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import { Navigate, Route, Routes } from "react-router";
export default function Courses() {
  return (
    <div id="wd-courses">
      <h2>Course 1234</h2>
      <hr />
      <table>
        <tr>
          <td valign="top">
            <CoursesNavigation />
          </td>
          <td valign="top">
            <Routes>
              <Route path="/"
                     element={<Navigate to="Home" />} />
              <Route path="Home" element={<Home />} />
              <Route path="Modules" element={<Modules />} />
              <Route path="Assignments"
                     element={<h3>Assignments</h3>} />
              <Route path="Assignments/:aid"
                     element={<h3>Assignment Editor</h3>} />
              <Route path="People" element={<h3>People</h3>} />
            </Routes>
          </td>
        </tr>
      </table>
    </div>
);}
