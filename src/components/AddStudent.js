import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { toast } from 'react-hot-toast';

function AddStudent() {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    batchId: ''
  });
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/batches')
      .then(response => {
        setBatches(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the batches!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/add-student', student)
      .then(response => {
        toast.success("Student added Successfully");
      })
      .catch(error => {
        toast.error("There was an error adding the student!",error);
      });
  };

  return (
    <MDBContainer className="my-5 gradient-form" >
      <MDBCard style={{ width: '80%', height: '81%', margin: '2% 0 0 10%' }}>
        <MDBRow>
          <MDBCol col='6' className="mb-5">
            <div className="d-flex flex-column ms-5">
              <div className="text-center">
                <img src="https://easyexamacademy.com/wp-content/uploads/2024/04/Cropped-Logo-Final.png"
                  style={{ width: '450px', height: '100px', margin: '5% 0 6%' }} alt="logo" />
              </div>
              <p style={{ textAlign: 'center' }}>Please Fill the Details !!!</p>
              <MDBInput wrapperClass='mb-4' label='Name' id='form2' type='text' name='name' value={student.name} onChange={handleChange} />
              <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' name='email' value={student.email} onChange={handleChange} />
              <Dropdown style={{ margin: '0 0 38%' }}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-toggle-custom'>
                  {student.batchId ? batches.find(batch => batch.id === student.batchId)?.name : 'Select Batch'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {batches.map(batch => (
                    <Dropdown.Item key={batch.id} onClick={() => setStudent({ ...student, batchId: batch.id })} className='dropdown-item-custom'>
                      {batch.name} - {batch.class} - {batch.subject}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleSubmit}>Add Student</MDBBtn>
              </div>
            </div>
          </MDBCol>
          <MDBCol col='6' className="mb-5">
            <div className="d-flex flex-column justify-content-center mb-4" style={{ height: '93.5%', backgroundColor: '#FE7219' }}>
              <div className="text-white" style={{ margin: '0 0 20% 22%' }}>
                <h4 className="mb-4">Empowering Your Minds,<br />Inspiring Futures !</h4>
                <p className="medium mb-2">Education is not Learning of Facts<br /> But the Training of Mind to Think
                </p>
                <p className="medium mb-0" style={{ marginLeft: '50%' }}>-Albert Einstein
                </p>
              </div>
              <div className="text-white" style={{ margin: '0 0 0 22%' }}>
                <h4 className="mb-4">Unlocking Potential,<br />Creating Tomorrow's Leaders!</h4>
                <p className="medium mb-2">Education is the Most Powerful Weapon <br /> Which You can Use to Change the World.
                </p>
                <p className="medium mb-0" style={{ marginLeft: '50%' }}>-Dr. A.P.J.Abdul Kalam
                </p>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default AddStudent;