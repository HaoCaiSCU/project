import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses</h2> <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home">

                <img src="/images/reactjs.jpg" width="100%" height={160} alt="" />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1234 Web
                  </h5>

                  <p className="wd-dashboard-course-title card-text">
                    Web developer
                  </p>
                  <button className="btn btn-primary"> Go </button>

                  {/*  <Link to="/Kanbas/Courses/1234/Home"> Go </Link> */}
                </div>
              </Link>
            </div>
          </div>


          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home">

                <img src="/images/reactjs.jpg" width="100%" height={160} alt="" />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1236 Java
                  </h5>

                  <p className="wd-dashboard-course-title card-text">
                    Java
                  </p>
                  <button className="btn btn-primary"> Go </button>

                  {/*  <Link to="/Kanbas/Courses/1234/Home"> Go </Link> */}
                </div>
              </Link>
            </div>
          </div>



          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home">

                <img src="/images/reactjs.jpg" width="100%" height={160} alt="" />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1237 Python
                  </h5>

                  <p className="wd-dashboard-course-title card-text">
                    Python
                  </p>
                  <button className="btn btn-primary"> Go </button>

                  {/*  <Link to="/Kanbas/Courses/1234/Home"> Go </Link> */}
                </div>
              </Link>
            </div>
          </div>



          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home">

                <img src="/images/reactjs.jpg" width="100%" height={160} alt="" />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1238 C++
                  </h5>

                  <p className="wd-dashboard-course-title card-text">
                    C++
                  </p>
                  <button className="btn btn-primary"> Go </button>

                  {/*  <Link to="/Kanbas/Courses/1234/Home"> Go </Link> */}
                </div>
              </Link>
            </div>
          </div>


          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home">

                <img src="/images/reactjs.jpg" width="100%" height={160} alt="" />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1250 Database
                  </h5>

                  <p className="wd-dashboard-course-title card-text">
                    Database
                  </p>
                  <button className="btn btn-primary"> Go </button>

                  {/*  <Link to="/Kanbas/Courses/1234/Home"> Go </Link> */}
                </div>
              </Link>
            </div>
          </div>


          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home">

                <img src="/images/reactjs.jpg" width="100%" height={160} alt="" />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1234 Algorithm
                  </h5>

                  <p className="wd-dashboard-course-title card-text">
                    Algorithm
                  </p>
                  <button className="btn btn-primary"> Go </button>

                  {/*  <Link to="/Kanbas/Courses/1234/Home"> Go </Link> */}
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home">

                <img src="/images/reactjs.jpg" width="100%" height={160} alt="" />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1234 Data Structure
                  </h5>

                  <p className="wd-dashboard-course-title card-text">
                    Data Structure
                  </p>
                  <button className="btn btn-primary"> Go </button>

                  {/*  <Link to="/Kanbas/Courses/1234/Home"> Go </Link> */}
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>


  );
}