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


