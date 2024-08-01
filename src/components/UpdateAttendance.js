import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBTextArea
} from 'mdb-react-ui-kit';

const UpdateAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [classTaken, setClassTaken] = useState(false);
  const [classTopic, setClassTopic] = useState('');
  const [classDescription, setClassDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/batches')
      .then(response => {
        setBatches(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the batches!', error);
      });
  }, []);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleBatchChange = e => {
    setSelectedBatch(e.target.value);
  };

  const handleSelect = (eventKey) => {
    handleBatchChange({ target: { value: eventKey } });
  };

  useEffect(() => {
    if (selectedBatch && selectedDate) {
      fetchStudents(selectedBatch, selectedDate);
      fetchClassTakenStatus(selectedBatch, selectedDate);
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedBatch, selectedDate]);
  
  const fetchStudents = (batchId, date) => {
    const formattedDate = formatDate(date);
    axios.get(`http://localhost:5000/batch-students/${batchId}?date=${formattedDate}`)
      .then(response => {
        const students = response.data;
        console.log('Fetched Students:', students);
        setStudents(students);
        if (students.length > 0) {
          const initialAttendance = students.reduce((acc, student) => {
            acc[student.id] = student.status || false;
            return acc;
          }, {});
          console.log('Initial Attendance:', initialAttendance);
          setAttendance(initialAttendance);
        } else {
          setAttendance({});
        }
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setStudents([]);
        setAttendance({});
      });
  };
  

  const fetchClassTakenStatus = (batchId, date) => {
    const formattedDate = formatDate(date);
    axios.get(`http://localhost:5000/class-status/${batchId}?date=${formattedDate}`)
      .then(response => {
        setClassTaken(response.data.classTaken);
      })
      .catch(error => {
        console.error('Error fetching class status:', error);
        setClassTaken(false);
      });
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prevState => ({
      ...prevState,
      [studentId]: status,
    }));
  };
  

  const handleSubmit = () => {
    const formattedDate = formatDate(selectedDate);
    console.log('Submitting attendance:', attendance);
    axios.post('http://localhost:5000/update-attendance', {
      batchId: selectedBatch,
      date: formattedDate,
      attendance,
      classTaken,
      classTopic,
      classDescription,
    })
      .then(response => {
        toast.success(response.data.message);
        resetForm();
      })
      .catch(error => {
        toast.error('There was an error updating the attendance!', error);
      });
  };

  const resetForm = () => {
    setSelectedBatch('');
    setSelectedDate(new Date());
    setStudents([]);
    setAttendance({});
    setClassTaken(false);
    setClassTopic('');
    setClassDescription('');
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
      <MDBContainer className="my-5 gradient-form">
        <MDBRow>
          <MDBCol md="7">
            <MDBCard style={{ width: '85%', height: '90%', margin: '2% auto' }}>
              <MDBRow>
                <MDBCol className="mb-5" style={{ marginRight: '5%' }}>
                  <div className="d-flex flex-column ms-5">
                    <div className="text-center">
                      <img src="https://easyexamacademy.com/wp-content/uploads/2024/04/Cropped-Logo-Final.png"
                        style={{ width: '450px', height: '100px', margin: '5% 0 6%' }} alt="logo" />
                    </div>
                    <p style={{ textAlign: 'center' }}>Please Fill the Details !!!</p>

                    <Dropdown style={{ margin: '0 0 6%' }}>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-toggle-custom'>
                        {selectedBatch ? batches.find(batch => batch.id === selectedBatch).name + "   Class-" + batches.find(batch => batch.id === selectedBatch).class + "    -   " + batches.find(batch => batch.id === selectedBatch).subject : "Select a batch"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {batches.map(batch => (
                          <Dropdown.Item key={batch.id} onClick={() => handleSelect(batch.id)} className='dropdown-item-custom'>
                            {batch.name} - {batch.class} - {batch.subject}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <div className="input-container mb-3">
                      <div className="date-picker-container">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          placeholderText="Select Date"
                          className="form-control custom-date"
                        />
                        <div className="date-picker-icon">
                          <FaCalendarAlt />
                        </div>
                      </div>

                      <div className="toggle-container">
                        <label className="toggle-label">
                          <span>Class Taken</span>
                          <label className="toggle-switch">
                            <input type="checkbox" id="toggle" checked={classTaken} onChange={(e) => setClassTaken(e.target.checked)} />
                            <span className="slider"></span>
                          </label>
                        </label>
                      </div>
                    </div>

                    <MDBInput wrapperClass='mb-4 custom-width' label='Class Topic' id='form2' type='text' value={classTopic} onChange={(e) => setClassTopic(e.target.value)} />
                    <MDBTextArea
                      wrapperClass='mb-3'
                      label='Description'
                      rows={3}
                      style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                      value={classDescription}
                      onChange={(e) => setClassDescription(e.target.value)}
                    />
                    <div className="text-center pt-1 mb-5 pb-1">
                      <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleSubmit}>Update Attendance</MDBBtn>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>

          <MDBCol md="5">
            <MDBCard className='students-list' style={{ height: 'auto', margin: '3% 10% 0 0' }}>
              {students.length > 0 && (
                <div>
                  <h4 style={{ textAlign: 'center', margin: '2%' }}>Attendance for {formatDate(selectedDate)}</h4>
                  <ul className="attendance-list" style={{ maxHeight: '580px', overflowY: 'auto' }}>
                    {students.map(student => (
                      <li className="attendance-item" key={student.id}>
                        <span className="student-name">{student.name}</span>
                        <div className="toggle-container2">
                          <label className="toggle-switch2">
                            <input
                              type="checkbox"
                              id="toggle"
                              checked={attendance[student.id] || false}
                              onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                            />
                            <span className="slider2"></span>
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
  );
};

export default UpdateAttendance;
