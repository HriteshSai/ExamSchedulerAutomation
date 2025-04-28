import React, { Component } from 'react';
import './forms.css'; // Ensure styles for responsiveness
import { auth, db } from '../../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default class Sadd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      S_ID: '',          // Student ID
      Fname: '',         // First Name
      Lname: '',         // Last Name
      Email: '',         // Email
      Password: '',      // Password
      Dept: '',          // Department (e.g., CSE, ECE)
      GraduationYear: '' // Graduation Year (e.g., 2023-2027)
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  enroll = async (event) => {
    event.preventDefault();
    try {
      const { S_ID, Fname, Lname, Email, Password, Dept, GraduationYear } = this.state;

      if (!S_ID || !Fname || !Lname || !Email || !Password || !GraduationYear || !Dept) {
        alert("Please fill all the required fields.");
        return;
      }

      const StudentName = `${Lname} ${Fname}`;
      const studentRef = doc(db, 'Students', GraduationYear, Dept, S_ID);

      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        alert("A student with this ID already exists.");
        return;
      }

      // Create user in Firebase Auth
      await createUserWithEmailAndPassword(auth, `${Fname + S_ID}@students.griet.edu`, Password);

      // Add student to Students collection (nested)
      await setDoc(studentRef, {
        Fname,
        Lname,
        Email,
        Password,
        S_ID,
        Dept,
        GraduationYear,
        StudentName
      });

      // ✅ Add student to AllStudents collection (flat)
      const allStudentsRef = doc(db, 'AllStudents', S_ID);  // Use StudentID directly
      await setDoc(allStudentsRef, {
        Fname,
        Lname,
        Email,
        Password,
        S_ID,
        Dept,
        GraduationYear,
        StudentName
      });

      alert("Student enrollment successful!");
      this.setState({ S_ID: '', Fname: '', Lname: '', Email: '', Password: '', Dept: '', GraduationYear: '' });
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Enrollment failed. " + error.message);
    }
  };

  render() {
    return (
      <div className="enrollment-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Roboto', marginBottom: '20px' }}>
          <b>Student Enrollment</b>
        </h2>
        <form onSubmit={this.enroll} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Graduation Year (e.g., 2023-2027)"
            name="GraduationYear"
            value={this.state.GraduationYear}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Department (e.g., CSE, ECE)"
            name="Dept"
            value={this.state.Dept}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Student ID"
            name="S_ID"
            value={this.state.S_ID}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            name="Fname"
            value={this.state.Fname}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="Lname"
            value={this.state.Lname}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="Email"
            value={this.state.Email}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="Password"
            value={this.state.Password}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Enroll Student
          </button>
        </form>
      </div>
    );
  }
}


