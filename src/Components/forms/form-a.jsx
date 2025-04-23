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

      await createUserWithEmailAndPassword(auth, `${Fname + S_ID}@students.griet.edu`, Password);

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


// export default class Sadd extends Component{
//    constructor(props){
//       super(props);
//       this.state = {
//          S_ID: '',
//          Semester: '',
//          Fname: '',
//          Lname: '',
//          Email: '',
//          Password: '',
//          Dept: ''
//        }
//       this.handleChange=this.handleChange.bind(this);
//       this.enroll=this.enroll.bind(this);
//       this.auth=this.auth.bind(this);
//    }
//    handleChange (event) {
//       this.setState({ [event.target.name]: event.target.value});
//       this.setState({Dept:this.state.S_ID.slice(8,11)});
//    }
//    auth(){
//       fire.auth().createUserWithEmailAndPassword(((this.state.S_ID).concat("@cb.students.amrita.edu")), this.state.Password);
//       window.alert("Successful!!");
//    }
//    enroll(event){
      
//       fire.firestore().collection("Student").doc(this.state.S_ID.toString()).set({
//          Email: this.state.Email,
//          Fname: this.state.Fname,
//          Lname: this.state.Lname,
//          Password: this.state.Password,
//          S_ID: this.state.S_ID,
//          Semester: this.state.Semester,
//          Dept: this.state.Dept
//      })
//      .then(this.auth())
//      .catch(function(error) {
//          console.error("Error writing document: ", error);
//      });
//      event.preventDefault();
//     }
//    render(){
//       return(
//          <div>
//          <h3 style={{fontFamily:"Roboto",marginLeft:"20px"}}>
//             <b>STUDENT ENROLLMENT</b>
//          </h3>
//          <form>
         
//          <ul style={{listStyle:"none"}}>
//          <li><div>
//          <input type="text" placeholder="Student_id" name="S_ID" onChange={this.handleChange} required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
//          <input type="text" placeholder="Semester" name="Semester" onChange={this.handleChange} required/>
//          </div></li>    
//          <li><div>
//          <input type="text" placeholder="First name" name="Fname" onChange={this.handleChange} required/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
//          <input type="text" placeholder="Lastname" name="Lname" onChange={this.handleChange} required/>
//          </div></li>    
//          <li><div>
//          <input type="text" placeholder="Email" name="Email" onChange={this.handleChange} required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
//          <input type="text" placeholder="Password" name="Password" onChange={this.handleChange} required/>  
//          </div></li>    
//          <li><div>
//          <input type="submit" value="Enroll" onClick={this.enroll}/></div></li>
//          </ul>
        
//         </form>
//         </div>
//  );
//    }
// } 
           
    