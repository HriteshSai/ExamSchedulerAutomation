import React, { Component } from 'react';
import './forms.css';
import { auth, db } from '../../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default class Fadd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      F_ID: '',          // Faculty ID
      Designation: '',   // Designation (e.g., Role)
      Department: '',    // Department (e.g., CSE, ECE)
      Fname: '',         // First Name
      Lname: '',         // Last Name
      Email: '',         // Email
      Password: '',      // Password
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  enroll = async (event) => {
    event.preventDefault();

    const {
      F_ID,
      Designation,
      Department,
      Fname,
      Lname,
      Email,
      Password,
    } = this.state;

    try {
      // Ensure all required fields are filled
      if (!F_ID || !Designation || !Department || !Fname || !Lname || !Email || !Password) {
        alert("Please fill all the required fields.");
        return;
      }

      // Combine Last Name and First Name for Faculty Name
      const FacultyName = `${Lname} ${Fname}`;

      // Reference path: Faculties → Department → F_ID → Info
      const facultyRef = doc(
        db,
        'Faculties',       // Top-level collection for faculties
        Department,        // Collection for Department
        F_ID,              // Document for Faculty ID
        'Info'             // Sub-collection or "Info" document
      );

      // Check if faculty already exists
      const facultySnap = await getDoc(facultyRef);
      if (facultySnap.exists()) {
        alert(`A faculty with ID: ${F_ID} already exists.`);
        return;
      }

      // Create user in Firebase Authentication
      await createUserWithEmailAndPassword(auth, `${Fname + F_ID}@faculties.griet.edu`, Password);

      // Add faculty details to Firestore
      await setDoc(facultyRef, {
        F_ID,
        FacultyName,
        Designation,
        Department,
        Email,
        Password,
      });

      alert("Faculty enrollment successful!");

      // Clear form fields after successful enrollment
      this.setState({
        F_ID: '',
        Designation: '',
        Department: '',
        Fname: '',
        Lname: '',
        Email: '',
        Password: '',
      });
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Enrollment failed. " + error.message);
    }
  };

  render() {
    const { F_ID, Designation, Department, Fname, Lname, Email, Password } = this.state;

    return (
      <div className="faculty-enrollment-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Roboto', marginBottom: '20px' }}>
          <b>Faculty Enrollment</b>
        </h2>
        <form onSubmit={this.enroll} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Faculty ID"
            name="F_ID"
            value={F_ID}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Designation"
            name="Designation"
            value={Designation}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Department"
            name="Department"
            value={Department}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            name="Fname"
            value={Fname}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="Lname"
            value={Lname}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="Email"
            value={Email}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="Password"
            value={Password}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Enroll Faculty
          </button>
        </form>
      </div>
    );
  }
}




