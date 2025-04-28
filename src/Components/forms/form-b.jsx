import React, { Component } from 'react';
import './forms.css';
import { db } from '../../firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

export default class Sdel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GraduationYear: '', // Graduation Year
      Dept: '',           // Department
      S_ID: '',           // Student ID
      Fname: '',          // First Name
      Lname: '',          // Last Name
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  remove = async (event) => {
    event.preventDefault();

    const { GraduationYear, Dept, S_ID, Fname, Lname } = this.state;

    if (!GraduationYear || !Dept || !S_ID || !Fname || !Lname) {
      alert("Please fill all the required fields.");
      return;
    }

    try {
      // const StudentName = `${Lname} ${Fname}`;
      const studentRef = doc(db, 'Students', GraduationYear, Dept, S_ID);

      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) {
        console.log('Student Id', S_ID);
        alert(`No student found with ID: ${S_ID}`);
        return;
      }

      await deleteDoc(studentRef);
      alert(`Student with ID: ${S_ID} has been removed.`);

      this.setState({
        GraduationYear: '',
        Dept: '',
        S_ID: '',
        Fname: '',
        Lname: '',
      });
    } catch (error) {
      console.error("Error removing student: ", error);
      alert("Failed to remove the student. Please try again.");
    }
  };

  render() {
    return (
      <div className="remove-student-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Roboto', marginBottom: '20px' }}>
          <b>Remove Student</b>
        </h2>
        <form onSubmit={this.remove} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            placeholder="Department (e.g., CSE)"
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
          <button type="submit" style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#f44336', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Remove Student
          </button>
        </form>
      </div>
    );
  }
}




