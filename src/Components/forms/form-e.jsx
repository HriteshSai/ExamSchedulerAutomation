import React, { Component } from 'react';
import './forms.css';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default class Cadd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GraduationYear: '', // Graduation Year (e.g., 2023-2025)
      Year: '',           // Academic Year (e.g., 2023)
      Semester: '',       // Semester (e.g., Semester1)
      Department: '',     // Department (e.g., CSE, ECE)
      Course_ID: '',      // Course ID (e.g., CSE101)
      C_name: '',         // Course Name
      credits: '',        // Credits (e.g., 4)
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  enroll = async (event) => {
    event.preventDefault();
    try {
      const {
        GraduationYear,
        Year,
        Semester,
        Department,
        Course_ID,
        C_name,
        credits,
      } = this.state;

      if (!GraduationYear || !Year || !Semester || !Department || !Course_ID || !C_name || !credits) {
        alert('Please fill all the required fields.');
        return;
      }

      const courseRef = doc(
        db,
        'Courses',       // Standalone collection for courses
        Year,            // Document for the academic year
        Semester,        // Collection for semesters
        Course_ID        // Document for each course
      );

      await setDoc(courseRef, {
        Department,
        C_name,
        credits,
        Year,
        Semester
      });

      alert('Course registration successful!');
      this.setState({
        GraduationYear: '',
        Year: '',
        Semester: '',
        Department: '',
        Course_ID: '',
        C_name: '',
        credits: '',
      });
    } catch (error) {
      alert('Error: ' + error.message);
      console.error('Error writing document: ', error);
    }
  };

  render() {
    return (
      <div className="course-enrollment-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Roboto', marginBottom: '20px' }}>
          <b>Course Enrollment</b>
        </h2>
        <form onSubmit={this.enroll} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Graduation Year (e.g., 2023-2025)"
            name="GraduationYear"
            value={this.state.GraduationYear}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Year (e.g., 2023)"
            name="Year"
            value={this.state.Year}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Semester (e.g., Semester1)"
            name="Semester"
            value={this.state.Semester}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Department (e.g., CSE, ECE)"
            name="Department"
            value={this.state.Department}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Course ID (e.g., CSE101)"
            name="Course_ID"
            value={this.state.Course_ID}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Course Name"
            name="C_name"
            value={this.state.C_name}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Credits (e.g., 4)"
            name="credits"
            value={this.state.credits}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Register Course
          </button>
        </form>
      </div>
    );
  }
}

