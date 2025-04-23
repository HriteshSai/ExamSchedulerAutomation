import React, { Component } from 'react';
import './forms.css';
import { db } from '../../firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';

export default class Cdel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GraduationYear: '', // Graduation Year (e.g., 2023-2027)
      Year: '',           // Academic Year (e.g., 2023)
      Semester: '',       // Semester (e.g., Semester1)
      Course_ID: '',      // Course ID (e.g., CSE101)
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  remove = async (event) => {
    event.preventDefault();

    const { GraduationYear, Year, Semester, Course_ID } = this.state;

    if (!GraduationYear || !Year || !Semester || !Course_ID) {
      alert('Please fill all the required fields.');
      return;
    }

    try {
      const courseRef = doc(
        db,
        'Courses',       // Collection for courses
        Year,            // Document for Academic Year
        Semester,        // Collection for semesters
        Course_ID        // Document for the course
      );

      const courseSnap = await getDoc(courseRef);
      if (!courseSnap.exists()) {
        alert(`No course found with ID: ${Course_ID} in ${Semester}, Year: ${Year}, Graduation Year: ${GraduationYear}`);
        return;
      }

      await deleteDoc(courseRef);
      alert(`Course with ID: ${Course_ID} has been removed.`);

      this.setState({
        GraduationYear: '',
        Year: '',
        Semester: '',
        Course_ID: '',
      });
    } catch (error) {
      console.error('Error removing course: ', error);
      alert('Failed to remove the course. Please try again.');
    }
  };

  render() {
    return (
      <div className="remove-course-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Roboto', marginBottom: '20px' }}>
          <b>Remove Course</b>
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
            placeholder="Academic Year (e.g., 2023)"
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
            placeholder="Course ID"
            name="Course_ID"
            value={this.state.Course_ID}
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#f44336', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Delete Course
          </button>
        </form>
      </div>
    );
  }
}








// import React, { Component } from 'react'
// import './forms.css'
// // import fire from '../firebase'
// import { auth, db } from '../firebase';
// import {
//   getDocs,
//   collection,
//   setDoc,
//   doc,
//   query,
//   where
// } from 'firebase/firestore';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // if needed

// export default class Fdel extends Component{
//    constructor(props){
//       super(props);
//       this.state = {
//          Course_ID: ''
//       }
//       this.handleChange=this.handleChange.bind(this);
//       this.remove=this.remove.bind(this);
//    }
//    handleChange(event){
//       this.setState({
//          Course_ID : event.target.value
//       });
          
//    }
//    remove(event){
//       fire.firestore().collection("2019-2023").doc("Semester1").collection("Course").doc(this.state.Course_ID.toString()).delete()
//       .then(
//          window.alert((this.state.Course_ID.toString()).concat(" is removed!"))
//       )
//       event.preventDefault();
//    }
//    render(){
//       return(
//          <div>
//          <h3 style={{fontFamily:"Roboto",marginLeft:"20px"}}>
//             <b>REMOVE COURSE</b>
//          </h3>
//          <form>
//          <div><input type="text" placeholder="Course_id" style={{marginLeft:"30px"}} onChange={this.handleChange} required/></div>
        
//          <div><input type="submit" value="Delete" style={{marginBottom:"20px"}} onClick={this.remove}/></div>
        
        
//         </form>
//         </div>
//       )
//    }
// }