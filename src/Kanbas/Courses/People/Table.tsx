import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
  return (
    <div id="wd-people-table">
      <table className="table table-striped">
        <thead>
          <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
        </thead>
        <tbody>
          <tr><td className="wd-full-name text-nowrap">
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Tony</span>{" "}
              <span className="wd-last-name">Stark</span></td>
            <td className="wd-login-id">001234561S</td>
            <td className="wd-section">S101</td>
            <td className="wd-role">STUDENT</td>
            <td className="wd-last-activity">2020-10-01</td>
            <td className="wd-total-activity">10:21:32</td> </tr>
          {/* Add at least 3 more users such as Bruce Wayne, Steve Rogers, and Natasha Romanoff */}

          <tr><td className="wd-full-name text-nowrap">
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Susan</span>{" "}
              <span className="wd-last-name">White</span></td>
            <td className="wd-login-id">00132138</td>
            <td className="wd-section">S01</td>
            <td className="wd-role">STUDENT</td>
            <td className="wd-last-activity">2024-11-02</td>
            <td className="wd-total-activity">11:22:33</td> </tr>

            <tr><td className="wd-full-name text-nowrap">
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">David</span>{" "}
              <span className="wd-last-name">Smith</span></td>
            <td className="wd-login-id">0032138</td>
            <td className="wd-section">S02</td>
            <td className="wd-role">STUDENT</td>
            <td className="wd-last-activity">2024-10-02</td>
            <td className="wd-total-activity">11:12:33</td> </tr>


            <tr><td className="wd-full-name text-nowrap">
              <FaUserCircle className="me-2 fs-1 text-secondary" />
              <span className="wd-first-name">Cornel</span>{" "}
              <span className="wd-last-name">Abanis</span></td>
            <td className="wd-login-id">00939202</td>
            <td className="wd-section">S04</td>
            <td className="wd-role">STUDENT</td>
            <td className="wd-last-activity">2024-05-02</td>
            <td className="wd-total-activity">11:01:33</td> </tr>

        </tbody>
      </table>
    </div> );}