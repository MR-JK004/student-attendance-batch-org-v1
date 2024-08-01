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
import { Table} from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-hot-toast';


const ManageBatches = () => {
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState({ name: '', class: '', subject: '', faculty: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const response = await axios.get('http://localhost:5000/batches');
    setBatches(response.data);
  };

  const handleChange = (e) => {
    setBatch({ ...batch, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const response = await axios.put(`http://localhost:5000/update-batch/${editId}`, batch);
      setIsEditing(false);
      setEditId(null);
      if(response.status === 201){
         toast.success("Batch Updated Successfully");
      }
      else{
        toast.error("Failed to Update Batch");
      }
    } else {
      const response = await axios.post('http://localhost:5000/add-batch', batch);
      if(response.status === 201){
        toast.success("Batch Added Successfully");
      }
      else{
        toast.error("Failed to Add Batch");
      }
    }
    setBatch({ name: '', class: '', subject: '', faculty: '' });
    fetchBatches();
  };

  const handleEdit = (batch) => {
    setIsEditing(true);
    setEditId(batch.id);
    setBatch(batch);
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(`http://localhost:5000/delete-batch/${id}`);
    if(response.status === 200){
      toast.success("Batch Deleted Successfully", {
        position: toast.POSITION.TOP_CENTER
      });
    }
    else{
      toast.error("Failed to Delete Batch");}

    fetchBatches();
  };

  return (
    <div style={{marginLeft:'7%'}}>
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol md="7">
          <MDBCard style={{ width: '100%', height: '90%', margin: '2% auto' }}>
            <MDBRow>
              <MDBCol className="mb-5" style={{ marginRight: '5%' }}>
                <div className="d-flex flex-column ms-5">
                  <div className="text-center">
                    <img src="https://easyexamacademy.com/wp-content/uploads/2024/04/Cropped-Logo-Final.png"
                      style={{ width: '450px', height: '100px', margin: '5% 0 6%' }} alt="logo" />
                  </div>
                  <p style={{ textAlign: 'center' }}>Please Fill the Details !!!</p>

                  <MDBInput wrapperClass='mb-4' label='Batch Name' id='form1' type='text' name='name' value={batch.name} onChange={handleChange}/>
              <MDBInput wrapperClass='mb-4' label='Class' id='form2' type='text' name='class' value={batch.class} onChange={handleChange}/>
              <MDBInput wrapperClass='mb-4' label='Subject' id='form3' type='text' name='subject' value={batch.subject} onChange={handleChange}/>
              <MDBInput wrapperClass='mb-4' label='Faculty' id='form4' type='text' name='faculty' value={batch.faculty} onChange={handleChange}/>
              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleSubmit}>{isEditing?'Update Batch':'Add Batch'}</MDBBtn>
              </div>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>

        <MDBCol md="5">
        <div>
      <div className="table-wrapper" style={{ marginTop: '20px' }}>
          <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto', width: '150%' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((e, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.name}</td>
                    <td>
                      <div>{e.class}</div>
                    </td>
                    <td>{e.subject}</td>
                    <td>{e.faculty}</td>
                    <td>
                      <EditIcon onClick={() => handleEdit(e)} style={{ cursor: 'pointer' }} /> &nbsp;&nbsp;
                      <DeleteIcon onClick={() => handleDelete(e.id)} style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </div>
  );
};

export default ManageBatches;
