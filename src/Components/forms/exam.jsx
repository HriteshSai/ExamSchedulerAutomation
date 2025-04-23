import React, { Component } from 'react';
import './forms.css';
import { db } from '../../firebase';
import { collection, query, getDocs, setDoc, doc } from 'firebase/firestore';

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
      schedules: [], // To store fetched exam schedules
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Add a new examination schedule
  addSchedule = async (event) => {
    event.preventDefault();
    const { Course_id, Course_name, Date, Time, Duration, Department } = this.state;

    if (!Course_id || !Course_name || !Date || !Time || !Duration || !Department) {
      alert('All fields are required!');
      return;
    }

    try {
      // Construct Firestore document reference
      const scheduleRef = doc(db, 'Examination_Schedule', Department, 'Courses', Course_id);
      console.log('Firestore Path:', scheduleRef.path); // Debugging Firestore path

      // Add schedule to Firestore
      await setDoc(scheduleRef, {
        Course_id,
        Course_name,
        Date,
        Time,
        Duration,
        Department,
      });

      alert('Examination schedule added successfully!');

      // Clear form fields
      this.setState({
        Course_id: '',
        Course_name: '',
        Date: '',
        Time: '',
        Duration: '',
        Department: '',
      });
    } catch (error) {
      console.error('Error adding schedule:', error.message);
      alert('Failed to add the schedule. Please try again.');
    }
  };

  // Fetch examination schedules filtered by department
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
          <input
            type="text"
            placeholder="Course ID"
            name="Course_id"
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Course Name"
            name="Course_name"
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="date"
            name="Date"
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Time (e.g., 10:00 AM)"
            name="Time"
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g., 3 hours)"
            name="Duration"
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Department"
            name="Department"
            onChange={this.handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Add Schedule
          </button>
          <button type="button" onClick={this.fetchSchedules} style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#fff', color: '#4caf50', border: '2px solid #4caf50', cursor: 'pointer' }}>
            Fetch Schedules
          </button>
        </form>

        {/* Display Schedules */}
        {Department && schedules.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontFamily: 'Roboto', textAlign: 'center' }}>Schedules for Department: {Department}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#4caf50', color: '#fff' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>#</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Course ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Course Name</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Time</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((exam, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exam.Course_id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exam.Course_name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exam.Date}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exam.Time}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exam.Duration}</td>
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
//          E_ID: '',
//          Course_id: '',
//          Ss_id: '',
//          Es_id: '',
//          Fac_inv: '',
//          date:'',
//          class_data:{},
//          stud_data:{},
//          idx: 0,
//          time:"",
//          duration:"",
//          cid_chk:0
//        }
//       this.handleChange=this.handleChange.bind(this);
//       this.cls=this.cls.bind(this);
//       this.check=this.check.bind(this);
//       this.stud=this.stud.bind(this);
//       this.exam=this.exam.bind(this);
//       this.db=this.db.bind(this);
//       this.crs=this.crs.bind(this);
//       this.chk=this.chk.bind(this);
//    }
//    handleChange (event) {
//       this.setState({ [event.target.name]: event.target.value});
//    }
//    stud(){
//     fire.firestore().collection("Student")
//     .get()
//     .then(querySnapshot => {
//     const data = querySnapshot.docs.map(doc => doc.data().S_ID);
//     this.setState({ stud_data: data });
//     console.log(this.state.stud_data);
//     this.check();
//  });

//    }
//    db(room_no){
//     fire.firestore().collection("Exam").doc(this.state.E_ID.toString()).set({
//         Exam_id:this.state.E_ID,
//         Room_no: room_no,
//         Course_id: this.state.Course_id,
//         Ss_id: this.state.Ss_id,
//         Es_id: this.state.Es_id,
//         Date: this.state.date,
//         invigilator: "",
//         time: this.state.time,
//         duration: this.state.duration
//     })
    
//     .catch(function(error) {
//          console.error("Error writing document: ", error);
//      });
//    }
//    exam(room_no,capacity){
//       console.log((this.state.stud_data[(this.state.idx)+capacity-1]));
//       if((this.state.stud_data[(this.state.idx)+capacity-1])==null)
//       {
//          var end = this.state.stud_data.length;
//          this.setState({
//             E_ID:room_no.concat(this.state.Course_id),
//             Ss_id:this.state.stud_data[this.state.idx],
//             Es_id:this.state.stud_data[end-1],
//             idx:end-1
//         })


//       }
//       else{
//          this.setState({
//             E_ID:room_no.concat(this.state.Course_id),
//             Ss_id:this.state.stud_data[this.state.idx],
//             Es_id:this.state.stud_data[(this.state.idx)+capacity-1],
//             idx:(this.state.idx+capacity)            
//         })
//    }
      
//    this.db(room_no); 
//    }
//    check(){
    
//         this.state.class_data.map((item) =>
//         this.exam(item.Room_no,item.Capacity)
//         )
//         window.alert("Exam created");
//     }

//    cls(){
//     fire.firestore().collection("class")
//          .get()
//       .then(querySnapshot => {
//         const data = querySnapshot.docs.map(doc => doc.data());
//         this.setState({ class_data: data });
//         console.log(this.state.class_data);
//         this.stud();
        
//       });   
//    }

//    crs(event){
//       fire.firestore().collection("Course")
//          .get()
//       .then(querySnapshot => {
//         const data = querySnapshot.docs.map(doc => doc.data().Course_id);
//         data.map((cid) =>
//         this.chk(cid)
//         )
//         if(this.state.cid_chk==0){
//            window.alert("Course doesn't exist");
//         }
//         else this.setState({cid_chk:0})
//       });

//       event.preventDefault();
//    }
//    chk(cid){
//       if(cid==this.state.Course_id){
//          this.cls();
//          this.setState({cid_chk:1})
//       }
//   }

//    render(){
//       return(
//          <div>
//          <h3 style={{fontFamily:"Roboto",marginLeft:"20px"}}>
//             <b>EXAM DETAILS</b>
//          </h3>
//          <form>
         
//          <ul style={{listStyle:"none"}}>
//          <li><div>
//          <input type="text" placeholder="Course_id" name="Course_id" onChange={this.handleChange} required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
//          <input type="text" placeholder="date" name="date" onChange={this.handleChange} required/>
//          </div></li> 
//          <li><div>
//          <input type="text" placeholder="time" name="time" onChange={this.handleChange} required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
//          <input type="text" placeholder="duration" name="duration" onChange={this.handleChange} required/>
//          </div></li>       
//          <li><div>
//          <input type="submit" value="Enroll" onClick={this.crs}/></div></li>
//          </ul>
        
//         </form>
//         </div>
//  );
//    }
// } 
       