import React, { Component } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navout from '../navout';
import { query, collection, getDocs } from 'firebase/firestore';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curruser: '',           // Current Student ID
      fname: '',              // First Name
      lname: '',              // Last Name
      department: '',         // Department
      gradYear: '',           // Graduation Year
      exams: [],              // Exams list
      error: null,            // Error handling
      loading: true,          // Loading state
    };
  }

  async componentDidMount() {
    const user = auth.currentUser;
    if (!user) {
      this.setState({ error: 'User not logged in.', loading: false });
      return;
    }

    const email = user.email;
    const prefix = email.split('@')[0];
    const userId = prefix.slice(-10).toUpperCase(); // Extract the Student ID
    this.setState({ curruser: userId });

    try {
      const studentInfo = await this.getStudentInfo(userId);
      if (studentInfo) {
        const { fname, lname, department, gradYear } = studentInfo;
        this.setState({ fname, lname, department, gradYear, loading: false });
        await this.fetchExams(department); // Fetch exams based on department
      }
    } catch (error) {
      console.error('[DEBUG] Error initializing student page:', error.message);
      this.setState({
        error: 'Failed to initialize student page. Please try again.',
        loading: false,
      });
    }
  }

  async getStudentInfo(userId) {
    console.log('[DEBUG] Fetching student info for S_ID:', userId);

    try {
      const studentRef = doc(db, 'AllStudents', userId);
      const studentSnapshot = await getDoc(studentRef);

      if (studentSnapshot.exists()) {
        const studentData = studentSnapshot.data();
        console.log('[DEBUG] Found student:', studentData);

        return {
          fname: studentData.Fname,
          lname: studentData.Lname,
          department: studentData.Dept || studentData.Department,
          gradYear: studentData.GraduationYear,
        };
      } else {
        console.error('[DEBUG] No student found with this ID');
        this.setState({ error: 'Student not found.', loading: false });
        return null;
      }
    } catch (error) {
      console.error('[DEBUG] Error fetching student info:', error.message);
      this.setState({ error: 'Failed to fetch student information.', loading: false });
      return null;
    }
  }

  async fetchExams(department) {
    if (!department) {
      this.setState({
        error: 'Department not found for the student.',
        loading: false,
      });
      return;
    }

    try {
      const scheduleQuery = query(
        collection(db, 'Examination_Schedule', department, 'Courses')
      );
      const querySnapshot = await getDocs(scheduleQuery);
      const exams = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          Course_id: data.Course_id,
          Course_name: data.Course_name,
          Date: data.Date,
          Time: data.Time,
          Duration: data.Duration,
          examType: data.examType || 'Unknown Type', // Ensure examType is retrieved
        };
      });

      console.log('[DEBUG] Exams:', exams); // Debugging output
      this.setState({ exams, loading: false });
    } catch (error) {
      console.error('[DEBUG] Error fetching exams:', error);
      this.setState({
        error: 'Failed to fetch exam schedules.',
        loading: false,
      });
    }
  }

  renderExamTable() {
    const { exams } = this.state;

    if (exams.length === 0) {
      return (
        <p style={{ marginLeft: '18%', color: 'white' }}>
          No upcoming exams scheduled.
        </p>
      );
    }

    return (
      <div>
        <table style={{ margin: '0 auto', width: '80%', textAlign: 'center', border: '1px solid #ccc' }}>

          <thead>
            <tr style={{ backgroundColor: 'purple', color: 'white' }}>
              <th>Exam Type</th> {/* New column added */}
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={index} style={{ backgroundColor: 'white', fontWeight: 'bold' }}> {/* Apply bold to entire row */}
                <td style={{ color: 'blue' }}>{exam.examType}</td>
                <td>{exam.Course_id}</td>
                <td>{exam.Course_name}</td>
                <td>{exam.Date}</td>
                <td>{exam.Time}</td>
                <td>{exam.Duration}</td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Navout /> {/* Placed Navout here to ensure it renders correctly */}
        <h1 style={{ marginLeft: '5%', marginTop: '20px' }}>Student Exam Schedule</h1>
        {this.state.loading && <p style={{ marginLeft: '5%', color: 'yellow' }}>Loading...</p>}
        {this.state.error && <p style={{ marginLeft: '5%', color: 'red' }}>{this.state.error}</p>}
        {this.renderExamTable()} {/* Ensure this function is called inside render() */}
      </div>
    );
  }
}

export default Student;










