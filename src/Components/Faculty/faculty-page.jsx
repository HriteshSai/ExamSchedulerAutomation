import React, { Component } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where,  addDoc, updateDoc } from 'firebase/firestore';
import Navout from '../navout';

class FacultyInvigilationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facultyID: '',
      facultyName: '',
      facultyDepartment: '',
      invigilationSchedule: [],
      facultySchedule: [],
      availableExams: [],
      error: null,
      loading: true,
      refreshing: false,
    };
  }

  async componentDidMount() {
    try {
      await this.initializeComponent();
    } catch (error) {
      console.error('[ERROR] Error in component initialization:', error);
      this.setState({ 
        error: 'Failed to initialize the page. Please refresh and try again.',
        loading: false 
      });
    }
  }

  async initializeComponent() {
    const user = auth.currentUser;
    if (!user) {
      this.setState({ error: 'User not logged in.', loading: false });
      return;
    }

    const email = user.email;
    const atIndex = email.indexOf('@');

    if (atIndex < 5) {
      this.setState({ error: 'Invalid faculty email.', loading: false });
      return;
    }

    const facultyID = email.substring(atIndex - 5, atIndex).toUpperCase(); 
    console.log('[DEBUG] Extracted Faculty ID:', facultyID);

    this.setState({ facultyID });

    // Load faculty details
    await this.fetchFacultyInfo(facultyID);
    
    // Fetch all exams from the database
    const allExams = await this.fetchAllExams();
    
    // Get exams that this faculty can invigilate (based on availability)
    const availableExams = this.findAvailableExams(allExams);
    
    // Get exams already assigned to this faculty
    const assignedExams = await this.fetchAssignedInvigilation(facultyID);
    
    this.setState({ 
      availableExams, 
      invigilationSchedule: assignedExams,
      loading: false 
    });
  }

  async fetchFacultyInfo(facultyID) {
    try {
      const facultyQuery = query(
        collection(db, 'facultySchedules'),
        where('facultyID', '==', facultyID)
      );
      const facultySnapshot = await getDocs(facultyQuery);

      if (facultySnapshot.empty) {
        console.warn('[WARNING] No faculty info found for ID:', facultyID);
        return;
      }

      let facultyData = null;
      facultySnapshot.forEach((doc) => {
        facultyData = { ...doc.data(), docId: doc.id };
      });

      if (facultyData) {
        this.setState({ 
          facultyName: facultyData.facultyName || 'Unknown Faculty',
          facultyDepartment: facultyData.department || 'Unknown Department',
          facultySchedule: facultyData.schedule || [],
          facultyDocId: facultyData.docId
        });
        console.log('[DEBUG] Faculty info loaded:', facultyData);
      }
    } catch (error) {
      console.error('[ERROR] Failed to fetch faculty info:', error);
      throw error;
    }
  }
  
  async fetchAllExams() {
    try {
      console.log('[DEBUG] Fetching all exams from database');
      let allExams = [];
      
      // Try first approach - from Examination_Schedule collection
      const examCollectionRef = collection(db, 'Examination_Schedule');
      const departmentsSnapshot = await getDocs(examCollectionRef);
      
      if (!departmentsSnapshot.empty) {
        for (const departmentDoc of departmentsSnapshot.docs) {
          const departmentId = departmentDoc.id;
          console.log('[DEBUG] Processing department:', departmentId);
          
          const coursesRef = collection(db, 'Examination_Schedule', departmentId, 'Courses');
          const coursesSnapshot = await getDocs(coursesRef);
          
          coursesSnapshot.forEach((doc) => {
            allExams.push({
              ...doc.data(), 
              id: doc.id, 
              examId: `${departmentId}-${doc.id}`,
              Department: departmentId
            });
          });
        }
      }
      
      // Try second approach - direct Exams collection if no results from first approach
      if (allExams.length === 0) {
        const allExamsQuery = collection(db, 'Exams');
        const allExamsSnapshot = await getDocs(allExamsQuery);
        
        allExamsSnapshot.forEach((doc) => {
          allExams.push({
            ...doc.data(), 
            id: doc.id,
            examId: doc.id
          });
        });
      }
      
      console.log('[DEBUG] Total exams fetched:', allExams.length);
      return allExams;
    } catch (error) {
      console.error('[ERROR] Failed to fetch exams:', error);
      throw error;
    }
  }
  
  findAvailableExams(allExams) {
    const { facultySchedule } = this.state;
    
    // Filter exams based on faculty availability
    const availableExams = allExams.filter((exam) => {
      if (!exam.Date || !exam.Time) return false;
      
      const examDate = new Date(exam.Date);
      const examDay = examDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Check if faculty is FREE during this exam time
      // A faculty is free if they DON'T have any scheduled classes that overlap with the exam time
      const isFacultyFree = !facultySchedule.some(slot => 
        slot.day === examDay && this.isTimeOverlapping(slot.timeSlot, exam.Time)
      );
      
      return isFacultyFree;
    });
    
    console.log('[DEBUG] Available exams for invigilation:', availableExams.length);
    return availableExams;
  }
  
  async fetchAssignedInvigilation(facultyID) {
    try {
      console.log('[DEBUG] Fetching assigned invigilation duties');
      
      // Check if there's a collection for invigilation assignments
      const assignmentsQuery = query(
        collection(db, 'InvigilationAssignments'),
        where('facultyID', '==', facultyID)
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      
      let assignedExams = [];
      
      if (!assignmentsSnapshot.empty) {
        // Get the assignments document
        const assignmentDoc = assignmentsSnapshot.docs[0];
        const assignments = assignmentDoc.data().assignments || [];
        
        // Fetch the full exam details for each assigned exam ID
        const allExams = await this.fetchAllExams();
        
        assignedExams = assignments.map(assignmentId => {
          const exam = allExams.find(e => e.examId === assignmentId || e.id === assignmentId);
          return exam || { id: assignmentId, Course_name: 'Unknown Course', Date: 'Unknown', Time: 'Unknown' };
        }).filter(e => e);
      }
      
      console.log('[DEBUG] Assigned invigilation duties:', assignedExams.length);
      return assignedExams;
    } catch (error) {
      console.error('[ERROR] Failed to fetch assigned invigilation duties:', error);
      return [];
    }
  }
  
  async assignExamToFaculty(exam) {
    try {
      this.setState({ refreshing: true });
      const { facultyID } = this.state;
      
      // Check if there's already an assignment doc for this faculty
      const assignmentsQuery = query(
        collection(db, 'InvigilationAssignments'),
        where('facultyID', '==', facultyID)
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      
      if (assignmentsSnapshot.empty) {
        // Create a new assignment document
        await addDoc(collection(db, 'InvigilationAssignments'), {
          facultyID,
          assignments: [exam.examId || exam.id]
        });
      } else {
        // Update existing assignment document
        const assignmentDoc = assignmentsSnapshot.docs[0];
        const currentAssignments = assignmentDoc.data().assignments || [];
        
        if (!currentAssignments.includes(exam.examId || exam.id)) {
          await updateDoc(assignmentDoc.ref, {
            assignments: [...currentAssignments, exam.examId || exam.id]
          });
        }
      }
      
      // Refresh the component
      await this.initializeComponent();
      this.setState({ refreshing: false });
    } catch (error) {
      console.error('[ERROR] Failed to assign exam:', error);
      this.setState({ 
        error: 'Failed to assign the exam. Please try again.',
        refreshing: false 
      });
    }
  }
  
  async unassignExam(exam) {
    try {
      this.setState({ refreshing: true });
      const { facultyID } = this.state;
      
      // Find the assignment doc for this faculty
      const assignmentsQuery = query(
        collection(db, 'InvigilationAssignments'),
        where('facultyID', '==', facultyID)
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      
      if (!assignmentsSnapshot.empty) {
        const assignmentDoc = assignmentsSnapshot.docs[0];
        const currentAssignments = assignmentDoc.data().assignments || [];
        
        // Remove the exam from assignments
        const updatedAssignments = currentAssignments.filter(
          id => id !== exam.examId && id !== exam.id
        );
        
        await updateDoc(assignmentDoc.ref, {
          assignments: updatedAssignments
        });
      }
      
      // Refresh the component
      await this.initializeComponent();
      this.setState({ refreshing: false });
    } catch (error) {
      console.error('[ERROR] Failed to unassign exam:', error);
      this.setState({ 
        error: 'Failed to remove the assignment. Please try again.',
        refreshing: false 
      });
    }
  }

  // Helper function to check if two time slots overlap
  // Improved time parsing functions for FacultyInvigilationPage class

// Convert time string like "9:00 AM - 12:00 PM" to minutes since midnight
timeRangeToMinutes(timeRange) {
  if (!timeRange) {
    console.warn('[WARNING] Undefined or null timeRange provided');
    return [0, 0]; // Default safe values
  }
  
  try {
    // Make sure we have a string
    const timeStr = String(timeRange);
    const [startStr, endStr] = timeStr.split(' - ');
    
    if (!startStr || !endStr) {
      console.warn('[WARNING] Invalid time range format:', timeRange);
      return [0, 0];
    }
    
    return [this.timeToMinutes(startStr), this.timeToMinutes(endStr)];
  } catch (err) {
    console.error('[ERROR] Failed to parse time range:', timeRange, err);
    return [0, 0];
  }
}

// Convert time string like "9:00 AM" to minutes since midnight
timeToMinutes(timeStr) {
  if (!timeStr) {
    console.warn('[WARNING] Undefined or null timeStr provided');
    return 0; // Default safe value
  }
  
  try {
    // Make sure we have a string
    const time = String(timeStr).trim();
    
    // Handle different time formats
    if (time.includes('AM') || time.includes('PM')) {
      // Format: "9:00 AM" or "12:00 PM"
      const [timePart, period] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return hours * 60 + (minutes || 0);
    } else if (time.includes(':')) {
      // Format: "9:00" or "14:30" (24-hour)
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + (minutes || 0);
    } else {
      // Unknown format, log warning
      console.warn('[WARNING] Unknown time format:', timeStr);
      return 0;
    }
  } catch (err) {
    console.error('[ERROR] Failed to parse time string:', timeStr, err);
    return 0;
  }
}

// Helper function to check if two time slots overlap
isTimeOverlapping(facultySlot, examTime) {
  if (!facultySlot || !examTime) {
    return false; // No overlap if either slot is undefined
  }
  
  try {
    // Convert time strings to minutes since midnight for easier comparison
    const [facultyStart, facultyEnd] = this.timeRangeToMinutes(facultySlot);
    const [examStart, examEnd] = this.timeRangeToMinutes(examTime);
    
    // Check for overlap
    return !(facultyEnd <= examStart || facultyStart >= examEnd);
  } catch (error) {
    console.error('[ERROR] Error checking time overlap:', error);
    return true; // Assume overlap if there's an error (safer approach)
  }
}
  
  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  }

  renderExamTable() {
    const { 
      invigilationSchedule, 
      facultyName, 
      facultyID, 
      facultyDepartment,
      facultySchedule, 
      availableExams,
      refreshing,
      error
    } = this.state;

    return (
      <div className="faculty-schedule" style={{ padding: '20px' }}>
        <Navout />
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            marginBottom: '20px',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        {refreshing && (
          <div style={{ 
            textAlign: 'center', 
            padding: '10px',
            marginBottom: '20px' 
          }}>
            Updating assignments...
          </div>
        )}
        
        <div className="faculty-info" style={{ 
          backgroundColor: '#e9ecef', 
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px' 
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Faculty Invigilation Portal</h2>
          <p style={{ margin: '0' }}>
            <strong>ID:</strong> {facultyID} | 
            <strong> Name:</strong> {facultyName} | 
            <strong> Department:</strong> {facultyDepartment}
          </p>
        </div>
        
        {/* Display faculty's regular schedule */}
        <div className="faculty-busy-times" style={{ marginBottom: '30px' }}>
          <h3>Your Regular Schedule (Busy Times)</h3>
          {facultySchedule.length === 0 ? (
            <p>No schedule information available.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#dc3545', color: '#fff' }}>
                  <th style={{ padding: '8px' }}>Day</th>
                  <th style={{ padding: '8px' }}>Time Slot</th>
                </tr>
              </thead>
              <tbody>
                {facultySchedule.map((slot, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffeeee' : '#fff' }}>
                    <td style={{ padding: '8px' }}>{slot.day}</td>
                    <td style={{ padding: '8px' }}>{slot.timeSlot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Display invigilation duties */}
        <div className="invigilation-duties" style={{ marginBottom: '30px' }}>
          <h3>Your Assigned Invigilation Duties</h3>
          {invigilationSchedule.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No Invigilation Duties Assigned! 🎉</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                  <th style={{ padding: '8px' }}>Course Name</th>
                  <th style={{ padding: '8px' }}>Department</th>
                  <th style={{ padding: '8px' }}>Date</th>
                  <th style={{ padding: '8px' }}>Time</th>
                  <th style={{ padding: '8px' }}>Duration</th>
                  <th style={{ padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invigilationSchedule.map((exam, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                    <td style={{ padding: '8px' }}>{exam.Course_name || 'N/A'}</td>
                    <td style={{ padding: '8px' }}>{exam.Department || 'N/A'}</td>
                    <td style={{ padding: '8px' }}>{this.formatDate(exam.Date)}</td>
                    <td style={{ padding: '8px' }}>{exam.Time || 'N/A'}</td>
                    <td style={{ padding: '8px' }}>{exam.Duration || 'N/A'}</td>
                    <td style={{ padding: '8px' }}>
                      <button 
                        onClick={() => this.unassignExam(exam)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Available exams that faculty can invigilate */}
        <div className="available-exams">
          <h3>Available Exams For Invigilation</h3>
          {availableExams.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No available exams found that match your schedule.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#28a745', color: '#fff' }}>
                  <th style={{ padding: '8px' }}>Course Name</th>
                  <th style={{ padding: '8px' }}>Department</th>
                  <th style={{ padding: '8px' }}>Date</th>
                  <th style={{ padding: '8px' }}>Time</th>
                  <th style={{ padding: '8px' }}>Duration</th>
                  <th style={{ padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableExams
                  .filter(exam => !invigilationSchedule.some(ie => 
                    (ie.examId && ie.examId === exam.examId) || (ie.id && ie.id === exam.id)))
                  .map((exam, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f9f0' : '#ffffff' }}>
                      <td style={{ padding: '8px' }}>{exam.Course_name || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>{exam.Department || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>{this.formatDate(exam.Date)}</td>
                      <td style={{ padding: '8px' }}>{exam.Time || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>{exam.Duration || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>
                        <button 
                          onClick={() => this.assignExamToFaculty(exam)}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Assign to Me
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { loading } = this.state;
    
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading your Invigilation Schedule...</p>
        </div>
      );
    }
    
    return this.renderExamTable();
  }
}

export default FacultyInvigilationPage;



