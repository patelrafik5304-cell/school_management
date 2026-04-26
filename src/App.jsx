import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
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
        <Route path="/student/gallery" element={<StudentGallery />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

function EntryPage() {
  const navigate = useNavigate();
  
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Prathmik Kumarshala</h1>
          <p className="login-subtitle">Student Attendance Management System</p>
        </div>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={() => navigate('/login?role=admin')} 
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              fontSize: '1rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Admin Login
          </button>
          <button 
            onClick={() => navigate('/login?role=student')} 
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              fontSize: '1rem',
              background: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Student Login
          </button>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
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
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'student'
  const [role, setRole] = useState(initialRole)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'admin' || roleParam === 'student') {
      setRole(roleParam)
    }
  }, [searchParams])

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
    if (!id) {
      console.error('Invalid ID:', id);
      return;
    }
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
                  <th>Password</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>{student.username || '-'}</td>
                    <td>{student.password || '-'}</td>
                    <td><span className="badge badge-success">{student.status || 'Active'}</span></td>
                    <td>
                      <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDelete(student.id)}>Delete</button>
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
    if (!id) {
      console.error('Invalid ID:', id);
      return;
    }
    if (!confirm('Delete this announcement?')) return
    try {
      await db.deleteAnnouncement(id)
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
                <button style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDelete(a._id)}>Delete</button>
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
  const [newImage, setNewImage] = useState({ title: '', description: '', tags: '' })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [viewIndex, setViewIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const data = await db.getAllImages()
      const uniqueIds = new Set()
      const unique = data.filter(img => {
        if (uniqueIds.has(img.id)) return false
        uniqueIds.add(img.id)
        return true
      })
      setImages(unique)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const filteredImages = images
    .filter(img => img.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'az') return a.title.localeCompare(b.title)
      if (sortBy === 'za') return b.title.localeCompare(a.title)
      return 0
    })

  const handleUpload = async (e) => {
    e.preventDefault()
    if (uploading) {
      console.log('Already uploading, ignoring')
      return
    }
    if (!newImage.title || (!selectedFile && !newImage.imageUrl)) {
      alert('Please enter title and select an image')
      return
    }
    
    // Check for duplicate title
    if (images.some(img => img.title?.toLowerCase() === newImage.title.toLowerCase())) {
      alert('An image with this title already exists')
      return
    }
    
    setUploading(true)
    console.log('Upload started:', newImage.title)
    try {
      let imageUrl = newImage.imageUrl
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }
      
      await db.addImage({ 
        title: newImage.title, 
        description: newImage.description, 
        tags: newImage.tags, 
        imageUrl,
        uploadedAt: new Date().toISOString()
      })
      console.log('Saved to database')
      
      // Reset form
      setNewImage({ title: '', description: '', tags: '' })
      setSelectedFile(null)
      setPreviewUrl(null)
      setShowModal(false)
      
      // Reload after delay
      setTimeout(async () => {
        const freshData = await db.getAllImages()
        setImages(freshData)
      }, 300)
      
    } catch (e) {
      console.error('Upload error:', e)
      alert('Upload failed: ' + e.message)
    } finally {
      setUploading(false)
      console.log('Upload finished')
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

  const toggleSelect = (id) => {
    setSelectedImages(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedImages.length} images?`)) return
    try {
      for (const id of selectedImages) {
        await db.deleteImage(id)
      }
      setSelectedImages([])
      fetchImages()
    } catch (e) {
      console.error(e)
    }
  }

  const openLightbox = (index) => {
    setViewIndex(index)
    setSelectedImage(filteredImages[index])
  }

  const navigateLightbox = (direction) => {
    const newIndex = viewIndex + direction
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setViewIndex(newIndex)
      setSelectedImage(filteredImages[newIndex])
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
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search images..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: '1', minWidth: '200px', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }}
          />
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
          {selectedImages.length > 0 && (
            <button onClick={handleBulkDelete} style={{ padding: '0.75rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Delete ({selectedImages.length})
            </button>
          )}
        </div>

        {loading ? <p>Loading...</p> : filteredImages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No images yet</p>
            <p style={{ fontSize: '0.875rem' }}>Upload your first photo to get started</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredImages.map((image, index) => (
              <div 
                key={image.id}
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)' }}
                onClick={() => openLightbox(index)}
              >
                <div style={{ position: 'relative', paddingTop: '75%' }}>
                  <img 
                    src={image.url || image.imageUrl} 
                    alt={image.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1rem'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{ color: 'white', fontWeight: 600 }}>{image.title}</span>
                  </div>
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '0.5rem', 
                      left: '0.5rem',
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      background: selectedImages.includes(image.id) ? '#3b82f6' : 'rgba(255,255,255,0.9)',
                      border: '2px solid #3b82f6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={e => { e.stopPropagation(); toggleSelect(image.id); }}
                  >
                    {selectedImages.includes(image.id) && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                  </div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>{image.title}</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                        {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openLightbox(index); }}
                        style={{ padding: '0.4rem 0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(image.id); }}
                        style={{ padding: '0.4rem 0.75rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); setPreviewUrl(null); }}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '100%' }}>
              <div className="modal-header">
                <h3 className="modal-title">Upload Photo</h3>
                <button className="modal-close" onClick={() => { setShowModal(false); setPreviewUrl(null); }}>×</button>
              </div>
              <form onSubmit={handleUpload}>
                <div 
                  style={{ 
                    border: `2px dashed ${isDragging ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    background: isDragging ? '#eff6ff' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div>
                      <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                      <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</p>
                      <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Drag and drop image here</p>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>or</p>
                      <label style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                        Browse Files
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelect(e.target.files[0])} />
                      </label>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newImage.title} 
                    onChange={e => setNewImage({ ...newImage, title: e.target.value })} 
                    required 
                    placeholder="Enter image title"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input" 
                    value={newImage.description} 
                    onChange={e => setNewImage({ ...newImage, description: e.target.value })} 
                    placeholder="Enter image description"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newImage.tags} 
                    onChange={e => setNewImage({ ...newImage, tags: e.target.value })} 
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Or Image URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={newImage.imageUrl || ''} 
                    onChange={e => setNewImage({ ...newImage, imageUrl: e.target.value })} 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={uploading} style={{ width: '100%', marginTop: '1rem' }}>
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </form>
            </div>
          </div>
        )}

        {selectedImage && (
          <div 
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          >
            <button 
              onClick={() => navigateLightbox(-1)}
              style={{ position: 'absolute', left: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.5rem' }}
            >
              ‹
            </button>
            <div style={{ maxWidth: '90%', maxHeight: '90%', display: 'flex', gap: '2rem' }} onClick={e => e.stopPropagation()}>
              <img 
                src={selectedImage.url || selectedImage.imageUrl} 
                alt={selectedImage.title} 
                style={{ maxWidth: '70vw', maxHeight: '85vh', borderRadius: '12px', objectFit: 'contain' }} 
              />
              <div style={{ width: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', color: 'white' }}>
                <h3 style={{ marginTop: 0 }}>{selectedImage.title}</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{selectedImage.description || 'No description'}</p>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Uploaded: {selectedImage.createdAt ? new Date(selectedImage.createdAt).toLocaleString() : 'Unknown'}</p>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => { handleDelete(selectedImage.id); setSelectedImage(null); }}
                    style={{ padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigateLightbox(1)}
              style={{ position: 'absolute', right: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.5rem' }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StudentDashboard() {
  const studentId = localStorage.getItem('studentId')
  const studentName = localStorage.getItem('studentName') || 'Student'
  const [stats, setStats] = useState({ percentage: 0, present: 0, absent: 0 })
  const [notices, setNotices] = useState(0)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!studentId) return
    try {
      const attendance = await db.getAttendanceByStudent(studentId)
      const present = attendance.filter(a => a.status === 'Present').length
      const absent = attendance.filter(a => a.status === 'Absent').length
      const total = present + absent
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0
      setStats({ percentage, present, absent })

      const allResults = await db.getAllResults()
      setResults(allResults.slice(0, 3))

      const allNotices = await db.getAllAnnouncements()
      setNotices(allNotices.length)
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
          <Link to="/student/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary" onClick={() => { localStorage.clear() }}>Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Welcome, {studentName}!</h1>
        </div>
        {loading ? <p>Loading...</p> : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.percentage}%</div>
            <div className="stat-label">Attendance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.present}</div>
            <div className="stat-label">Days Present</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.absent}</div>
            <div className="stat-label">Days Absent</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{notices}</div>
            <div className="stat-label">Notices</div>
          </div>
        </div>
        )}
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 className="card-header">My Recent Results</h3>
            {results.length === 0 ? <p style={{ padding: '1rem', color: '#64748b' }}>No results yet</p> : results.map(result => (
              <div key={result.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>{result.subject}</span>
                <span className="badge badge-success">{result.marks} ({result.grade})</span>
              </div>
            ))}
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
  const studentId = localStorage.getItem('studentId')
  const [attendanceData, setAttendanceData] = useState({ present: 0, absent: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

const fetchAttendance = async () => {
    if (!studentId) return
    try {
      const allAttendance = await db.getAttendanceByStudent(studentId)
      const present = allAttendance.filter(a => a.status === 'Present').length
      const absent = allAttendance.filter(a => a.status === 'Absent').length
      const total = present + absent
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0
      setAttendanceData({ present, absent, total, percentage })
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
          <Link to="/student/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Attendance</h1>
        </div>
        {loading ? <p>Loading...</p> : (
        <div className="card">
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-value">{attendanceData.percentage || 0}%</div>
              <div className="stat-label">Overall Attendance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{attendanceData.present}</div>
              <div className="stat-label">Days Present</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{attendanceData.absent}</div>
              <div className="stat-label">Days Absent</div>
            </div>
          </div>
        </div>
        )}
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
          <Link to="/student/gallery" className="nav-link">Gallery</Link>
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
          <Link to="/student/gallery" className="nav-link">Gallery</Link>
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

function StudentGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

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

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Prathmik Kumarshala</Link>
        <div className="navbar-nav">
          <Link to="/student" className="nav-link">Dashboard</Link>
          <Link to="/student/attendance" className="nav-link">Attendance</Link>
          <Link to="/student/results" className="nav-link">Results</Link>
          <Link to="/student/announcements" className="nav-link">Notices</Link>
          <Link to="/student/gallery" className="nav-link">Gallery</Link>
          <Link to="/" className="btn btn-secondary" onClick={() => localStorage.clear()}>Logout</Link>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Photo Gallery</h1>
        </div>
        {loading ? <p>Loading...</p> : images.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No images yet</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            {images.map(image => (
              <div 
                key={image.id} 
                onClick={() => setSelectedImage(image)}
                style={{ 
                  width: '280px', 
                  height: '220px', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <img 
                  src={image.url} 
                  alt={image.title} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '0.75rem', background: 'white', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1f2937', textAlign: 'center' }}>{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div style={{ maxWidth: '90%', maxHeight: '90%' }}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} 
            />
            <p style={{ color: 'white', textAlign: 'center', marginTop: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>{selectedImage.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App