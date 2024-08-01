import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard
} from 'mdb-react-ui-kit';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaCalendarAlt } from 'react-icons/fa';
import { Table } from 'react-bootstrap';

const AttendanceReport = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [report, setReport] = useState([]);
  const [readyToDownload, setReadyToDownload] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/batches')
      .then(response => {
        setBatches(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the batches!', error);
      });
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const fetchReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/attendance-report', {
        params: {
          batchId: selectedBatch,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        }
      });
      setReport(response.data);
      setReadyToDownload(true);
    } catch (error) {
      console.error('There was an error fetching the attendance report!', error);
    }
  };

  const convertToCSV = (data) => {
    const header = ['Date', 'Student Name', 'Status', 'Class Taken', 'Class Topic', 'Description'];
    const rows = data.map(entry => [
      entry.date,
      entry.name,
      entry.status ? 'Present' : 'Absent',
      entry.class_taken ? 'Yes' : 'No',
      entry.class_topic,
      entry.class_description
    ]);

    return [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(report);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (readyToDownload) {
      downloadCSV();
      setReadyToDownload(false);
    }
  }, [report]);

  const handleButtonClick = async () => {
    await fetchReport();
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBCard style={{ width: '50%', height: '90%', margin: 'auto' }}>
        <MDBRow>
          <MDBCol col='4' style={{ marginRight: '5%' }} className="mb-5">
            <div className="d-flex flex-column ms-5">
              <div className="text-center">
                <img src="https://easyexamacademy.com/wp-content/uploads/2024/04/Cropped-Logo-Final.png"
                  style={{ width: '450px', height: '100px', margin: '5% 0 6%' }} alt="logo" />
              </div>
              <p style={{ textAlign: 'center' }}>Please Fill the Details !!!</p>

              <Dropdown style={{ margin: '0 0 20%' }}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-toggle-custom'>
                  {selectedBatch ? batches.find(batch => batch.id === selectedBatch)?.name + " -  Class - " + batches.find(batch => batch.id === selectedBatch)?.class + " - " + batches.find(batch => batch.id === selectedBatch)?.subject : 'Select Batch'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {batches.map(batch => (
                    <Dropdown.Item
                      key={batch.id}
                      onClick={() => setSelectedBatch(batch.id)}
                      className='dropdown-item-custom'
                    >
                      {batch.name} - {batch.class} - {batch.subject}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <div className="date-picker-container mb-3">
                <label style={{ marginRight: '5%', marginLeft: '10%', fontSize: '20px' }}>Start Date :   </label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  placeholderText="Select Date"
                  className="form-control custom-date"
                />
                <div className="date-picker-icon">
                  <FaCalendarAlt />
                </div>
              </div>

              <div className="date-picker-container mb-5">
                <label style={{ marginRight: '6%', marginLeft: '10%', fontSize: '20px' }}>End Date :   </label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  placeholderText="Select Date"
                  className="form-control custom-date"
                />
                <div className="date-picker-icon">
                  <FaCalendarAlt />
                </div>
              </div>

              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleButtonClick}>Get Report</MDBBtn>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default AttendanceReport;
