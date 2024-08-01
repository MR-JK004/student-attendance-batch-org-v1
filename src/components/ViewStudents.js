// ViewStudents.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error);
      });
  };

  return (
    <div>
      <h1>View Students</h1>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.name} ({student.email}) - Batches: {student.batches}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewStudents;
