export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name"><b>Assignment Name</b></label><br /><br />
            <input id="wd-name" value="A1 - ENV + HTML" /><br /><br />
            <textarea id="wd-description" cols={45} rows={9}>
                The assignment is available online Submit a link to the landing
                page of your Web application running on Netlify. The landing
                page should include the following: Your full name and section
                Links to each of the lab assignments Link to the Kanbas application
                Links to all relevant source code repositories The Kanbas application
                should include a link to navigate back to the landing page.123
            </textarea><br /><br />

            <table>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td >
                        <input id="wd-points" value={100} />
                    </td>
                </tr>
                <br />
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                        <select id="wd-group">
                            <option selected value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="PROJECT">PROJECT</option>
                            <option value="EXAM">EXAM</option>
                            <option value="EXAM">NONE</option>
                        </select>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-display-grade-as">Display Grade as</label>
                    </td>
                    <td>
                        <select id="wd-display-grade-as">
                            <option selected value="Percentage">Percentage</option>
                            <option value="Letter Grades">Letter Grades</option>
                            <option value="GPA">GPA</option>
                        </select>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                        <select id="wd-submission-type">
                            <option selected value="Online">Online</option>
                            <option value="In Class">In Class</option>
                        </select>
                    </td>
                </tr>
                <br />

                <tr>
                    {<td></td>}
                    <td align="left" valign="top">
                        <label>Online Entry Options</label>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <input type="checkbox" name="online-entry" id="wd-text-entry" />
                        <label htmlFor="wd-text-entry">Text Entry</label><br />

                        <input type="checkbox" name="online-entry" id="wd-website-url" />
                        <label htmlFor="wd-website-url">Website URL</label><br />

                        <input type="checkbox" name="online-entry" id="wd-media-recordings" />
                        <label htmlFor="wd-media-recordings">Media Recordings</label><br />

                        <input type="checkbox" name="online-entry" id="wd-student-annotation" />
                        <label htmlFor="wd-student-annotation">Student Annotation</label><br />

                        <input type="checkbox" name="online-entry" id="wd-file-upload" />
                        <label htmlFor="wd-file-upload">File Uploads</label>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right">
                        <label>Assign</label>
                    </td>
                    <td align="left" valign="top">
                        <label htmlFor="wd-assign-to">Assign to</label>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td align="right" valign="top">
                        <input id="wd-assign-to" value="Everyone" />
                    </td>
                </tr>
                <br />

                <tr>
                    <td></td>
                    <td align="left" valign="top">
                        <label htmlFor="wd-due-date">Due</label>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <input id="wd-due-date" type="date" value="2024-05-13" />
                    </td>
                </tr>
                <br />

                <tr>
                    <td></td>
                    <td align="left" valign="top">
                        <label htmlFor="wd-available-from">Available from</label>
                    </td>
                    <td align="left" valign="top">
                        <label htmlFor="wd-available-until">Until</label><br />
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td align="left" valign="top">
                        <input id="wd-available-from" type="date" value="2024-05-06" />
                    </td>
                    <td align="left" valign="top">
                        <input id="wd-available-until" type="date" defaultValue="2024-05-20" />
                    </td>
                </tr>
            </table>
            <hr />
            <table width="100%">
                <tr>
                    <td align="right">
                        <button>Cancel</button> <button>Save</button><br />
                    </td>
                </tr>
            </table>
        </div>
    );
}