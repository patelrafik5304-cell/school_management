import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import './index.css'
import * as db from './lib/db'
import { uploadImage } from './lib/storage'

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

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

function LoginPage() {
  const [role, setRole] = useState('student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please enter username and password')
      return
    }
    setError('')
    
    if (role === 'admin') {
      if (username.toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('userRole', 'admin')
        navigate('/admin')
      } else {
        setError('Invalid admin credentials')
      }
    } else {
      setLoading(true)
      try {
        const student = await db.loginStudent(username, password)
        localStorage.setItem('studentId', student.id)
        localStorage.setItem('studentName', student.name)
        localStorage.setItem('studentClass', student.class)
        localStorage.setItem('userRole', 'student')
        navigate('/student')
      } catch (e) {
        console.error('Login error:', e)
        setError('Invalid username or password')
      } finally {
        setLoading(false)
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
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setRole('admin')}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: 'none', 
              background: role === 'admin' ? '#2563eb' : 'transparent', 
              color: role === 'admin' ? 'white' : '#64748b',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Admin
          </button>
          <button 
            onClick={() => setRole('student')}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: 'none', 
              background: role === 'student' ? '#2563eb' : 'transparent', 
              color: role === 'student' ? 'white' : '#64748b',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
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
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
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
      const students = await db.getAllStudents()
      setStats(prev => ({ ...prev, students: students.length }))
    } catch (e) { console.error(e) }
  }

  const fetchStaffCount = async () => {
    try {
      const staff = await db.getAllStaff()
      setStats(prev => ({ ...prev, staff: staff.length }))
    } catch (e) { console.error(e) }
  }

  const fetchAnnouncements = async () => {
    try {
      const announcements = await db.getAllAnnouncements()
      setAnnouncements(announcements.slice(0, 3))
      setStats(prev => ({ ...prev, announcements: announcements.length }))
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
  const [error, setError] = useState('')
  const [generatedCredentials, setGeneratedCredentials] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const students = await db.getAllStudents()
      setStudents(students)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await db.addStudent(newStudent)
      setGeneratedCredentials({ username: result.username, password: result.password })
      fetchStudents()
      setNewStudent({ name: '', class: '', rollNumber: '' })
    } catch (e) {
      console.error(e)
      setError('Failed to add student')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    try {
      await db.deleteStudent(id)
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
                  <th>Username</th>
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
                    <td>{student.username || '-'}</td>
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
          <div className="modal-overlay" onClick={() => { setShowModal(false); setGeneratedCredentials(null); }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Student</h3>
                <button className="modal-close" onClick={() => { setShowModal(false); setGeneratedCredentials(null); }}>×</button>
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
                {error && <p className="form-error">{error}</p>}
                {generatedCredentials && (
                  <div style={{ background: '#d4edda', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#155724' }}>Login Credentials Generated!</p>
                    <p style={{ margin: '0.5rem 0 0 0' }}>Username: <strong>{generatedCredentials.username}</strong></p>
                    <p style={{ margin: '0.25rem 0 0 0' }}>Password: <strong>{generatedCredentials.password}</strong></p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#155724' }}>Share these with the student</p>
                  </div>
                )}
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
      const data = await db.getAllStudents()
      setStudents(data)

      const attData = await db.getAllAttendance(date)
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
      await db.addAttendance({ studentId, date, status })
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
      const data = await db.getAllResults()
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
      await db.addResult(newResult)
      fetchResults()
      setShowModal(false)
      setNewResult({ studentName: '', studentClass: '', subject: '', marks: '' })
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
      const data = await db.getAllStaff()
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
      const data = await db.getAllAnnouncements()
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
      await db.addAnnouncement(newAnnouncement)
      fetchAnnouncements()
      setShowModal(false)
      setNewAnnouncement({ title: '', content: '', priority: 'Normal' })
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await db.deleteAnnouncement
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newImage, setNewImage] = useState({ title: '', imageUrl: '' })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const data = await db.getAllImages()
      setImages(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!newImage.title || (!selectedFile && !newImage.imageUrl)) {
      alert('Please enter title and select an image')
      return
    }
    setUploading(true)
    try {
      let imageUrl = newImage.imageUrl
      
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }
      
      await db.addImage({ title: newImage.title, imageUrl })
      fetchImages()
      setShowModal(false)
      setNewImage({ title: '', imageUrl: '' })
      setSelectedFile(null)
    } catch (e) {
      console.error(e)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return
    try {
      await db.deleteImage(id)
      fetchImages()
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gallery</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Upload Photo</button>
        </div>
        {loading ? <p>Loading...</p> : images.length === 0 ? (
          <p>No images yet</p>
        ) : (
          <div className="gallery-grid">
            {images.map(image => (
              <div key={image._id} className="gallery-item">
                <img src={image.imageUrl} alt={image.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '0.5rem' }}>
                  <div style={{ color: '#fff', fontSize: '0.875rem' }}>{image.title}</div>
                  <button 
                    className="btn btn-danger" 
                    style={{ marginTop: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => handleDelete(image._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Upload Photo</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newImage.title} 
                    onChange={e => setNewImage({ ...newImage, title: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Choose Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="form-input"
                    onChange={e => setSelectedFile(e.target.files[0])} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Or Image URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={newImage.imageUrl} 
                    onChange={e => setNewImage({ ...newImage, imageUrl: e.target.value })} 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StudentDashboard() {
  const studentName = localStorage.getItem('studentName') || 'Student'
  
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/student" className="nav-link">Dashboard</Link>
          <Link to="/student/attendance" className="nav-link">Attendance</Link>
          <Link to="/student/results" className="nav-link">Results</Link>
          <Link to="/student/announcements" className="nav-link">Notices</Link>
          <Link to="/" className="btn btn-secondary" onClick={() => { localStorage.clear() }}>Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Welcome, {studentName}!</h1>
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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
      const data = await db.getAllAnnouncements()
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
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
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