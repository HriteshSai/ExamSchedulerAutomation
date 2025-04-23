import React, { Component, Fragment } from 'react';
import * as Forms from '../forms';
import Navout from '../navout';
import '../pages.css';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      s_form: '',
    };
  }

  renderForm = () => {
    const { s_form } = this.state;
    if (!s_form) {
      return <h2 align="center">Form renders here!</h2>;
    }

    const FormComponent = Forms[s_form];
    return FormComponent ? <FormComponent /> : <h3>Invalid form selected</h3>;
  };

  render() {
    return (
      <Fragment>
        <Navout />
        <div style={{ paddingTop: '70px' }}>
          <h1 style={{ color: '#fff', fontFamily: 'serif', marginLeft: '1%' }}>
            <b>Hello Admin</b>
          </h1>
          <h1
            style={{
              color: 'red',
              fontFamily: 'serif',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            <b>FUNCTIONALITIES</b>
          </h1>

          {/* Form selection buttons */}
          <div style={{ marginTop: '40px', marginLeft: '5%' }}>
            <p
              style={{
                fontFamily: 'sans-serif',
                color: '#0ff517',
                fontSize: '20px',
                marginLeft: '100px',
              }}
            >
              <b>SELECT FORM</b>
            </p>
            {[ 
              { key: 'A', label: 'Student Enrollment form' },
              { key: 'B', label: 'Student Removal form' },
              { key: 'C', label: 'Faculty Enrollment form' },
              { key: 'D', label: 'Faculty Removal form' },
              { key: 'E', label: 'Course Enrollment form' },
              { key: 'F', label: 'Course Removal form' },
              { key: 'FacultySchedule', label: 'Add Faculty Schedule'},
              { key: 'Exam', label: 'Create Examination', red: true },
            ].map(({ key, label, red }) => (
              <div key={key} style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <button
                  className="fbutton"
                  style={red ? { backgroundColor: 'red' } : {}}
                  onClick={() => this.setState({ s_form: key })}
                >
                  {label}
                </button>
              </div>
            ))}
          </div>

          {/* Render selected form */}
          <div
            style={{
              marginTop: '-450px',
              marginLeft: '50%',
              width: '600px',
              backgroundColor: '#fed000',
              color: '#242424',
              borderRadius: '30px',
              fontFamily: 'serif',
              padding: '20px'
            }}
          >
            {this.renderForm()}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Admin;


// import React, { Component,Fragment } from 'react'
// import * as Forms from '../forms'
// import Navout from '../navout'
// import '../pages.css'



// class Admin extends Component {
//  constructor(props) {
//    super(props)
 
//    this.state = {
//      s_form: ''
//    }
//    this.clickHandler=this.clickHandler.bind(this)
//  }
//  clickHandler(){
//     return(
//         <div style={{position:"absolute",top:"30%",left:"3.5%"}}>
//             <p style={{fontFamily:"sans-serif",color:"#0ff517",fontSize:"20px",marginLeft:"100px"}}><b>SELECT FORM</b></p>
//             <div style={{marginLeft:"20px"}}><button className="fbutton" onClick={(e) => {this.setState({s_form: 'A'})}}>Student Enrollment form</button></div>
//             <div style={{marginLeft:"20px"}}><button className="fbutton" onClick={(e) => {this.setState({s_form: 'B'})}}>Student Removal form</button></div>
//             <div style={{marginLeft:"20px"}}><button className="fbutton" onClick={(e) => {this.setState({s_form: 'C'})}}>Faculty Enrollment form</button></div>
//             <div style={{marginLeft:"20px"}}><button className="fbutton" onClick={(e) => {this.setState({s_form: 'D'})}}>Faculty Removal form</button></div>
//             <div style={{marginLeft:"20px"}}><button className="fbutton" onClick={(e) => {this.setState({s_form: 'E'})}}>Course Enrollment form</button></div>
//             <div style={{marginLeft:"20px"}}><button className="fbutton" onClick={(e) => {this.setState({s_form: 'F'})}}>Course Removal form</button></div>
//             <div style={{marginLeft:"20px"}}><button className="fbutton" style={{backgroundColor:"red"}} onClick={(e) => {this.setState({s_form: 'Exam'})}}>Create Examination</button></div>            
//         </div>
//     )
//  }
//  renderform(s_form){
//      if(!s_form)
//      {
//          return(<h2 align="center">Form renders here!</h2>)
//      }
//      const Fm = Forms[s_form];
//      return <Fm />
//  }


//   render() {
//     return (
//      <Fragment>
//          <Navout/>
//          <div>
//          <div>
//          <h1 style={{color:"#fff",fontFamily:"serif",marginLeft:"1%"}}><b>Hello Admin</b></h1>
//             <h1 style={{color:"red",fontFamily:"serif",marginLeft:"40%",position:"absolute",top:"10%"}}><b>FUNCTIONALITIES</b></h1>
//          </div>
//          <section>
//              {this.clickHandler()}
//              <div style={{position:"absolute",right:"5%",top:"30%",width:"600px",backgroundColor:"#fed000",color:"#242424",borderRadius:"30px",fontFamily:"serif"}}>
//                  {}
//                  {this.renderform(this.state.s_form)}
//              </div>
//          </section>
//          </div>
//      </Fragment>
//     )
//   }
// }

// export default Admin;
