import React, { Component } from 'react';
import './forms.css';
import { db } from '../../firebase';
import { collection, query, getDocs, setDoc, doc, addDoc } from 'firebase/firestore'; // Import addDoc

export default class ExamDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Course_id: '',
      Course_name: '',
      Date: '',
      Time: '',
      Duration: '',
      Department: '',
      examType: '', // Added examination type
      schedules: [],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // New function to add exam details to the 'Exams' collection
  addExamToExamsCollection = async (examDetails) => {
    try {
      const examsCollectionRef = collection(db, 'Exams');
      await addDoc(examsCollectionRef, {
        Course_name: examDetails.Course_name,
        Date: examDetails.Date,
        Time: examDetails.Time,
        Duration: examDetails.Duration,
        Department: examDetails.Department,
        examType: examDetails.examType,
        // You might want to add Course_id here as well if needed in the 'Exams' collection
        Course_id: examDetails.Course_id,
      });
      console.log('Exam details added to Exams collection successfully!');
    } catch (error) {
      console.error('Error adding exam to Exams collection:', error.message);
    }
  };

  addSchedule = async (event) => {
    event.preventDefault();
    const { Course_id, Course_name, Date, Time, Duration, Department, examType } = this.state;

    if (!Course_id || !Course_name || !Date || !Time || !Duration || !Department || !examType) {
      alert('All fields are required!');
      return;
    }

    try {
      const scheduleRef = doc(db, 'Examination_Schedule', Department, 'Courses', Course_id);
      const examDetails = {
        Course_id,
        Course_name,
        Date,
        Time,
        Duration,
        Department,
        examType,
      };
      await setDoc(scheduleRef, examDetails);

      // After successfully adding to Examination_Schedule, add to Exams collection
      await this.addExamToExamsCollection(examDetails);

      alert('Examination schedule added successfully!');

      this.setState({
        Course_id: '',
        Course_name: '',
        Date: '',
        Time: '',
        Duration: '',
        Department: '',
        examType: '',
      });
    } catch (error) {
      console.error('Error adding schedule:', error.message);
      alert('Failed to add the schedule. Please try again.');
    }
  };

  fetchSchedules = async () => {
    const { Department } = this.state;

    if (!Department) {
      alert('Please provide a department to fetch schedules.');
      return;
    }

    try {
      const scheduleQuery = query(collection(db, 'Examination_Schedule', Department, 'Courses'));
      const querySnapshot = await getDocs(scheduleQuery);

      const schedules = querySnapshot.docs.map((doc) => doc.data());
      this.setState({ schedules });
    } catch (error) {
      console.error('Error fetching schedules:', error.message);
      alert('Failed to fetch schedules. Please try again.');
    }
  };

  render() {
    const { schedules, Department } = this.state;

    return (
      <div className="exam-schedule-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2 style={{ fontFamily: 'Roboto', textAlign: 'center', marginBottom: '20px' }}>
          <b>Examination Schedule Management</b>
        </h2>
        <form onSubmit={this.addSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Course ID" name="Course_id" onChange={this.handleChange} required />
          <input type="text" placeholder="Course Name" name="Course_name" onChange={this.handleChange} required />
          <input type="date" name="Date" onChange={this.handleChange} required />
          <input type="text" placeholder="Time (e.g., 10:00 AM)" name="Time" onChange={this.handleChange} required />
          <input type="text" placeholder="Duration (e.g., 3 hours)" name="Duration" onChange={this.handleChange} required />
          <input type="text" placeholder="Department" name="Department" onChange={this.handleChange} required />

          {/* New Examination Type Dropdown */}
          <select
            name="examType"
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
            required
          >
            <option value="">Select Examination Type</option>
            <option value="Mid Exam">Mid Examination</option>
            <option value="Semester Exam">Semester Examination</option>
            <option value="Lab Internal Exam">Lab Internal Examination</option>
            <option value="Lab External Exam">Lab External Examination</option>
          </select>

          <button type="submit">Add Schedule</button>
          <button type="button" onClick={this.fetchSchedules}>Fetch Schedules</button>
        </form>

        {/* Display Schedules */}
        {Department && schedules.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ textAlign: 'center' }}>Schedules for Department: {Department}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#4caf50', color: '#fff' }}>
                  <th>#</th>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Examination Type</th> {/* Added column */}
                </tr>
              </thead>
              <tbody>
                {schedules.map((exam, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                    <td>{index + 1}</td>
                    <td>{exam.Course_id}</td>
                    <td>{exam.Course_name}</td>
                    <td>{exam.Date}</td>
                    <td>{exam.Time}</td>
                    <td>{exam.Duration}</td>
                    <td>{exam.examType}</td> {/* Display exam type */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
