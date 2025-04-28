import React, { Component } from 'react';
import './forms.css';
import { db } from '../../firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

export default class Fdel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Department: '',    // Department
      F_ID: '',          // Faculty ID
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  remove = async (event) => {
    event.preventDefault();
    const { Department, F_ID } = this.state;

    if (!Department || !F_ID) {
      alert("Please fill all the required fields.");
      return;
    }

    try {
      const facultyRef = doc(
        db,
        'Faculties',       // Top-level collection for faculties
        Department,        // Collection for Department
        F_ID,              // Document for Faculty ID
        'Info'             // Sub-document or "Info"
      );

      const facultySnap = await getDoc(facultyRef);
      if (!facultySnap.exists()) {
        alert(`No faculty found with ID: ${F_ID} in Department: ${Department}`);
        return;
      }

      await deleteDoc(facultyRef);
      alert(`Faculty with ID: ${F_ID} has been removed.`);

      this.setState({
        Department: '',
        F_ID: '',
      });
    } catch (error) {
      console.error("Error removing faculty: ", error);
      alert("Failed to remove the faculty. Please try again.");
    }
  };

  render() {
    const { Department, F_ID } = this.state;

    return (
      <div className="remove-faculty-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Roboto', marginBottom: '20px' }}>
          <b>Remove Faculty</b>
        </h2>
        <form onSubmit={this.remove} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Department (e.g., CSE)"
            name="Department"
            value={Department}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Faculty ID"
            name="F_ID"
            value={F_ID}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#f44336', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Remove Faculty
          </button>
        </form>
      </div>
    );
  }
}

