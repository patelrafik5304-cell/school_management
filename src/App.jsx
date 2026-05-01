import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.css'
import PieChart3D from './components/PieChart3D'

// Anime.js loaded globally from CDN
const anime = window.anime

let dbApiPromise
let storageApiPromise

function getDbApi() {
  if (!dbApiPromise) dbApiPromise = import('./lib/db')
  return dbApiPromise
}

function getStorageApi() {
  if (!storageApiPromise) storageApiPromise = import('./lib/storage')
  return storageApiPromise
}

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  )
}

function AppNavbar({ variant = 'admin' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAdmin = variant === 'admin'
  const isTeacher = variant === 'teacher'
  const links = isTeacher
    ? [
        { to: '/admin/results', label: 'Results' },
      ]
    : isAdmin
    ? [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/students', label: 'Students' },
        { to: '/admin/attendance', label: 'Attendance' },
        { to: '/admin/results', label: 'Results' },
        { to: '/admin/staff', label: 'Staff' },
        { to: '/admin/announcements', label: 'Notices' },
        { to: '/admin/gallery', label: 'Gallery' },
      ]
    : [
        { to: '/student', label: 'Dashboard' },
        { to: '/student/attendance', label: 'Attendance' },
        { to: '/student/results', label: 'Results' },
        { to: '/student/announcements', label: 'Notices' },
        { to: '/student/gallery', label: 'Gallery' },
      ]

  const closeMenu = () => setIsMenuOpen(false)
  const handleLogout = (event) => {
    const shouldLogout = window.confirm('Are you sure you want to logout?')

    if (!shouldLogout) {
      event.preventDefault()
      return
    }

    localStorage.clear()
    closeMenu()
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>PRATHMIK KUMARSHALA DEVLA</Link>
      <button
        className={`menu-button${isMenuOpen ? ' active' : ''}`}
        type="button"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(open => !open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`navbar-nav${isMenuOpen ? ' open' : ''}`}>
        {links.map(link => (
          <Link key={link.to} to={link.to} className="nav-link" onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
        <Link to="/" className="btn btn-secondary" onClick={handleLogout}>Logout</Link>
      </div>
    </nav>
  )
}

function EntryPage() {
  const navigate = useNavigate();
  
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">PRATHMIK KUMARSHALA DEVLA</h1>
          <img
            className="login-school-banner"
            src="/education-rights-banner.png"
            alt="Education rights banner"
          />
        </div>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
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
            Welcome to PRATHMIK KUMARSHALA DEVLA - Primary School Management System
          </p>
        </div>
      </div>
    </div>
  )
}

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'
const TEACHER_USERNAME = 'teacher'
const TEACHER_PASSWORD = 'teacher123'

function LoginPage() {
  const [searchParams] = useSearchParams()
  const initialRole = ['admin', 'teacher'].includes(searchParams.get('role')) ? searchParams.get('role') : 'student'
  const [role, setRole] = useState(initialRole)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'admin' || roleParam === 'teacher' || roleParam === 'student') {
      setRole(roleParam)
    }
    console.log('LoginPage loaded, role:', roleParam)
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
    } else if (role === 'teacher') {
      if (username.toLowerCase() === TEACHER_USERNAME && password === TEACHER_PASSWORD) {
        localStorage.setItem('userRole', 'teacher')
        navigate('/admin/results')
      } else {
        setError('Invalid teacher credentials')
      }
    } else {
      setLoading(true)
      try {
        const student = await (await getDbApi()).loginStudent(username, password)
        console.log('Student login successful:', student)
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
          <h1 className="login-title">PRATHMIK KUMARSHALA DEVLA</h1>
          <img
            className="login-school-banner"
            src="/education-rights-banner.png"
            alt="Education rights banner"
          />
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
            onClick={() => setRole('teacher')}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: 'none', 
              background: role === 'teacher' ? '#2563eb' : 'transparent', 
              color: role === 'teacher' ? 'white' : '#64748b',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Teacher
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
  console.log('AdminDashboard rendered')
  const [stats, setStats] = useState({ students: 0, staff: 0, announcements: 0, attendance: 0 })
  const [announcements, setAnnouncements] = useState([])
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    console.log('Fetching counts...')
    fetchStudentsCount()
    fetchStaffCount()
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    if (stats.students > 0 && !animated) {
      console.log('Stats loaded, animating...')
      setAnimated(true)
    }
  }, [stats, animated])

  const fetchStudentsCount = async () => {
    try {
      const students = await (await getDbApi()).getAllStudents()
      setStats(prev => ({ ...prev, students: students.length }))
    } catch (e) { console.error(e) }
  }

  const fetchStaffCount = async () => {
    try {
      const staff = await (await getDbApi()).getAllStaff()
      setStats(prev => ({ ...prev, staff: staff.length }))
    } catch (e) { console.error(e) }
  }

  const fetchAnnouncements = async () => {
    try {
      const announcements = await (await getDbApi()).getAllAnnouncements()
      setAnnouncements(announcements.slice(0, 3))
      setStats(prev => ({ ...prev, announcements: announcements.length }))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
        </div>
        <div className="stats-grid">
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
              <Link to="/admin/attendance" className="btn btn-primary btn-touch">Mark Attendance</Link>
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
      const students = await (await getDbApi()).getAllStudents()
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
      const result = await (await getDbApi()).addStudent(newStudent)
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
      await (await getDbApi()).deleteStudent(id)
      fetchStudents()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Student Management</h1>
          <button className="btn btn-primary btn-touch" onClick={() => setShowModal(true)}>+ Add Student</button>
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
              <tbody className="data-loaded">
                {students.map((student, index) => (
                  <tr key={student.id} style={{ opacity: 0, animation: `fadeInUp 0.4s ease-out ${index * 50}ms forwards` }}>
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
  const [dateError, setDateError] = useState('')

  const getMinDate = () => {
    const d = new Date()
    d.setDate(d.getDate() - 15)
    return d.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const validateDate = (selectedDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    const fifteenDaysAgo = new Date()
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)
    fifteenDaysAgo.setHours(0, 0, 0, 0)

    if (selected > today) {
      return 'Future dates are not allowed'
    }
    if (selected < fifteenDaysAgo) {
      return 'You can only mark attendance for the last 15 days'
    }
    return ''
  }

  useEffect(() => {
    const error = validateDate(date)
    setDateError(error)
    if (!error) {
      fetchData()
    }
  }, [date])

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await (await getDbApi()).getAllStudents()
      setStudents(data)

      const attData = await (await getDbApi()).getAllAttendance(date)
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
    if (dateError) return
    try {
      await (await getDbApi()).addAttendance({ studentId, date, status })
      setAttendance(prev => ({ ...prev, [studentId]: status }))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="app">
      <AppNavbar variant="admin" />
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
              min={getMinDate()}
              max={getMaxDate()}
              style={{ maxWidth: '200px' }}
            />
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Attendance can only be marked for the last 15 days
            </p>
            {dateError && (
              <p className="form-error" style={{ marginTop: '0.5rem' }}>{dateError}</p>
            )}
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
                         disabled={!!dateError}
                       >
                         Present
                       </button>
                       <button
                         className={`btn ${attendance[student._id] === 'Absent' ? 'btn-danger' : 'btn-secondary'}`}
                         style={{ marginRight: '0.5rem' }}
                         onClick={() => markAttendance(student._id, 'Absent')}
                         disabled={!!dateError}
                       >
                         Absent
                       </button>
                       <button
                         className={`btn ${attendance[student._id] === 'No Attendance' ? 'btn-warning' : 'btn-secondary'}`}
                         onClick={() => markAttendance(student._id, 'No Attendance')}
                         disabled={!!dateError}
                       >
                         No Attendance
                       </button>
                       {dateError && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--danger)' }}>Invalid date</span>}
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
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newResult, setNewResult] = useState({ studentId: '', examType: 'Unit Test', subject: '', marks: '', maxMarks: '100', status: 'draft' })
  const [csvMessage, setCsvMessage] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedExamType, setSelectedExamType] = useState('Unit Test')
  const [uploadStatus, setUploadStatus] = useState('draft')
  const [bulkPreview, setBulkPreview] = useState([])
  const [bulkFileName, setBulkFileName] = useState('')

  useEffect(() => {
    fetchResults()
    fetchStudents()
  }, [])

  const isAuthorizedUploader = ['admin', 'teacher'].includes(localStorage.getItem('userRole'))
  const classOptions = Array.from(new Set(students.map(student => student.class).filter(Boolean))).sort()
  const validPreviewRows = bulkPreview.filter(row => row.errors.length === 0)
  const invalidPreviewRows = bulkPreview.length - validPreviewRows.length

  const fetchStudents = async () => {
    try {
      const data = await (await getDbApi()).getAllStudents()
      setStudents(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchResults = async () => {
    try {
      const data = await (await getDbApi()).getAllResults()
      setResults(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddResult = async (e) => {
    e.preventDefault()
    if (!isAuthorizedUploader) return
    try {
      const student = students.find(item => item.id === newResult.studentId)
      if (!student) {
        setCsvMessage('Please select a valid student.')
        return
      }

      await (await getDbApi()).addResult({
        ...newResult,
        studentName: student.name,
        studentClass: student.class,
        marks: Number(newResult.marks),
        maxMarks: Number(newResult.maxMarks) || 100,
        percentage: calculatePercentage(Number(newResult.marks), Number(newResult.maxMarks) || 100),
        gpa: calculateGpa(calculatePercentage(Number(newResult.marks), Number(newResult.maxMarks) || 100)),
      })
      fetchResults()
      setShowModal(false)
      setNewResult({ studentId: '', examType: 'Unit Test', subject: '', marks: '', maxMarks: '100', status: 'draft' })
      setCsvMessage('')
    } catch (e) {
      console.error(e)
    }
  }

  const downloadResultTemplate = async (format = 'csv') => {
    const headers = ['studentId', 'rollNumber', 'class', 'studentName', 'examType', 'maxMarks', ...RESULT_SUBJECTS]
    const firstStudent = students.find(student => !selectedClass || student.class === selectedClass)
    const sample = [
      firstStudent?.id || '',
      firstStudent?.rollNumber || '1',
      selectedClass || firstStudent?.class || '5',
      firstStudent?.name || 'Student Name',
      selectedExamType,
      '100',
      '78',
      '82',
      '75',
      '88',
      '81',
      '79',
      '90',
    ]

    if (format === 'xlsx') {
      const XLSX = await import('xlsx')
      const worksheet = XLSX.utils.aoa_to_sheet([headers, sample])
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Results')
      XLSX.writeFile(workbook, 'student-results-template.xlsx')
      return
    }

    const csv = [headers, sample].map(row => row.map(escapeCsvCell).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'student-results-template.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCsvUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!isAuthorizedUploader) {
      setCsvMessage('Only authorized admins or teachers can upload results.')
      return
    }

    try {
      const rows = await readResultFile(file)
      if (rows.length < 2) {
        setCsvMessage('The uploaded file is empty.')
        return
      }

      const preview = buildResultPreview(rows, students, selectedClass, selectedExamType, uploadStatus)
      setBulkPreview(preview)
      setBulkFileName(file.name)
      setCsvMessage(`Preview ready for ${file.name}. Review errors before submitting.`)
    } catch (e) {
      console.error(e)
      setCsvMessage('Could not read the file. Please upload a valid Excel or CSV file.')
    }
  }

  const submitBulkResults = async () => {
    if (!isAuthorizedUploader) {
      setCsvMessage('Only authorized admins or teachers can publish results.')
      return
    }
    if (validPreviewRows.length === 0) {
      setCsvMessage('No valid rows to submit.')
      return
    }

    try {
      const dbApi = await getDbApi()
      let imported = 0

      for (const row of validPreviewRows) {
        for (const subjectResult of row.subjectResults) {
          await dbApi.addResult({
            studentId: row.student.id,
            studentName: row.student.name,
            studentClass: row.student.class,
            rollNumber: row.student.rollNumber,
            examType: row.examType,
            subject: subjectResult.subject,
            marks: subjectResult.marks,
            maxMarks: subjectResult.maxMarks,
            percentage: row.percentage,
            gpa: row.gpa,
            status: row.status,
            uploadedByRole: localStorage.getItem('userRole') || 'admin',
          })
          imported += 1
        }
      }

      await fetchResults()
      setBulkPreview([])
      setBulkFileName('')
      setCsvMessage(`Submitted ${imported} subject results as ${uploadStatus}.`)
    } catch (e) {
      console.error(e)
      setCsvMessage('Could not submit results. Please try again.')
    }
  }

  const publishResult = async (resultId) => {
    if (!isAuthorizedUploader) return
    try {
      await (await getDbApi()).updateResult(resultId, { status: 'published', publishedAt: new Date() })
      await fetchResults()
    } catch (e) {
      console.error(e)
    }
  }

  if (!isAuthorizedUploader) {
    return (
      <div className="app">
        <AppNavbar variant="admin" />
        <div className="container">
          <div className="card">
            <h1 className="page-title">Access Restricted</h1>
            <p>Only authorized admins or teachers can upload and manage student results.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <AppNavbar variant={localStorage.getItem('userRole') === 'teacher' ? 'teacher' : 'admin'} />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Results Management</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-touch" onClick={() => downloadResultTemplate('csv')}>CSV Template</button>
            <button className="btn btn-secondary btn-touch" onClick={() => downloadResultTemplate('xlsx')}>Excel Template</button>
            <label className="btn btn-secondary btn-touch" style={{ cursor: 'pointer' }}>
              Upload File
              <input type="file" accept=".csv,.xlsx,.xls,text/csv" onChange={handleCsvUpload} style={{ display: 'none' }} />
            </label>
            <button className="btn btn-primary btn-touch" onClick={() => setShowModal(true)}>+ Add Result</button>
          </div>
        </div>

        <div className="result-upload-panel">
          <div className="form-group">
            <label className="form-label">Class</label>
            <select className="form-input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              <option value="">All Classes</option>
              {classOptions.map(className => <option key={className} value={className}>Class {className}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Exam Type</label>
            <select className="form-input" value={selectedExamType} onChange={e => setSelectedExamType(e.target.value)}>
              {RESULT_EXAM_TYPES.map(examType => <option key={examType} value={examType}>{examType}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Publish Control</label>
            <select className="form-input" value={uploadStatus} onChange={e => setUploadStatus(e.target.value)}>
              <option value="draft">Save as Draft</option>
              <option value="published">Publish Immediately</option>
            </select>
          </div>
        </div>

        {csvMessage && <p style={{ marginBottom: '1rem', color: 'var(--text)' }}>{csvMessage}</p>}

        {bulkPreview.length > 0 && (
          <div className="card result-preview-card">
            <div className="result-preview-header">
              <div>
                <h3 className="card-header">Upload Preview</h3>
                <p>{bulkFileName} - {validPreviewRows.length} valid rows, {invalidPreviewRows} rows need attention</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => setBulkPreview([])}>Clear Preview</button>
                <button className="btn btn-primary" onClick={submitBulkResults} disabled={validPreviewRows.length === 0}>Submit Valid Results</button>
              </div>
            </div>
            <div className="table-scroll">
              <table className="table result-preview-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Exam</th>
                    <th>Subjects</th>
                    <th>Percentage</th>
                    <th>GPA</th>
                    <th>Status</th>
                    <th>Validation</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkPreview.map(row => (
                    <tr key={row.rowNumber} className={row.errors.length ? 'row-error' : ''}>
                      <td>{row.rowNumber}</td>
                      <td>{row.student ? `${row.student.name} (${row.student.rollNumber})` : 'Not matched'}</td>
                      <td>{row.className || '-'}</td>
                      <td>{row.examType}</td>
                      <td>{row.subjectResults.map(subject => `${subject.subject}: ${subject.marks}/${subject.maxMarks}`).join(', ') || '-'}</td>
                      <td>{row.percentage ? `${row.percentage}%` : '-'}</td>
                      <td>{row.gpa || '-'}</td>
                      <td><span className={`badge ${row.status === 'published' ? 'badge-success' : 'badge-warning'}`}>{row.status}</span></td>
                      <td>{row.errors.length ? row.errors.join('; ') : <span className="badge badge-success">Ready</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card">
          {loading ? <p>Loading...</p> : results.length === 0 ? (
            <p>No results found</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Exam</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Percentage</th>
                  <th>GPA</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result._id}>
                    <td>{result.studentName}</td>
                    <td>{result.studentClass}</td>
                    <td>{result.examType || 'Result'}</td>
                    <td>{result.subject}</td>
                    <td>{result.marks}/{result.maxMarks || 100}</td>
                    <td>{result.percentage ? `${result.percentage}%` : `${calculatePercentage(result.marks, result.maxMarks || 100)}%`}</td>
                    <td>{result.gpa || calculateGpa(calculatePercentage(result.marks, result.maxMarks || 100))}</td>
                    <td><span className="badge badge-success">{getGrade(Number(result.marks))}</span></td>
                    <td><span className={`badge ${result.status === 'published' ? 'badge-success' : 'badge-warning'}`}>{result.status || 'draft'}</span></td>
                    <td>
                      {(result.status || 'draft') !== 'published' ? (
                        <button className="btn btn-secondary" onClick={() => publishResult(result.id || result._id)}>Publish</button>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>Published</span>
                      )}
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
                <h3 className="modal-title">Add New Result</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddResult}>
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select className="form-input" value={newResult.studentId} onChange={e => setNewResult({ ...newResult, studentId: e.target.value })} required>
                    <option value="">Select student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - Class {student.class} - Roll {student.rollNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Exam Type</label>
                  <select className="form-input" value={newResult.examType} onChange={e => setNewResult({ ...newResult, examType: e.target.value })} required>
                    {RESULT_EXAM_TYPES.map(examType => <option key={examType} value={examType}>{examType}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-input" value={newResult.subject} onChange={e => setNewResult({ ...newResult, subject: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Marks</label>
                  <input type="number" className="form-input" value={newResult.marks} onChange={e => setNewResult({ ...newResult, marks: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Marks</label>
                  <input type="number" className="form-input" value={newResult.maxMarks} onChange={e => setNewResult({ ...newResult, maxMarks: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Result Status</label>
                  <select className="form-input" value={newResult.status} onChange={e => setNewResult({ ...newResult, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
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

const RESULT_EXAM_TYPES = ['Unit Test', 'Mid Term', 'Final Exam', 'Annual Exam']
const RESULT_SUBJECTS = ['Gujarati', 'Hindi', 'English', 'Maths', 'Science', 'Social Science', 'Computer']
const RESULT_META_KEYS = new Set(['studentid', 'rollnumber', 'rollno', 'class', 'studentname', 'name', 'examtype', 'exam', 'maxmarks', 'subject', 'marks', 'status'])

function getGrade(marks) {
  if (marks >= 90) return 'A+'
  if (marks >= 80) return 'A'
  if (marks >= 70) return 'B+'
  if (marks >= 60) return 'B'
  if (marks >= 50) return 'C'
  return 'D'
}

function calculatePercentage(marks, maxMarks) {
  const safeMarks = Number(marks)
  const safeMax = Number(maxMarks)
  if (Number.isNaN(safeMarks) || Number.isNaN(safeMax) || safeMax <= 0) return 0
  return Math.round((safeMarks / safeMax) * 10000) / 100
}

function calculateGpa(percentage) {
  const safePercentage = Number(percentage)
  if (Number.isNaN(safePercentage)) return 0
  return Math.min(10, Math.max(0, Math.round((safePercentage / 10) * 10) / 10))
}

function escapeCsvCell(value) {
  const text = String(value ?? '')
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

async function readResultFile(file) {
  const fileName = file.name.toLowerCase()
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    const XLSX = await import('xlsx')
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })
  }

  return parseCsvRows(await file.text())
}

function buildResultPreview(rows, students, selectedClass, selectedExamType, uploadStatus) {
  const headers = rows[0].map(normalizeKey)
  const studentById = new Map(students.map(student => [student.id, student]))
  const studentByRollClass = new Map(students.map(student => [
    makeStudentResultKey(student.rollNumber, student.class),
    student,
  ]))

  return rows.slice(1)
    .map((row, index) => {
      const record = headers.reduce((data, header, headerIndex) => {
        data[header] = row[headerIndex] || ''
        return data
      }, {})
      const rowNumber = index + 2
      const className = String(record.class || selectedClass || '').trim()
      const examType = String(record.examtype || record.exam || selectedExamType || '').trim()
      const status = normalizeKey(record.status) === 'published' ? 'published' : uploadStatus
      const student = findStudentForResultRow(record, className, studentById, studentByRollClass)
      const subjectResults = extractSubjectResults(record, headers)
      const errors = []

      if (!student) errors.push('Student ID or roll/class not matched')
      if (selectedClass && className && normalizeKey(selectedClass) !== normalizeKey(className)) errors.push('Class does not match selected class')
      if (!examType) errors.push('Exam type is missing')
      if (subjectResults.length === 0) errors.push('No valid subject marks found')

      subjectResults.forEach(subject => {
        if (subject.marks < 0) errors.push(`${subject.subject} has negative marks`)
        if (subject.maxMarks <= 0) errors.push(`${subject.subject} max marks must be greater than zero`)
        if (subject.marks > subject.maxMarks) errors.push(`${subject.subject} marks exceed max marks`)
      })

      const totalMarks = subjectResults.reduce((sum, subject) => sum + subject.marks, 0)
      const totalMaxMarks = subjectResults.reduce((sum, subject) => sum + subject.maxMarks, 0)
      const percentage = calculatePercentage(totalMarks, totalMaxMarks)

      return {
        rowNumber,
        student,
        className,
        examType,
        status,
        subjectResults,
        percentage,
        gpa: calculateGpa(percentage),
        errors,
      }
    })
    .filter(row => row.student || row.subjectResults.length || row.className || row.examType)
}

function findStudentForResultRow(record, className, studentById, studentByRollClass) {
  const studentId = String(record.studentid || '').trim()
  if (studentId && studentById.has(studentId)) return studentById.get(studentId)

  const rollNumber = record.rollnumber || record.rollno
  return studentByRollClass.get(makeStudentResultKey(rollNumber, className))
}

function extractSubjectResults(record, headers) {
  const defaultMaxMarks = Number(record.maxmarks || 100)
  if (record.subject || record.marks) {
    const subject = String(record.subject || '').trim()
    const marks = Number(record.marks)
    if (!subject || Number.isNaN(marks)) return []
    return [{
      subject,
      marks,
      maxMarks: Number.isNaN(defaultMaxMarks) ? 100 : defaultMaxMarks,
    }]
  }

  return headers
    .filter(header => header && !RESULT_META_KEYS.has(header))
    .map(header => {
      const value = record[header]
      if (value === undefined || value === null || String(value).trim() === '') return null
      const marks = Number(value)
      if (Number.isNaN(marks)) return null
      const subject = RESULT_SUBJECTS.find(item => normalizeKey(item) === header) || header
      return {
        subject,
        marks,
        maxMarks: Number.isNaN(defaultMaxMarks) ? 100 : defaultMaxMarks,
      }
    })
    .filter(Boolean)
}

function parseCsvRows(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"'
      i += 1
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim())
      cell = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i += 1
      row.push(cell.trim())
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }

  if (cell || row.length) {
    row.push(cell.trim())
    rows.push(row)
  }

  return rows
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

function makeStudentResultKey(rollNumber, className) {
  return `${normalizeKey(rollNumber)}|${normalizeKey(className)}`
}

function groupResultsByExam(results) {
  const groups = new Map()
  results.forEach(result => {
    const examType = result.examType || 'Published Result'
    if (!groups.has(examType)) groups.set(examType, [])
    groups.get(examType).push(result)
  })

  return Array.from(groups.entries()).map(([examType, examResults]) => {
    const totalMarks = examResults.reduce((sum, result) => sum + Number(result.marks || 0), 0)
    const totalMaxMarks = examResults.reduce((sum, result) => sum + Number(result.maxMarks || 100), 0)
    const percentage = calculatePercentage(totalMarks, totalMaxMarks)
    return {
      examType,
      results: examResults,
      totalMarks,
      totalMaxMarks,
      percentage,
      gpa: calculateGpa(percentage),
    }
  })
}

function printMarksheet(student, group) {
  const studentName = student?.name || localStorage.getItem('studentName') || 'Student'
  const studentClass = student?.class || localStorage.getItem('studentClass') || ''
  const rows = group.results.map(result => `
    <tr>
      <td>${escapeHtml(result.subject)}</td>
      <td>${Number(result.marks || 0)}</td>
      <td>${Number(result.maxMarks || 100)}</td>
      <td>${getGrade(Number(result.marks || 0))}</td>
    </tr>
  `).join('')
  const printable = window.open('', '_blank')
  if (!printable) return

  printable.document.write(`
    <html>
      <head>
        <title>${escapeHtml(studentName)} - ${escapeHtml(group.examType)} Marksheet</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 32px; }
          h1, h2, p { margin: 0; }
          .header { text-align: center; border-bottom: 2px solid #111827; padding-bottom: 18px; margin-bottom: 22px; }
          .meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 22px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 22px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f1f5f9; }
          .summary { display: flex; gap: 20px; font-weight: 700; }
          @media print { button { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PRATHMIK KUMARSHALA DEVLA</h1>
          <h2>${escapeHtml(group.examType)} Marksheet</h2>
        </div>
        <div class="meta">
          <p><strong>Student:</strong> ${escapeHtml(studentName)}</p>
          <p><strong>Class:</strong> ${escapeHtml(studentClass)}</p>
          <p><strong>Roll No:</strong> ${escapeHtml(student?.rollNumber || '')}</p>
          <p><strong>Status:</strong> Published</p>
        </div>
        <table>
          <thead>
            <tr><th>Subject</th><th>Marks</th><th>Max Marks</th><th>Grade</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="summary">
          <p>Total: ${group.totalMarks}/${group.totalMaxMarks}</p>
          <p>Percentage: ${group.percentage}%</p>
          <p>GPA: ${group.gpa}</p>
        </div>
        <script>window.print()</script>
      </body>
    </html>
  `)
  printable.document.close()
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function StaffManagement() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const data = await (await getDbApi()).getAllStaff()
      setStaff(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <AppNavbar variant="admin" />
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
      const data = await (await getDbApi()).getAllAnnouncements()
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
      await (await getDbApi()).addAnnouncement(newAnnouncement)
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
      await (await getDbApi()).deleteAnnouncement(id)
      fetchAnnouncements()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Announcements</h1>
          <button className="btn btn-primary btn-touch" onClick={() => setShowModal(true)}>+ Post New</button>
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
      const data = await (await getDbApi()).getAllImages(24)
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
        imageUrl = await (await getStorageApi()).uploadImage(selectedFile)
      }
      
      await (await getDbApi()).addImage({ 
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
        const freshData = await (await getDbApi()).getAllImages(24)
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
      await (await getDbApi()).deleteImage(id)
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
        await (await getDbApi()).deleteImage(id)
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
      <AppNavbar variant="admin" />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gallery</h1>
          <button className="btn btn-primary btn-touch" onClick={() => setShowModal(true)}>+ Upload Photo</button>
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
          <div className="data-loaded" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
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
                    loading="lazy"
                    decoding="async"
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
  const [studentName, setStudentName] = useState(localStorage.getItem('studentName') || 'Student')
  console.log('StudentDashboard - studentId:', studentId, 'studentName:', studentName)
  const [stats, setStats] = useState({ percentage: 0, present: 0, absent: 0, holiday: 0 })
  const [notices, setNotices] = useState(0)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!studentId) return
    try {
      // Fetch student details to ensure we have the name
      const student = await (await getDbApi()).getStudentById(studentId)
      console.log('Fetched student:', student)
      setStudentName(student.name || 'Student')
      
      const attendance = await (await getDbApi()).getAttendanceByStudent(studentId)
      const present = attendance.filter(a => a.status === 'Present').length
      const absent = attendance.filter(a => a.status === 'Absent').length
      const noAttendance = attendance.filter(a => !a.status || (a.status !== 'Present' && a.status !== 'Absent')).length
      const total = present + absent + noAttendance
      const attendanceTotal = present + absent
      const percentage = attendanceTotal > 0 ? Math.round((present / attendanceTotal) * 100) : 0
      setStats({ percentage, present, absent, noAttendance })

      const studentResults = await (await getDbApi()).getPublishedResultsByStudent(studentId)
      setResults(studentResults.slice(0, 3))

      const allNotices = await (await getDbApi()).getAllAnnouncements()
      setNotices(allNotices.length)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="app">
      <AppNavbar variant="student" />
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
        {!loading && (stats.present > 0 || stats.absent > 0 || stats.holiday > 0) && (
          <div className="card glass-card" style={{ marginTop: '2rem', padding: '2rem' }}>
            <h3 className="card-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Attendance Overview
            </h3>
            <PieChart3D
              present={stats.present}
              absent={stats.absent}
              noAttendance={stats.noAttendance}
            />
          </div>
        )}
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 className="card-header">My Recent Results</h3>
            {results.length === 0 ? <p style={{ padding: '1rem', color: '#64748b' }}>No results yet</p> : results.map(result => (
              <div key={result.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>{result.subject}</span>
                <span className="badge badge-success">{result.marks} ({getGrade(Number(result.marks))})</span>
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
  const [attendanceData, setAttendanceData] = useState({ present: 0, absent: 0, holiday: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

const fetchAttendance = async () => {
    if (!studentId) return
    try {
      const allAttendance = await (await getDbApi()).getAttendanceByStudent(studentId)
      const present = allAttendance.filter(a => a.status === 'Present').length
      const absent = allAttendance.filter(a => a.status === 'Absent').length
      const noAttendance = allAttendance.filter(a => !a.status || (a.status !== 'Present' && a.status !== 'Absent')).length
      const total = present + absent + noAttendance
      const attendanceTotal = present + absent
      const percentage = attendanceTotal > 0 ? Math.round((present / attendanceTotal) * 100) : 0
      setAttendanceData({ present, absent, noAttendance, total, percentage })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
}

  return (
    <div className="app">
      <AppNavbar variant="student" />
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
            {attendanceData.noAttendance > 0 && (
              <div className="stat-card">
                <div className="stat-value">{attendanceData.noAttendance}</div>
                <div className="stat-label">No Attendance</div>
              </div>
            )}
          </div>
          {(attendanceData.present > 0 || attendanceData.absent > 0 || attendanceData.holiday > 0) && (
            <div style={{ padding: '1rem 0' }}>
              <PieChart3D
                present={attendanceData.present}
                absent={attendanceData.absent}
                noAttendance={attendanceData.noAttendance}
              />
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

function MyResults() {
  const studentId = localStorage.getItem('studentId')
  const [student, setStudent] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    if (!studentId) {
      setLoading(false)
      return
    }
    try {
      const dbApi = await getDbApi()
      const currentStudent = await dbApi.getStudentById(studentId)
      const studentResults = await dbApi.getPublishedResultsByStudent(studentId)
      setStudent(currentStudent)
      setResults(studentResults)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const resultGroups = groupResultsByExam(results)

  return (
    <div className="app">
      <AppNavbar variant="student" />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Results</h1>
        </div>
        <div className="card">
          {loading ? <p>Loading...</p> : results.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--text-light)' }}>No results published yet</p>
          ) : (
            <div className="marksheet-list">
              {resultGroups.map(group => (
                <div className="marksheet-card" key={group.examType}>
                  <div className="marksheet-header">
                    <div>
                      <h3 className="card-header">{group.examType}</h3>
                      <p>Percentage: {group.percentage}% | GPA: {group.gpa}</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => printMarksheet(student, group)}>Download PDF</button>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.results.map(result => (
                        <tr key={result.id || result._id}>
                          <td>{result.subject}</td>
                          <td>{result.marks}{result.maxMarks ? `/${result.maxMarks}` : ''}</td>
                          <td><span className="badge badge-success">{getGrade(Number(result.marks))}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
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
      const data = await (await getDbApi()).getAllAnnouncements()
      setAnnouncements(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <AppNavbar variant="student" />
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
      const data = await (await getDbApi()).getAllImages(24)
      setImages(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <AppNavbar variant="student" />
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
                  src={image.url || image.imageUrl} 
                  alt={image.title} 
                  loading="lazy"
                  decoding="async"
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
              src={selectedImage.url || selectedImage.imageUrl} 
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


