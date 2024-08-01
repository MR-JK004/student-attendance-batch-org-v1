import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddStudent from './components/AddStudent';
import UpdateAttendance from './components/UpdateAttendance';
import SideBar from './components/SideBar';
import './index.css';
import AttendanceReport from './components/AttendanceReport';

import ManageBatches from './components/ManageBatches';
import LinkStudentBatch from './components/LinkStudentBatch';

const App = () => {
  return (<>
      <div id="wrapper">
      
        <BrowserRouter>
        <SideBar />
              <Routes>
                <Route path="/" element={<AddStudent />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/update-attendance" element={<UpdateAttendance />} />
                <Route path="/attendance-report" element={<AttendanceReport />} />
                <Route path="/manage-batches" element={<ManageBatches />} />
                <Route path="/link-student-batch" element={<LinkStudentBatch />} />
              </Routes>
        </BrowserRouter>

      </div>
    </>
    
  );
};

export default App;
