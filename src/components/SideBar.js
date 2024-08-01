import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const sidebarStyle = {
    backgroundColor: '#ff7217', // Replace with your desired color
  };
  return (
    // Enclose everything in a single parent element
    <div >
      {/* <!-- Sidebar --> */}
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

        {/* <!-- Sidebar - Brand --> */}
        <a className="sidebar-brand d-flex align-items-center justify-content-center" style={sidebarStyle} href="index.html">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">EEA Admin <sup>2</sup></div>
        </a>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className="nav-item active">
          <Link to='/' className="nav-link" href="index.html">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">
          Interface
        </div>

        {/* <!-- Nav Item - Pages Collapse Menu --> */}
        <li className="nav-item">
          <Link to='/add-student' className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
            aria-expanded="true" aria-controls="collapseTwo">
            <i className="fas fa-fw fa-cog"></i>
            <span>Add Student</span>
          </Link>
          <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Custom Components:</h6>
              <a className="collapse-item" href="buttons.html">Buttons</a>
              <a className="collapse-item" href="cards.html">Cards</a>
            </div>
          </div>
        </li>

        {/* <!-- Nav Item - Utilities Collapse Menu --> //to='/view-user'*/}
        <li className="nav-item">
          <Link to="/update-attendance" className="nav-link collapsed" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
            <i className="fas fa-fw fa-wrench"></i>
            <span>Update Attendance</span>
          </Link>         
        </li>

        <li className="nav-item">
            <Link to="/attendance-report" className="nav-link collapsed">
                <i className="fas fa-fw fa-chart-area"></i>
                <span>Attendance Report</span>
            </Link>
        </li>

        <li className="nav-item">
          <Link to="/manage-batches" className="nav-link collapsed">
            <i className="fas fa-fw fa-wrench"></i>
            <span>Manage Batches</span>
          </Link>         
        </li>
        <li className="nav-item">
          <Link to="/link-student-batch" className="nav-link collapsed">
            <i className="fas fa-fw fa-wrench"></i>
            <span>Link Student to Batch</span>
          </Link>         
        </li>

        

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />
      </ul>
      {/* <!-- End of Sidebar --> */}
    </div>
  );
}

export default SideBar;
