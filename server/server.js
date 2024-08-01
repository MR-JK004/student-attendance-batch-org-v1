const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cj69',
  database: 'attendance_system'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

app.post('/add-batch', (req, res) => {
  const { name, class: className, subject, faculty } = req.body;
  const sql = 'INSERT INTO batches (name, class, subject, faculty) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, className, subject, faculty], (err, result) => {
    if (err) throw err;
    res.status(201).send('Batch added...');
  });
});

app.get('/batches', (req, res) => {
  const sql = 'SELECT * FROM batches';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/batches/:batchId/students', (req, res) => {
  const { batchId } = req.params;
  const sql = `
    SELECT s.id, s.name, s.email
    FROM students s
    INNER JOIN batch_students bs ON s.id = bs.student_id
    WHERE bs.batch_id = ?
  `;
  db.query(sql, [batchId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put('/update-batch/:id', (req, res) => {
  const { name, class:className, subject, faculty } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE batches SET name = ?, class = ?, subject = ?, faculty = ? WHERE id = ?';
  db.query(sql, [name, className, subject, faculty, id], (err, result) => {
    if (err) throw err;
    res.status(201).send('Batch updated...');
  });
});

app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/attendance', (req, res) => {
  const { date, attendance, batchId } = req.body;
  attendance.forEach(record => {
    const sql = 'INSERT INTO attendance (student_id, date, status, batch_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [record.studentId, date, record.status, batchId], (err, result) => {
      if (err) throw err;
    });
  });
  res.send('Attendance recorded...');
});

app.delete('/delete-batch/:id', async (req, res) => {
  const { id } = req.params;

  const sqlDeleteBatchStudents = 'DELETE FROM batch_students WHERE batch_id = ?';
  db.query(sqlDeleteBatchStudents, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    const sqlDeleteBatch = 'DELETE FROM batches WHERE id = ?';
    db.query(sqlDeleteBatch, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      res.status(200).send('Batch deleted...');
    });
  });
});



app.post('/link-student-batch', (req, res) => {
  const { studentId, batchId } = req.body;
  const sql = 'INSERT INTO batch_students (student_id, batch_id) VALUES (?, ?)';
  db.query(sql, [studentId, batchId], (err, result) => {
    if (err) throw err;
    res.send('Student linked to batch...');
  });
});

app.post('/add-student', (req, res) => {
  const { name, email, batchId } = req.body;
  const sql = 'INSERT INTO students (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) throw err;
    const studentId = result.insertId;
    const sql2 = 'INSERT INTO batch_students (student_id, batch_id) VALUES (?, ?)';
    db.query(sql2, [studentId, batchId], (err, result) => {
      if (err) throw err;
      res.send('Student added...');
    });
  });
});

app.get('/attendance-report', (req, res) => {
  const { batchId, startDate, endDate } = req.query;

  const sql = `
    SELECT a.date, s.name, a.status, a.class_taken, a.class_topic, a.class_description
    FROM attendance a
    JOIN batch_students bs ON a.student_id = bs.student_id
    JOIN students s ON s.id = a.student_id
    WHERE bs.batch_id = ? AND a.date BETWEEN ? AND ?
  `;

  db.query(sql, [batchId, startDate, endDate], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.get('/batch-students/:batchId', (req, res) => {
  const { batchId } = req.params;
  const { date } = req.query;

  const sql = `
    SELECT s.id, s.name, a.status
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ?
    JOIN batch_students bs ON s.id = bs.student_id
    WHERE bs.batch_id = ?
  `;

  db.query(sql, [date, batchId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.post('/update-attendance', (req, res) => {
  const { batchId, date, attendance, classTaken, classTopic, classDescription } = req.body;

  const attendanceData = Object.keys(attendance).map(studentId => ({
    student_id: studentId,
    batch_id: batchId,
    date,
    status: attendance[studentId] ? 1 : 0,
  }));

  console.log('Attendance Data:', attendanceData);

  const sqlDelete = 'DELETE FROM attendance WHERE batch_id = ? AND date = ?';
  db.query(sqlDelete, [batchId, date], (err, result) => {
    if (err) {
      console.error('Error deleting previous attendance records:', err);
      res.status(500).send('Server error');
      return;
    }

    const sqlInsert = 'INSERT INTO attendance (student_id, batch_id, date, status, class_taken, class_topic, class_description) VALUES ?';
    const values = attendanceData.map(row => [
      row.student_id, row.batch_id, row.date, row.status, classTaken ? 1 : 0, classTopic, classDescription
    ]);

    console.log('Insert Values:', values);

    db.query(sqlInsert, [values], (err, result) => {
      if (err) {
        console.error('Error inserting attendance records:', err);
        res.status(500).send('Server error');
        return;
      }
      res.send({ message: 'Attendance updated successfully' });
    });
  });
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
