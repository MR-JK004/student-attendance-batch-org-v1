import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard
} from 'mdb-react-ui-kit';
import Dropdown from 'react-bootstrap/Dropdown';
import { toast } from 'react-hot-toast';

const LinkStudentBatch = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [batchId, setBatchId] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  const fetchStudents = async () => {
    const response = await axios.get('http://localhost:5000/students');
    setStudents(response.data);
  };

  const fetchBatches = async () => {
    const response = await axios.get('http://localhost:5000/batches');
    setBatches(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/link-student-batch', { studentId, batchId });
    toast.success('Student linked to batch...');
  };

  return (
    <div>
      <MDBContainer className="my-5 gradient-form" >
        <MDBCard style={{ width: '110%', height: '70%', margin: '2% 0 0 50%', paddingRight: '30px' }}>
          <MDBRow>
            <MDBCol col='6' className="mb-5">
              <div className="d-flex flex-column ms-5">
                <div className="text-center">
                  <img src="https://easyexamacademy.com/wp-content/uploads/2024/04/Cropped-Logo-Final.png"
                    style={{ width: '450px', height: '100px', margin: '5% 0 6%' }} alt="logo" />
                </div>
                <p style={{ textAlign: 'center' }}>Please Fill the Details !!!</p>
                <Dropdown className='mb-4' style={{marginTop:'10%'}}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-toggle-custom'>
                  {studentId ? students.find(student => student.id === studentId)?.name : 'Select Student'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {students.map(student => (
                    <Dropdown.Item
                      key={student.id}
                      onClick={() => setStudentId(student.id)}
                      className='dropdown-item-custom'
                    >
                      {student.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

                <Dropdown className='mb-4'>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-toggle-custom'>
                  {batchId ? batches.find(batch => batch.id === batchId)?.name + " -  Class - " + batches.find(batch => batch.id === batchId)?.class + " - " + batches.find(batch => batch.id === batchId)?.subject : 'Select Batch'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {batches.map(batch => (
                    <Dropdown.Item
                      key={batch.id}
                      onClick={() => setBatchId(batch.id)}
                      className='dropdown-item-custom'
                    >
                      {batch.name} - {batch.class} - {batch.subject}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

                <div className="text-center pt-1 mb-5 pb-1">
                  <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleSubmit}>Link Student</MDBBtn>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default LinkStudentBatch;
