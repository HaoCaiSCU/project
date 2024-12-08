import React from "react";
import { Link } from "react-router-dom";


const Landing: React.FC = () => {
    return (
        <div className="container">
            <header>
                <h1>Welcome to Our Project</h1>
                <br/>
            </header>
            <main>
                <section className="team">
                    <h2>Team Members</h2>
                    <ul>
                        <li><strong>Pengjun Guan</strong> - Section 1</li>
                        <li><strong>Weiqing Gao</strong> - Section 1</li>
                        <li><strong>Hao Cai</strong> - Section 1</li>
                        <li><strong>Yingshan Zhao</strong> - Section 1</li>

                    </ul>
                </section>
                <section className="repositories">
                    <h2>Project Repositories</h2>
                    <ul>
                        <li>
                            <a
                                href=" "
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Frontend (React.js)
                            </a >
                        </li>
                        <li>
                            <a
                                href="https://github.com/HaoCaiSCU/project-end"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Backend (Node.js)
                            </a >
                        </li>
                    </ul>
                </section>
                <section className="navigation">
                    <h2>Navigation</h2>
                    <ul>
                        <li><Link to="/Labs">Labs</Link></li>
                        <li><Link to="/Kanbas">Kanbas</Link></li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default Landing;