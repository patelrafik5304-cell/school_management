import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import './index.css'

const API_URL = '';

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
  const [stats, setStats] = useState({ students: 0, staff: 0, announcements: 0, attendance: 0 })
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    fetchStudentsCount()
    fetchStaffCount()
    fetchAnnouncements()
  }, [])

  const fetchStudentsCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students`)
      const data = await res.json()
      setStats(prev => ({ ...prev, students: data.length }))
    } catch (e) { console.error(e) }
  }

  const fetchStaffCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/staff`)
      const data = await res.json()
      setStats(prev => ({ ...prev, staff: data.length }))
    } catch (e) { console.error(e) }
  }

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_URL}/api/announcements`)
      const data = await res.json()
      setAnnouncements(data.slice(0, 3))
      setStats(prev => ({ ...prev, announcements: data.length }))
    } catch (e) { console.error(e) }
  }

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
            <div className="stat-value">{stats.students}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.staff}</div>
            <div className="stat-label">Total Staff</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.attendance}%</div>
            <div className="stat-label">Attendance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.announcements}</div>
            <div className="stat-label">Announcements</div>
          </div>
        </div>
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 className="card-header">Recent Announcements</h3>
            {announcements.length === 0 ? (
              <p>No announcements yet</p>
            ) : (
              announcements.map(a => (
                <div key={a._id} className="announcement-card">
                  <div className="announcement-date">{new Date(a.date).toLocaleDateString()}</div>
                  <div className="announcement-title">{a.title}</div>
                  <p>{a.content}</p>
                </div>
              ))
            )}
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
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', class: '', rollNumber: '' })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students`)
      const data = await res.json()
      setStudents(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      })
      if (res.ok) {
        fetchStudents()
        setShowModal(false)
        setNewStudent({ name: '', class: '', rollNumber: '' })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    try {
      await fetch(`${API_URL}/api/students?id=${id}`, { method: 'DELETE' })
      fetchStudents()
    } catch (e) {
      console.error(e)
    }
  }

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
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Student</button>
        </div>
        <div className="card">
          {loading ? <p>Loading...</p> : students.length === 0 ? (
            <p>No students found</p>
          ) : (
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
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td><span className="badge badge-success">{student.status || 'Active'}</span></td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(student._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Student</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddStudent}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStudent.name}
                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStudent.class}
                    onChange={e => setNewStudent({ ...newStudent, class: e.target.value })}
                    placeholder="Class 1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newStudent.rollNumber}
                    onChange={e => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add Student</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AttendanceManagement() {
  const [students, setStudents] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [date])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/students`)
      const data = await res.json()
      setStudents(data)

      const attRes = await fetch(`${API_URL}/api/attendance?date=${date}`)
      const attData = await attRes.json()
      const attMap = {}
      attData.forEach(a => { attMap[a.studentId] = a.status })
      setAttendance(attMap)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (studentId, status) => {
    try {
      await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, date, status })
      })
      setAttendance(prev => ({ ...prev, [studentId]: status }))
    } catch (e) {
      console.error(e)
    }
  }

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
          {loading ? <p>Loading...</p> : (
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
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>
                      <button
                        className={`btn ${attendance[student._id] === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ marginRight: '0.5rem' }}
                        onClick={() => markAttendance(student._id, 'Present')}
                      >
                        Present
                      </button>
                      <button
                        className={`btn ${attendance[student._id] === 'Absent' ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => markAttendance(student._id, 'Absent')}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultsManagement() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newResult, setNewResult] = useState({ studentName: '', studentClass: '', subject: '', marks: '' })

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const res = await fetch(`${API_URL}/api/results`)
      const data = await res.json()
      setResults(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddResult = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResult)
      })
      if (res.ok) {
        fetchResults()
        setShowModal(false)
        setNewResult({ studentName: '', studentClass: '', subject: '', marks: '' })
      }
    } catch (e) {
      console.error(e)
    }
  }

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
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Result</button>
        </div>
        <div className="card">
          {loading ? <p>Loading...</p> : results.length === 0 ? (
            <p>No results found</p>
          ) : (
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
                  <tr key={result._id}>
                    <td>{result.studentName}</td>
                    <td>{result.studentClass}</td>
                    <td>{result.subject}</td>
                    <td>{result.marks}/{result.maxMarks}</td>
                    <td><span className="badge badge-success">{getGrade(result.marks)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Result</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddResult}>
                <div className="form-group">
                  <label className="form-label">Student Name</label>
                  <input type="text" className="form-input" value={newResult.studentName} onChange={e => setNewResult({ ...newResult, studentName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <input type="text" className="form-input" value={newResult.studentClass} onChange={e => setNewResult({ ...newResult, studentClass: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-input" value={newResult.subject} onChange={e => setNewResult({ ...newResult, subject: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Marks</label>
                  <input type="number" className="form-input" value={newResult.marks} onChange={e => setNewResult({ ...newResult, marks: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Result</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getGrade(marks) {
  if (marks >= 90) return 'A+'
  if (marks >= 80) return 'A'
  if (marks >= 70) return 'B+'
  if (marks >= 60) return 'B'
  if (marks >= 50) return 'C'
  return 'D'
}

function StaffManagement() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_URL}/api/staff`)
      const data = await res.json()
      setStaff(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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
        </div>
        {loading ? <p>Loading...</p> : staff.length === 0 ? (
          <p>No staff found</p>
        ) : (
          <div className="grid grid-4">
            {staff.map(member => (
              <div key={member._id} className="card staff-card">
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
        )}
      </div>
    </div>
  )
}

function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'Normal' })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_URL}/api/announcements`)
      const data = await res.json()
      setAnnouncements(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      })
      if (res.ok) {
        fetchAnnouncements()
        setShowModal(false)
        setNewAnnouncement({ title: '', content: '', priority: 'Normal' })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await fetch(`${API_URL}/api/announcements?id=${id}`, { method: 'DELETE' })
      fetchAnnouncements()
    } catch (e) {
      console.error(e)
    }
  }

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
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Post New</button>
        </div>
        {loading ? <p>Loading...</p> : announcements.length === 0 ? (
          <p>No announcements yet</p>
        ) : (
          <div className="grid" style={{ gap: '1rem' }}>
            {announcements.map(a => (
              <div key={a._id} className="announcement-card">
                <div className="announcement-date">{new Date(a.date).toLocaleDateString()}</div>
                <div className="announcement-title">{a.title}</div>
                <p>{a.content}</p>
                <button className="btn btn-danger" style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(a._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Post New Announcement</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handlePost}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-input" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-input" rows="4" value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary">Post</button>
              </form>
            </div>
          </div>
        )}
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
              <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
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
        </div>
      </div>
    </div>
  )
}

function MyResults() {
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
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Mathematics</td><td>85</td><td><span className="badge badge-success">A</span></td></tr>
              <tr><td>English</td><td>78</td><td><span className="badge badge-success">B+</span></td></tr>
              <tr><td>Science</td><td>92</td><td><span className="badge badge-success">A+</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_URL}/api/announcements`)
      const data = await res.json()
      setAnnouncements(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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
        {loading ? <p>Loading...</p> : announcements.length === 0 ? (
          <p>No announcements</p>
        ) : (
          <div className="grid" style={{ gap: '1rem' }}>
            {announcements.map(a => (
              <div key={a._id} className="announcement-card">
                <div className="announcement-date">{new Date(a.date).toLocaleDateString()}</div>
                <div className="announcement-title">{a.title}</div>
                <p>{a.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App