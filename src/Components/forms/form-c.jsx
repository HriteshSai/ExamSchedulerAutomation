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


// export default class Fadd extends Component{
//    constructor(props){
//       super(props);
//       this.state = {
//          F_ID: '',
//          Major: '',
//          Fname: '',
//          Lname: '',
//          Email: '',
//          Password: '',
//        }
//       this.handleChange=this.handleChange.bind(this);
//       this.enroll=this.enroll.bind(this);
//       this.auth=this.auth.bind(this);
//    }
//    handleChange (event) {
//       this.setState({ [event.target.name]: event.target.value});
//    }
//    auth(){
//       fire.auth().createUserWithEmailAndPassword(((this.state.F_ID).concat("@cb.faculties.amrita.edu")), this.state.Password);
//       window.alert("Successful!!");
//    }
//    enroll(event){
//       fire.firestore().collection("Faculty").doc(this.state.F_ID.toString()).set({
//          Email: this.state.Email,
//          Fname: this.state.Fname,
//          Lname: this.state.Lname,
//          Password: this.state.Password,
//          F_ID: this.state.F_ID,
//          Major: this.state.Major
//      })
//      .then(this.auth())
//      .catch(function(error) {
//          window.alert("error" + error);
//      });
//      event.preventDefault();
//     }
//    render(){
//       return(
//          <div>
//          <h3 style={{fontFamily:"Roboto",marginLeft:"20px"}}>
//             <b>FACULTY ENROLLMENT</b>
//          </h3>
//          <form>
         
//          <ul style={{listStyle:"none"}}>
//          <li><div>
//          <input type="text" placeholder="Faculty_id" name="F_ID" onChange={this.handleChange} required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
//          <input type="text" placeholder="Major" name="Major" onChange={this.handleChange} required/>
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
           
    