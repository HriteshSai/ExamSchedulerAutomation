import React, { useState } from 'react';
import { db } from '../../firebase'; // Firebase Firestore instance
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

function FacultyScheduleForm() {
  const [schedule, setSchedule] = useState([]);
  const [formInput, setFormInput] = useState({
    facultyName: '',
    facultyID: '',
    department: '',
    day: 'Monday',
    timeSlot: '',
    activity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    setSchedule((prevSchedule) => [...prevSchedule, formInput]);

    // Clear form inputs for new entries
    setFormInput({
      ...formInput,
      day: 'Monday',
      timeSlot: '',
      activity: '',
    });
  };

  const validateFacultyID = async (facultyID, department) => {
    try {
      console.log('Validating Faculty ID:', facultyID, 'in Department:', department);

      // Access the faculty document based on hierarchical structure
      const facultyDoc = doc(db, 'Faculties', department, facultyID, 'Info');
      const docSnap = await getDoc(facultyDoc);

      if (!docSnap.exists()) {
        throw new Error('Faculty ID does not exist in the specified department.');
      }

      console.log('Faculty document data:', docSnap.data());
    } catch (error) {
      console.error('Validation error:', error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate Faculty ID before saving schedule
      await validateFacultyID(formInput.facultyID, formInput.department);

      await addDoc(collection(db, 'facultySchedules'), {
        facultyID: formInput.facultyID,
        facultyName: formInput.facultyName,
        department: formInput.department,
        schedule,
      });

      alert('Schedule added successfully!');
      setSchedule([]); // Clear schedule after submission
      setFormInput({
        facultyName: '',
        facultyID: '',
        department: '',
        day: 'Monday',
        timeSlot: '',
        activity: '',
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="schedule-form-container">
      <h2>Add Faculty Schedule</h2>
      <form onSubmit={handleAddSchedule}>
        <input
          type="text"
          name="facultyName"
          value={formInput.facultyName}
          onChange={handleChange}
          placeholder="Faculty Name"
          required
        />
        <input
          type="text"
          name="facultyID"
          value={formInput.facultyID}
          onChange={handleChange}
          placeholder="Faculty ID"
          required
        />
        <input
          type="text"
          name="department"
          value={formInput.department}
          onChange={handleChange}
          placeholder="Department"
          required
        />
        <select name="day" value={formInput.day} onChange={handleChange} required>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>
        <input
          type="text"
          name="timeSlot"
          value={formInput.timeSlot}
          onChange={handleChange}
          placeholder="Time Slot (e.g., 9:00 AM - 10:00 AM)"
          required
        />
        <input
          type="text"
          name="activity"
          value={formInput.activity}
          onChange={handleChange}
          placeholder="Task/Activity"
          required
        />
        <button type="submit">Add to Schedule</button>
      </form>

      {/* Display the Added Schedule */}
      <div className="schedule-display">
        <h3>Current Schedule</h3>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time Slot</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.timeSlot}</td>
                <td>{item.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Final Schedule */}
      {schedule.length > 0 && (
        <button onClick={handleSubmit} className="submit-schedule-button">
          Submit Final Schedule
        </button>
      )}
    </div>
  );
}

export default FacultyScheduleForm;


