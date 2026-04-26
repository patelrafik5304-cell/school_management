import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/attendance" element={<AttendanceManagement />} />
        <Route path="/admin/results" element={<ResultsManagement />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/gallery" element={<GalleryManagement />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<MyAttendance />} />
        <Route path="/student/results" element={<MyResults />} />
        <Route path="/student/announcements" element={<StudentAnnouncements />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

function EntryPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Prathmik Kumarshala</h1>
          <p className="login-subtitle">Student Attendance Management System</p>
        </div>
        <div className="grid" style={{ gap: '1rem', marginTop: '1.5rem' }}>
          <Link to="/login?role=admin" className="btn btn-primary login-btn">
            Admin Login
          </Link>
          <Link to="/login?role=student" className="btn btn-secondary login-btn">
            Student Login
          </Link>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            Welcome to Prathmik Kumarshala - Primary School Management System
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  const [role, setRole] = useState('student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please enter username and password')
      return
    }
    if (role === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        navigate('/admin')
      } else {
        setError('Invalid credentials for admin')
      }
    } else {
      if (username === 'student' && password === 'student123') {
        navigate('/student')
      } else {
        setError('Invalid credentials for student')
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Prathmik Kumarshala</h1>
          <p className="login-subtitle">Sign in to continue</p>
        </div>
        
        <div className="role-tabs">
          <button 
            className={`role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <button 
            className={`role-tab ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username / Mobile / Email</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary login-btn">
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/students" className="nav-link">Students</Link>
          <Link to="/admin/attendance" className="nav-link">Attendance</Link>
          <Link to="/admin/results" className="nav-link">Results</Link>
          <Link to="/admin/staff" className="nav-link">Staff</Link>
          <Link to="/admin/announcements" className="nav-link">Notices</Link>
          <Link to="/admin/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">150</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">12</div>
            <div className="stat-label">Total Staff</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">95%</div>
            <div className="stat-label">Today's Attendance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">3</div>
            <div className="stat-label">New Announcements</div>
          </div>
        </div>
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 className="card-header">Recent Announcements</h3>
            <div className="announcement-card">
              <div className="announcement-date">April 25, 2026</div>
              <div className="announcement-title">School will remain closed tomorrow</div>
              <p>Due to heavy rainfall, school will remain closed tomorrow.</p>
            </div>
            <div className="announcement-card">
              <div className="announcement-date">April 24, 2026</div>
              <div className="announcement-title">Annual Exam Schedule</div>
              <p>Annual exams will start from May 1st, 2026.</p>
            </div>
          </div>
          <div className="card">
            <h3 className="card-header">Quick Actions</h3>
            <div className="grid" style={{ gap: '1rem' }}>
              <Link to="/admin/students" className="btn btn-primary">Manage Students</Link>
              <Link to="/admin/attendance" className="btn btn-primary">Mark Attendance</Link>
              <Link to="/admin/announcements" className="btn btn-primary">Post Announcement</Link>
              <Link to="/admin/gallery" className="btn btn-secondary">Upload Photos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentManagement() {
  const students = [
    { id: 1, name: 'Rahul Sharma', class: 'Class 5', roll: '01', status: 'Active' },
    { id: 2, name: 'Priya Patel', class: 'Class 5', roll: '02', status: 'Active' },
    { id: 3, name: 'Amit Kumar', class: 'Class 4', roll: '01', status: 'Active' },
    { id: 4, name: 'Sita Devi', class: 'Class 4', roll: '02', status: 'Active' },
    { id: 5, name: 'Raj Gupta', class: 'Class 3', roll: '01', status: 'Active' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/students" className="nav-link">Students</Link>
          <Link to="/admin/attendance" className="nav-link">Attendance</Link>
          <Link to="/admin/results" className="nav-link">Results</Link>
          <Link to="/admin/staff" className="nav-link">Staff</Link>
          <Link to="/admin/announcements" className="nav-link">Notices</Link>
          <Link to="/admin/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Student Management</h1>
          <button className="btn btn-primary">+ Add Student</button>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Class</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.roll}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td><span className="badge badge-success">{student.status}</span></td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AttendanceManagement() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const students = [
    { id: 1, name: 'Rahul Sharma', class: 'Class 5', roll: '01', present: true },
    { id: 2, name: 'Priya Patel', class: 'Class 5', roll: '02', present: true },
    { id: 3, name: 'Amit Kumar', class: 'Class 4', roll: '01', present: false },
    { id: 4, name: 'Sita Devi', class: 'Class 4', roll: '02', present: true },
    { id: 5, name: 'Raj Gupta', class: 'Class 3', roll: '01', present: true },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/students" className="nav-link">Students</Link>
          <Link to="/admin/attendance" className="nav-link">Attendance</Link>
          <Link to="/admin/results" className="nav-link">Results</Link>
          <Link to="/admin/staff" className="nav-link">Staff</Link>
          <Link to="/admin/announcements" className="nav-link">Notices</Link>
          <Link to="/admin/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Attendance Management</h1>
        </div>
        <div className="card">
          <div className="form-group">
            <label className="form-label">Select Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Class</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.roll}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>
                    <span className={`badge ${student.present ? 'badge-success' : 'badge-danger'}`}>
                      {student.present ? 'Present' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ResultsManagement() {
  const results = [
    { id: 1, name: 'Rahul Sharma', class: 'Class 5', subject: 'Mathematics', marks: 85, grade: 'A' },
    { id: 2, name: 'Priya Patel', class: 'Class 5', subject: 'Mathematics', marks: 90, grade: 'A+' },
    { id: 3, name: 'Amit Kumar', class: 'Class 4', subject: 'Mathematics', marks: 78, grade: 'B+' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/students" className="nav-link">Students</Link>
          <Link to="/admin/attendance" className="nav-link">Attendance</Link>
          <Link to="/admin/results" className="nav-link">Results</Link>
          <Link to="/admin/staff" className="nav-link">Staff</Link>
          <Link to="/admin/announcements" className="nav-link">Notices</Link>
          <Link to="/admin/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Results Management</h1>
          <button className="btn btn-primary">+ Add Result</button>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id}>
                  <td>{result.name}</td>
                  <td>{result.class}</td>
                  <td>{result.subject}</td>
                  <td>{result.marks}</td>
                  <td><span className="badge badge-success">{result.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StaffManagement() {
  const staff = [
    { id: 1, name: 'Mr. Ramesh Singh', role: 'Principal', experience: '15 years' },
    { id: 2, name: 'Mrs. Sunita Devi', role: 'Mathematics Teacher', experience: '10 years' },
    { id: 3, name: 'Mr. Ajay Kumar', role: 'English Teacher', experience: '8 years' },
    { id: 4, name: 'Mrs. Pinki Sharma', role: 'Science Teacher', experience: '5 years' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/students" className="nav-link">Students</Link>
          <Link to="/admin/attendance" className="nav-link">Attendance</Link>
          <Link to="/admin/results" className="nav-link">Results</Link>
          <Link to="/admin/staff" className="nav-link">Staff</Link>
          <Link to="/admin/announcements" className="nav-link">Notices</Link>
          <Link to="/admin/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Staff Management</h1>
          <button className="btn btn-primary">+ Add Staff</button>
        </div>
        <div className="grid grid-4">
          {staff.map(member => (
            <div key={member.id} className="card staff-card">
              <div className="staff-avatar">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="staff-name">{member.name}</div>
              <div className="staff-role">{member.role}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                {member.experience}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Announcements() {
  const announcements = [
    { id: 1, title: 'School will remain closed tomorrow', date: 'April 25, 2026', content: 'Due to heavy rainfall, school will remain closed tomorrow.' },
    { id: 2, title: 'Annual Exam Schedule', date: 'April 24, 2026', content: 'Annual exams will start from May 1st, 2026.' },
    { id: 3, title: 'Parent Teacher Meeting', date: 'April 20, 2026', content: 'Parent teacher meeting will be held on April 28th, 2026.' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/students" className="nav-link">Students</Link>
          <Link to="/admin/attendance" className="nav-link">Attendance</Link>
          <Link to="/admin/results" className="nav-link">Results</Link>
          <Link to="/admin/staff" className="nav-link">Staff</Link>
          <Link to="/admin/announcements" className="nav-link">Notices</Link>
          <Link to="/admin/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Announcements</h1>
          <button className="btn btn-primary">+ Post New</button>
        </div>
        <div className="grid" style={{ gap: '1rem' }}>
          {announcements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-date">{announcement.date}</div>
              <div className="announcement-title">{announcement.title}</div>
              <p>{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GalleryManagement() {
  const images = [
    { id: 1, title: 'Annual Day Celebration', date: 'April 20, 2026' },
    { id: 2, title: 'Sports Day', date: 'April 15, 2026' },
    { id: 3, title: 'Science Exhibition', date: 'April 10, 2026' },
    { id: 4, title: 'Drawing Competition', date: 'April 5, 2026' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/students" className="nav-link">Students</Link>
          <Link to="/admin/attendance" className="nav-link">Attendance</Link>
          <Link to="/admin/results" className="nav-link">Results</Link>
          <Link to="/admin/staff" className="nav-link">Staff</Link>
          <Link to="/admin/announcements" className="nav-link">Notices</Link>
          <Link to="/admin/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gallery</h1>
          <button className="btn btn-primary">+ Upload Photo</button>
        </div>
        <div className="gallery-grid">
          {images.map(image => (
            <div key={image.id} className="gallery-item">
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-light)'
              }}>
                {image.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StudentDashboard() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/student" className="nav-link">Dashboard</Link>
          <Link to="/student/attendance" className="nav-link">Attendance</Link>
          <Link to="/student/results" className="nav-link">Results</Link>
          <Link to="/student/announcements" className="nav-link">Notices</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Welcome, Rahul!</h1>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">95%</div>
            <div className="stat-label">Attendance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">A+</div>
            <div className="stat-label">Grade</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">3</div>
            <div className="stat-label">Notices</div>
          </div>
        </div>
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 className="card-header">My Recent Results</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>Mathematics</span>
              <span className="badge badge-success">85 (A)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>English</span>
              <span className="badge badge-success">78 (B+)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Science</span>
              <span className="badge badge-success">92 (A+)</span>
            </div>
          </div>
          <div className="card">
            <h3 className="card-header">Quick Links</h3>
            <div className="grid" style={{ gap: '1rem' }}>
              <Link to="/student/attendance" className="btn btn-primary">View Attendance</Link>
              <Link to="/student/results" className="btn btn-primary">View Results</Link>
              <Link to="/student/announcements" className="btn btn-secondary">View Notices</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MyAttendance() {
  const attendance = [
    { id: 1, date: 'April 26, 2026', status: 'Present' },
    { id: 2, date: 'April 25, 2026', status: 'Present' },
    { id: 3, date: 'April 24, 2026', status: 'Present' },
    { id: 4, date: 'April 23, 2026', status: 'Absent' },
    { id: 5, date: 'April 22, 2026', status: 'Present' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/student" className="nav-link">Dashboard</Link>
          <Link to="/student/attendance" className="nav-link">Attendance</Link>
          <Link to="/student/results" className="nav-link">Results</Link>
          <Link to="/student/announcements" className="nav-link">Notices</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Attendance</h1>
        </div>
        <div className="card">
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-value">95%</div>
              <div className="stat-label">Overall Attendance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">19</div>
              <div className="stat-label">Days Present</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1</div>
              <div className="stat-label">Days Absent</div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>
                    <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MyResults() {
  const results = [
    { id: 1, subject: 'Mathematics', marks: 85, grade: 'A', maxMarks: 100 },
    { id: 2, subject: 'English', marks: 78, grade: 'B+', maxMarks: 100 },
    { id: 3, subject: 'Science', marks: 92, grade: 'A+', maxMarks: 100 },
    { id: 4, subject: 'Hindi', marks: 88, grade: 'A', maxMarks: 100 },
    { id: 5, subject: 'Mathematics (Half Yearly)', marks: 90, grade: 'A+', maxMarks: 100 },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/student" className="nav-link">Dashboard</Link>
          <Link to="/student/attendance" className="nav-link">Attendance</Link>
          <Link to="/student/results" className="nav-link">Results</Link>
          <Link to="/student/announcements" className="nav-link">Notices</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Results</h1>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Max Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id}>
                  <td>{result.subject}</td>
                  <td>{result.marks}</td>
                  <td>{result.maxMarks}</td>
                  <td><span className="badge badge-success">{result.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StudentAnnouncements() {
  const announcements = [
    { id: 1, title: 'School will remain closed tomorrow', date: 'April 25, 2026', content: 'Due to heavy rainfall, school will remain closed tomorrow.' },
    { id: 2, title: 'Annual Exam Schedule', date: 'April 24, 2026', content: 'Annual exams will start from May 1st, 2026.' },
    { id: 3, title: 'Parent Teacher Meeting', date: 'April 20, 2026', content: 'Parent teacher meeting will be held on April 28th, 2026.' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/student" className="nav-link">Dashboard</Link>
          <Link to="/student/attendance" className="nav-link">Attendance</Link>
          <Link to="/student/results" className="nav-link">Results</Link>
          <Link to="/student/announcements" className="nav-link">Notices</Link>
          <Link to="/" className="btn btn-secondary">Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Announcements</h1>
        </div>
        <div className="grid" style={{ gap: '1rem' }}>
          {announcements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-date">{announcement.date}</div>
              <div className="announcement-title">{announcement.title}</div>
              <p>{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App