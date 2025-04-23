import React, { Component } from 'react';
import Navout from '../navout';
import '../pages.css';
import { auth, db } from '../../firebase';
import { doc, getDoc, query, collection, getDocs } from 'firebase/firestore';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curruser: '',
      fname: '',
      lname: '',
      department: '',
      exams: [],
      error: null,
      loading: true,
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
    const userId = prefix.slice(-10).toUpperCase();
    this.setState({ curruser: userId });

    try {
      const studentInfo = await this.getStudentInfo(userId);
      if (studentInfo) {
        const { fname, lname, department } = studentInfo;
        this.setState({ fname, lname, department, loading: false });
        await this.fetchExams(department);
      }
    } catch (error) {
      console.error('[DEBUG] Error initializing student page:', error.message);
      this.setState({
        error: 'Failed to initialize. Please try again.',
        loading: false,
      });
    }
  }

  async getStudentInfo(userId) {
    console.log('[DEBUG] Fetching student info for S_ID:', userId);
    try {
      const studentsCollectionRef = collection(db, 'Students');
      const graduationYearSnapshot = await getDocs(studentsCollectionRef);

      for (const gradYearDoc of graduationYearSnapshot.docs) {
        const gradYear = gradYearDoc.id;
        const deptCollectionRef = collection(db, 'Students', gradYear);
        const departmentsSnapshot = await getDocs(deptCollectionRef);

        for (const deptDoc of departmentsSnapshot.docs) {
          const dept = deptDoc.id;
          const studentRef = doc(db, 'Students', gradYear, dept, userId);
          console.log('[DEBUG] Querying Path:', studentRef.path);

          const studentSnapshot = await getDoc(studentRef);
          if (studentSnapshot.exists()) {
            const studentData = studentSnapshot.data();
            console.log('[DEBUG] Found student:', studentData);
            return {
              fname: studentData.Fname,
              lname: studentData.Lname,
              department: studentData.Dept,
            };
          }
        }
      }

      console.error('[DEBUG] No matching document found for S_ID:', userId);
      this.setState({ error: 'Student information not found.', loading: false });
      return null;
    } catch (error) {
      console.error('[DEBUG] Error fetching student information:', error.message);
      this.setState({
        error: 'Failed to fetch student information. Please try again later.',
        loading: false,
      });
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
      const exams = querySnapshot.docs.map((doc) => doc.data());
      console.log('[DEBUG] Exams:', exams);
      this.setState({ exams, loading: false });
    } catch (error) {
      this.setState({
        error: 'Failed to fetch exam schedules.',
        loading: false,
      });
      console.error('[DEBUG] Error fetching exams:', error);
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

    return exams.map((exam, index) => (
      <div key={index} style={{ color: 'red', marginLeft: '18%' }}>
        <table>
          <tbody>
            <tr>
              <td>{exam.Course_id}</td>
              <td>{exam.Course_name}</td>
              <td>{exam.Date}</td>
              <td>{exam.Time}</td>
              <td>{exam.Duration}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ));
  }

  render() {
    const { fname, lname, loading, error } = this.state;

    return (
      <div>
        <Navout />
        {loading && (
          <p style={{ marginLeft: '18%', color: 'yellow' }}>Loading...</p>
        )}
        {error && (
          <p style={{ marginLeft: '18%', color: 'red' }}>{error}</p>
        )}
        <div style={{ marginLeft: '1%' }}>
          <h1 style={{ color: '#fff', fontFamily: 'serif' }}>
            <b>Hello {fname} {lname}</b>
          </h1>
        </div>

        <br /><br />

        <h1 style={{ color: '#a9c6b4', fontFamily: 'serif', marginLeft: '39%' }}>
          <b>Upcoming Exams</b>
        </h1>

        <br /><br />

        <table style={{ color: 'yellow', marginLeft: '18%' }}>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
            </tr>
          </thead>
        </table>

        <div>{this.renderExamTable()}</div>
      </div>
    );
  }
}

export default Student;















// import React, { Component } from 'react'
// import Navout from '../navout';
// // import fire from '../firebase'
// import '../pages.css'
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


// class Student extends Component{
//     constructor(props){
//         super(props);
//         this.state={
//             qdata: {},
//             curruser: '',
//             fname:'',
//             lname: ''
//         }
//       this._renderObject=this._renderObject.bind(this);
//       this.uname=this.uname.bind(this);
//       this.head=this.head.bind(this);
//     }
//     componentWillMount() {
//         collection(db, 'Exam')
//           .get()
//           .then(querySnapshot => {
//             const data = querySnapshot.docs.map(doc => doc.data());
//             this.setState({ qdata: data,curruser: fire.auth().currentUser.email.slice(0,16) });
           
//           });
//       }
//       _renderObject(){
//         return Object.keys(this.state.qdata).map((obj) => {
//             if(this.state.qdata[obj].Es_id!=null){
//                 if(this.state.curruser.slice(8,11)==(this.state.qdata[obj].Course_id.slice(2,5).toLowerCase())){
//                     if((Number(this.state.curruser.substr(-3))>=Number(this.state.qdata[obj].Ss_id.substr(-3)))&&
//             (Number(this.state.curruser.substr(-3))<=Number(this.state.qdata[obj].Es_id.substr(-3))))
//             {
//                 return (
//                     <div style={{color:"red",marginLeft:"18%"}}>
//                     <table>
//                         <tr>
//                             <td>{this.state.qdata[obj].Room_no} </td>
//                             <td>{this.state.qdata[obj].Exam_id}</td>
//                             <td>{this.state.qdata[obj].Course_id}</td>
//                             <td>{this.state.qdata[obj].Ss_id} - 
//                             {this.state.qdata[obj].Es_id}</td>
//                             <td>{this.state.qdata[obj].Date}</td>
//                             <td>{this.state.qdata[obj].time}</td>
//                             <td>{this.state.qdata[obj].duration}</td>
//                         </tr>
//                     </table>  
//                     </div>
//                 )
//             }
//                 }
               
//             }          
//         })
//     }
//     uname(){
//         fire.firestore().collection("Student").where("S_ID", "==" , this.state.curruser).get()
//         .then(querySnapshot => {
//             const fn = querySnapshot.docs.map(doc => doc.data().Fname);
//             const ln = querySnapshot.docs.map(doc => doc.data().Lname);
//             this.setState({fname: fn[0],lname: ln[0]}); 
//             this.head();      
//           });
// }
//     head(){
//     return<h1 style={{color:"#fff",fontFamily:"serif"}}><b>Hello {this.state.fname} {this.state.lname}</b></h1>
//     }
//     render(){
        
//         return(
//         <div>
//             <Navout/>
//             {this.uname()}
//         <div style={{marginLeft:"1%"}}>{this.head()}</div><br/><br/>
//         <h1 style={{color:"#a9c6b4",fontFamily:"serif",marginLeft:"39%"}}><b>Upcoming Exams</b></h1><br/><br/>
//             <table style={{color:"yellow",marginLeft:"18%"}}>
//                 <tr>
//                     <th>Room no</th><th>Exam id</th><th>Course_id</th><th>Student roll-nos</th><th>Date</th><th>Time</th><th>Duration</th>
//                 </tr>
//             </table>
//             <div>{this._renderObject()}</div>
//         </div>
//         )
//     }
// }
// export default Student;