import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.css'
import PieChart3D from './components/PieChart3D'

// Anime.js loaded globally from CDN
const anime = window.anime

// Version: 1.0.1 - Clean build to fix Vercel cache

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

// Class Selector Component
function ClassSelector({ selectedClass, setSelectedClass }) {
  const [isOpen, setIsOpen] = useState(false)
  const classOptions = ['Balvatika', ...Array.from({ length: 8 }, (_, i) => `Class ${i + 1}`)]

  const handleSelect = (className) => {
    setSelectedClass(className)
    setIsOpen(false)
  }

  return (
    <div className="class-selector">
      <button 
        className="btn btn-class-selector"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedClass ? `${selectedClass} Selected` : 'Select Class'}
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      <div className={`class-dropdown ${isOpen ? 'open' : ''}`}>
        {classOptions.map(option => (
          <div 
            key={option}
            className={`class-option ${selectedClass === option ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
            role="option"
            aria-selected={selectedClass === option}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [selectedClass, setSelectedClass] = useState(null)

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentManagement selectedClass={selectedClass} setSelectedClass={setSelectedClass} />} />
        <Route path="/admin/attendance" element={<AttendanceManagement selectedClass={selectedClass} setSelectedClass={setSelectedClass} />} />
        <Route path="/admin/results" element={<ResultsManagement selectedClass={selectedClass} setSelectedClass={setSelectedClass} />} />
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
  const links = isAdmin
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
  const navigate = useNavigate()

  const handleLogin = (role) => {
    localStorage.setItem('userRole', role)
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="app">
      <div className="entry-page">
        <div className="entry-hero">
          <div className="hero-content">
            <h1 className="hero-title reveal-on-scroll">PRATHMIK KUMARSHALA DEVLA</h1>
            <p className="hero-subtitle reveal-on-scroll">Smart School Management System</p>
            <div className="hero-actions reveal-on-scroll">
              <button className="btn btn-primary btn-lg" onClick={() => handleLogin('admin')}>
                Admin Login
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => handleLogin('student')}>
                Student Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { getAllStudents } = await getDbApi()
      const students = await getAllStudents()
      const student = students.find(s => 
        (s.username === loginId || s.id === loginId) && 
        s.password === password
      )

      if (student) {
        localStorage.setItem('userRole', 'student')
        localStorage.setItem('studentId', student.id)
        localStorage.setItem('studentName', student.name)
        localStorage.setItem('studentClass', student.class)
        navigate('/student')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="login-page">
        <div className="login-card">
          <h2>Student Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username / Student ID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <button 
            className="btn btn-link btn-block"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceToday: 0,
    totalStaff: 0,
    announcements: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { getAllStudents, getAllStaff, getAllAnnouncements } = await getDbApi()
      const [students, staff, announcements] = await Promise.all([
        getAllStudents(),
        getAllStaff(),
        getAllAnnouncements()
      ])

      const today = new Date().toISOString().split('T')[0]
      const { getAttendanceByDate } = await getDbApi()
      const todayAttendance = await getAttendanceByDate(today)
      const attendancePercent = students.length > 0 
        ? Math.round((todayAttendance.filter(a => a.status === 'present').length / students.length) * 100)
        : 0

      setStats({
        totalStudents: students.length,
        attendanceToday: attendancePercent,
        totalStaff: staff.length,
        announcements: announcements.length
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <main className="main-content">
        <div className="admin-page">
          <div className="page-header">
            <h2>Admin Dashboard</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card reveal-on-scroll">
              <div className="stat-icon">👨🎓</div>
              <div className="stat-content">
                <h3>Total Students</h3>
                <p className="stat-value">{loading ? '...' : stats.totalStudents}</p>
              </div>
            </div>
            <div className="stat-card reveal-on-scroll">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Attendance Today</h3>
                <p className="stat-value">{loading ? '...' : `${stats.attendanceToday}%`}</p>
              </div>
            </div>
            <div className="stat-card reveal-on-scroll">
              <div className="stat-icon">👨🏫</div>
              <div className="stat-content">
                <h3>Total Staff</h3>
                <p className="stat-value">{loading ? '...' : stats.totalStaff}</p>
              </div>
            </div>
            <div className="stat-card reveal-on-scroll">
              <div className="stat-icon">📢</div>
              <div className="stat-content">
                <h3>Announcements</h3>
                <p className="stat-value">{loading ? '...' : stats.announcements}</p>
              </div>
            </div>
          </div>
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/admin/students" className="btn btn-primary">Manage Students</Link>
              <Link to="/admin/attendance" className="btn btn-primary">Mark Attendance</Link>
              <Link to="/admin/results" className="btn btn-primary">Manage Results</Link>
              <Link to="/admin/staff" className="btn btn-secondary">Manage Staff</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StudentManagement({ selectedClass, setSelectedClass }) {
  const [students, setStudents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({ name: '', class: '', rollNumber: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudents()
  }, [selectedClass])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const { getAllStudents } = await getDbApi()
      let data = await getAllStudents()
      
      if (selectedClass) {
        data = data.filter(student => student.class === selectedClass)
      }
      
      setStudents(data)
    } catch (error) {
      console.error('Failed to load students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { addStudent, updateStudent } = await getDbApi()
      
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData)
      } else {
        const username = formData.name.toLowerCase().replace(/\s+/g, '') + formData.rollNumber
        const password = formData.name.toLowerCase().replace(/\s+/g, '') + '@' + formData.rollNumber
        await addStudent({
          ...formData,
          username,
          password,
          status: 'active'
        })
      }
      
      setShowModal(false)
      setEditingStudent(null)
      setFormData({ name: '', class: '', rollNumber: '' })
      loadStudents()
    } catch (error) {
      console.error('Failed to save student:', error)
      alert('Failed to save student. Please try again.')
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      class: student.class,
      rollNumber: student.rollNumber
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    
    try {
      const { deleteStudent } = await getDbApi()
      await deleteStudent(id)
      loadStudents()
    } catch (error) {
      console.error('Failed to delete student:', error)
      alert('Failed to delete student.')
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  )

  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <main className="main-content">
        <div className="admin-page">
          <div className="page-header">
            <h2>Student Management</h2>
            <div className="page-actions">
              <ClassSelector selectedClass={selectedClass} setSelectedClass={setSelectedClass} />
              <button 
                className="btn btn-primary btn-touch btn-magnetic reveal-on-scroll" 
                onClick={() => {
                  if (!selectedClass) {
                    alert('Please select a class before adding a student')
                    return
                  }
                  setFormData({ name: '', class: selectedClass, rollNumber: '' })
                  setEditingStudent(null)
                  setShowModal(true)
                }}
              >
                + Add Student
              </button>
            </div>
          </div>

          {!selectedClass ? (
            <div className="no-class-message">Please select a class to view students</div>
          ) : (
            <>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {loading ? (
                <div className="loading">Loading students...</div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="no-data">
                            {searchTerm ? 'No matching students found' : `No students found in ${selectedClass}`}
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map(student => (
                          <tr key={student.id}>
                            <td>{student.rollNumber}</td>
                            <td>{student.name}</td>
                            <td>{student.class}</td>
                            <td>{student.username}</td>
                            <td>{student.password}</td>
                            <td>
                              <span className={`status-badge ${student.status}`}>
                                {student.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleEdit(student)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(student.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                  <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <input
                      type="text"
                      value={formData.class}
                      readOnly
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingStudent ? 'Update' : 'Add'} Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function AttendanceManagement({ selectedClass, setSelectedClass }) {
  const [students, setStudents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [selectedClass, selectedDate])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const { getAllStudents } = await getDbApi()
      let data = await getAllStudents()
      
      if (selectedClass) {
        data = data.filter(student => student.class === selectedClass)
      }
      
      setStudents(data)

      if (selectedClass && selectedDate) {
        const { getAttendanceByDate } = await getDbApi()
        const attendanceData = await getAttendanceByDate(selectedDate)
        const attendanceMap = {}
        attendanceData.forEach(record => {
          attendanceMap[record.studentId] = record.status
        })
        setAttendance(attendanceMap)
      }
    } catch (error) {
      console.error('Failed to load attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (studentId, status) => {
    try {
      const { markAttendance } = await getDbApi()
      await markAttendance({
        studentId,
        date: selectedDate,
        status
      })
      
      setAttendance(prev => ({
        ...prev,
        [studentId]: status
      }))
    } catch (error) {
      console.error('Failed to mark attendance:', error)
      alert('Failed to mark attendance.')
    }
  }

  const getAttendanceStats = () => {
    const total = students.length
    const present = Object.values(attendance).filter(s => s === 'present').length
    const absent = Object.values(attendance).filter(s => s === 'absent').length
    const notMarked = total - present - absent
    
    return { total, present, absent, notMarked }
  }

  const stats = getAttendanceStats()

  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <main className="main-content">
        <div className="admin-page">
          <div className="page-header">
            <h2>Attendance Management</h2>
            <div className="page-actions">
              <ClassSelector selectedClass={selectedClass} setSelectedClass={setSelectedClass} />
            </div>
          </div>

          {!selectedClass ? (
            <div className="no-class-message">Please select a class to mark attendance</div>
          ) : (
            <>
              <div className="attendance-controls">
                <div className="form-group">
                  <label>Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="attendance-stats">
                  <div className="stat-chip present">Present: {stats.present}</div>
                  <div className="stat-chip absent">Absent: {stats.absent}</div>
                  <div className="stat-chip not-marked">Not Marked: {stats.notMarked}</div>
                </div>
              </div>

              {loading ? (
                <div className="loading">Loading students...</div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Attendance Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="no-data">
                            No students found in {selectedClass}
                          </td>
                        </tr>
                      ) : (
                        students.map(student => (
                          <tr key={student.id}>
                            <td>{student.rollNumber}</td>
                            <td>{student.name}</td>
                            <td>{student.class}</td>
                            <td>
                              <span className={`attendance-status ${attendance[student.id] || 'none'}`}>
                                {attendance[student.id] 
                                  ? attendance[student.id].charAt(0).toUpperCase() + attendance[student.id].slice(1)
                                  : 'Not Marked'
                                }
                              </span>
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm ${attendance[student.id] === 'present' ? 'btn-success active' : 'btn-outline-success'}`}
                                onClick={() => markAttendance(student.id, 'present')}
                              >
                                Present
                              </button>
                              <button
                                className={`btn btn-sm ${attendance[student.id] === 'absent' ? 'btn-danger active' : 'btn-outline-danger'}`}
                                onClick={() => markAttendance(student.id, 'absent')}
                              >
                                Absent
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function ResultsManagement({ selectedClass, setSelectedClass }) {
  const [results, setResults] = useState([])
  const [students, setStudents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingResult, setEditingResult] = useState(null)
  const [expandedStudents, setExpandedStudents] = useState(new Set())
  const [formData, setFormData] = useState({
    studentId: '',
    examType: 'unit-test',
    subjects: [{ name: '', marks: '', maxMarks: 100 }]
  })
  const [loading, setLoading] = useState(true)
  const [bulkUploadModal, setBulkUploadModal] = useState(false)
  const [bulkData, setBulkData] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedClass])

  const loadData = async () => {
    try {
      setLoading(true)
      const { getAllResults, getAllStudents } = await getDbApi()

      let studentsData = await getAllStudents()
      if (selectedClass) {
        studentsData = studentsData.filter(s => s.class === selectedClass)
      }
      setStudents(studentsData)

      let resultsData = await getAllResults()
      if (selectedClass) {
        const classStudentIds = studentsData.map(s => s.id)
        resultsData = resultsData.filter(r => classStudentIds.includes(r.studentId))
      }
      setResults(resultsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    return 'D'
  }

  const calculateGPA = (percentage) => {
    if (percentage >= 90) return 4.0
    if (percentage >= 80) return 3.7
    if (percentage >= 70) return 3.3
    if (percentage >= 60) return 3.0
    if (percentage >= 50) return 2.7
    return 2.0
  }

  const toggleStudentExpand = (studentId) => {
    setExpandedStudents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(studentId)) {
        newSet.delete(studentId)
      } else {
        newSet.add(studentId)
      }
      return newSet
    })
  }

  const expandAll = () => {
    const ids = [...new Set(results.map(r => r.studentId))]
    setExpandedStudents(new Set(ids))
  }

  const collapseAll = () => {
    setExpandedStudents(new Set())
  }

  const groupByStudent = () => {
    const grouped = {}
    results.forEach(result => {
      const student = students.find(s => s.id === result.studentId)
      if (!student) return
      if (!grouped[result.studentId]) {
        grouped[result.studentId] = { student, results: [], totalMarks: 0, totalMaxMarks: 0 }
      }
      grouped[result.studentId].results.push(result)
      grouped[result.studentId].totalMarks += result.subjects.reduce((s, sub) => s + parseFloat(sub.marks || 0), 0)
      grouped[result.studentId].totalMaxMarks += result.subjects.reduce((s, sub) => s + parseFloat(sub.maxMarks || 0), 0)
    })
    Object.values(grouped).forEach(g => {
      g.overallPercentage = g.totalMaxMarks > 0 ? (g.totalMarks / g.totalMaxMarks) * 100 : 0
      g.finalGPA = calculateGPA(g.overallPercentage)
      g.finalGrade = calculateGrade(g.overallPercentage)
    })
    return grouped
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { addResult, updateResult } = await getDbApi()

      const totalMarks = formData.subjects.reduce((sum, sub) => sum + parseFloat(sub.marks || 0), 0)
      const totalMaxMarks = formData.subjects.reduce((sum, sub) => sum + parseFloat(sub.maxMarks || 0), 0)
      const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0

      const resultData = {
        ...formData,
        percentage: parseFloat(percentage.toFixed(2)),
        grade: calculateGrade(percentage),
        gpa: calculateGPA(percentage),
        status: 'published'
      }

      if (editingResult) {
        await updateResult(editingResult.id, resultData)
      } else {
        await addResult(resultData)
      }

      setShowModal(false)
      setEditingResult(null)
      setFormData({
        studentId: '',
        examType: 'unit-test',
        subjects: [{ name: '', marks: '', maxMarks: 100 }]
      })
      loadData()
    } catch (error) {
      console.error('Failed to save result:', error)
      alert('Failed to save result.')
    }
  }

  const handleDeleteResult = async (id) => {
    if (!confirm('Delete this result?')) return
    try {
      const { deleteResult } = await getDbApi()
      await deleteResult(id)
      loadData()
    } catch (error) {
      alert('Failed to delete result.')
    }
  }

  const handleDeleteSubject = async (resultId, subjectIndex) => {
    if (!confirm('Delete this subject?')) return
    try {
      const result = results.find(r => r.id === resultId)
      if (!result) return
      const updatedSubjects = result.subjects.filter((_, i) => i !== subjectIndex)
      if (updatedSubjects.length === 0) {
        await handleDeleteResult(resultId)
        return
      }
      const { updateResult } = await getDbApi()
      const totalMarks = updatedSubjects.reduce((s, sub) => s + parseFloat(sub.marks || 0), 0)
      const totalMaxMarks = updatedSubjects.reduce((s, sub) => s + parseFloat(sub.maxMarks || 0), 0)
      const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0
      await updateResult(resultId, {
        ...result,
        subjects: updatedSubjects,
        percentage: parseFloat(percentage.toFixed(2)),
        grade: calculateGrade(percentage),
        gpa: calculateGPA(percentage)
      })
      loadData()
    } catch (error) {
      alert('Failed to delete subject.')
    }
  }

  const publishAll = async () => {
    if (!confirm('Publish all results?')) return
    try {
      const { updateResult } = await getDbApi()
      const updates = results.filter(r => r.status !== 'published').map(r =>
        updateResult(r.id, { ...r, status: 'published' })
      )
      await Promise.all(updates)
      loadData()
    } catch (error) {
      alert('Failed to publish results.')
    }
  }

  const handleBulkUpload = async () => {
    try {
      const { addResult } = await getDbApi()
      const data = JSON.parse(bulkData)
      for (const item of data) {
        const student = students.find(s =>
          s.rollNumber.toString() === item.studentRoll?.toString() &&
          s.class === item.className
        )
        if (!student) continue
        const subjects = item.subjects.map(sub => ({
          name: sub.subject,
          marks: parseFloat(sub.marks),
          maxMarks: sub.maxMarks || 100
        }))
        const totalMarks = subjects.reduce((s, sub) => s + sub.marks, 0)
        const totalMaxMarks = subjects.reduce((s, sub) => s + sub.maxMarks, 0)
        const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0
        await addResult({
          studentId: student.id,
          examType: item.exam?.toLowerCase().replace(' ', '-') || 'unit-test',
          subjects,
          percentage: parseFloat(percentage.toFixed(2)),
          grade: calculateGrade(percentage),
          gpa: calculateGPA(percentage),
          status: 'published'
        })
      }
      setBulkUploadModal(false)
      setBulkData('')
      loadData()
      alert('Bulk upload completed!')
    } catch (error) {
      alert('Invalid JSON format. Please check the data.')
    }
  }

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', marks: '', maxMarks: 100 }]
    })
  }

  const updateSubject = (index, field, value) => {
    const updatedSubjects = [...formData.subjects]
    updatedSubjects[index][field] = value
    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const removeSubject = (index) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index)
    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const grouped = groupByStudent()

  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <main className="main-content">
        <div className="admin-page">
          <div className="page-header">
            <h2>Results Management</h2>
            <div className="page-actions">
              <ClassSelector selectedClass={selectedClass} setSelectedClass={setSelectedClass} />
              <button className="btn btn-secondary" onClick={() => setBulkUploadModal(true)}>
                Bulk Upload
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!selectedClass) {
                    alert('Please select a class before adding results')
                    return
                  }
                  setFormData({ studentId: '', examType: 'unit-test', subjects: [{ name: '', marks: '', maxMarks: 100 }] })
                  setEditingResult(null)
                  setShowModal(true)
                }}
              >
                + Add Result
              </button>
            </div>
          </div>

          {!selectedClass ? (
            <div className="no-class-message">Please select a class to view results</div>
          ) : (
            <>
              <div className="results-toolbar">
                <button className="btn btn-sm btn-secondary" onClick={expandAll}>Expand All</button>
                <button className="btn btn-sm btn-secondary" onClick={collapseAll}>Collapse All</button>
                <button className="btn btn-sm btn-primary" onClick={publishAll}>Publish All Results</button>
              </div>

              {loading ? (
                <div className="loading">Loading results...</div>
              ) : (
                <div className="student-cards-container">
                  {Object.keys(grouped).length === 0 ? (
                    <div className="no-data">No results found for {selectedClass}</div>
                  ) : (
                    Object.values(grouped).map(group => (
                      <div key={group.student.id} className="student-card">
                        <div className="student-card-header" onClick={() => toggleStudentExpand(group.student.id)}>
                          <div className="student-info">
                            <span className="expand-icon">{expandedStudents.has(group.student.id) ? '▼' : '▶'}</span>
                            <span className="student-name">{group.student.name}</span>
                            <span className="student-class-badge">{group.student.class}</span>
                            <span className="student-roll">Roll: {group.student.rollNumber}</span>
                          </div>
                          <div className="student-summary">
                            <span className="summary-badge">Total: {group.totalMarks}/{group.totalMaxMarks}</span>
                            <span className="summary-badge">{group.overallPercentage.toFixed(2)}%</span>
                            <span className={`grade-badge ${group.finalGrade}`}>{group.finalGrade}</span>
                            <span className="gpa-badge">GPA: {group.finalGPA}</span>
                          </div>
                        </div>

                        {expandedStudents.has(group.student.id) && (
                          <div className="student-card-body">
                            {group.results.map(result => (
                              <div key={result.id} className="exam-block">
                                <div className="exam-header">
                                  <h4>{result.examType.replace('-', ' ').toUpperCase()}</h4>
                                  <span className={`status-badge ${result.status}`}>{result.status}</span>
                                  <button className="btn btn-sm btn-secondary" onClick={() => {
                                    setEditingResult(result)
                                    setFormData({ studentId: result.studentId, examType: result.examType, subjects: result.subjects })
                                    setShowModal(true)
                                  }}>Edit</button>
                                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteResult(result.id)}>Delete</button>
                                </div>
                                <table className="subjects-table">
                                  <thead>
                                    <tr>
                                      <th>Subject</th>
                                      <th>Marks</th>
                                      <th>Max</th>
                                      <th>%</th>
                                      <th>Grade</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.subjects.map((sub, idx) => {
                                      const pct = sub.maxMarks > 0 ? (sub.marks / sub.maxMarks) * 100 : 0
                                      const gr = calculateGrade(pct)
                                      return (
                                        <tr key={idx}>
                                          <td>{sub.name}</td>
                                          <td>{sub.marks}</td>
                                          <td>{sub.maxMarks}</td>
                                          <td>{pct.toFixed(1)}%</td>
                                          <td><span className={`grade-badge ${gr}`}>{gr}</span></td>
                                          <td><button className="btn btn-sm btn-danger" onClick={() => handleDeleteSubject(result.id, idx)}>Delete</button></td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                                <div className="exam-footer">
                                  <span>Exam %: {result.percentage}%</span>
                                  <span>Grade: <span className={`grade-badge ${result.grade}`}>{result.grade}</span></span>
                                  <span>GPA: {result.gpa}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingResult ? 'Edit Result' : 'Add New Result'}</h3>
                  <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                  <div className="form-group">
                    <label>Student</label>
                    <select value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value })} required disabled={!!editingResult}>
                      <option value="">Select Student</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Exam Type</label>
                    <select value={formData.examType} onChange={e => setFormData({...formData, examType: e.target.value })}>
                      <option value="unit-test">Unit Test</option>
                      <option value="mid-term">Mid Term</option>
                      <option value="final">Final Exam</option>
                    </select>
                  </div>
                  <div className="subjects-section">
                    <h4>Subjects</h4>
                    {formData.subjects.map((sub, idx) => (
                      <div key={idx} className="subject-row">
                        <input type="text" placeholder="Subject" value={sub.name} onChange={e => updateSubject(idx, 'name', e.target.value)} required />
                        <input type="number" placeholder="Marks" value={sub.marks} onChange={e => updateSubject(idx, 'marks', e.target.value)} required />
                        <input type="number" placeholder="Max" value={sub.maxMarks} onChange={e => updateSubject(idx, 'maxMarks', e.target.value)} required />
                        {formData.subjects.length > 1 && <button type="button" className="btn btn-sm btn-danger" onClick={() => removeSubject(idx)}>Remove</button>}
                      </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-secondary" onClick={addSubject}>+ Add Subject</button>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingResult ? 'Update' : 'Add'} Result</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {bulkUploadModal && (
            <div className="modal-overlay" onClick={() => setBulkUploadModal(false)}>
              <div className="modal wide-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Bulk Upload Results</h3>
                  <button className="modal-close" onClick={() => setBulkUploadModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <p>JSON format (grouped by student):</p>
                  <pre className="format-example">
{`[
  {
    "studentRoll": "1",
    "className": "Class 5",
    "exam": "Final Exam",
    "subjects": [
      {"subject": "Maths", "marks": 85, "maxMarks": 100},
      {"subject": "English", "marks": 90, "maxMarks": 100}
    ]
  }
]`}
                  </pre>
                  <textarea className="bulk-textarea" value={bulkData} onChange={e => setBulkData(e.target.value)} rows="10" placeholder="Paste JSON here..." />
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setBulkUploadModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleBulkUpload}>Upload</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Placeholder components for other routes (keeping existing functionality)
function StaffManagement() {
  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <main className="main-content">
        <div className="admin-page">
          <h2>Staff Management</h2>
          <p>Staff management functionality here.</p>
        </div>
      </main>
    </div>
  )
}

function Announcements() {
  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <main className="main-content">
        <div className="admin-page">
          <h2>Announcements</h2>
          <p>Announcements functionality here.</p>
        </div>
      </main>
    </div>
  )
}

function GalleryManagement() {
  return (
    <div className="app">
      <AppNavbar variant="admin" />
      <main className="main-content">
        <div className="admin-page">
          <h2>Gallery Management</h2>
          <p>Gallery management functionality here.</p>
        </div>
      </main>
    </div>
  )
}

function StudentDashboard() {
  return (
    <div className="app">
      <AppNavbar variant="student" />
      <main className="main-content">
        <div className="student-page">
          <h2>Student Dashboard</h2>
          <p>Welcome, {localStorage.getItem('studentName')}</p>
        </div>
      </main>
    </div>
  )
}

function MyAttendance() {
  return (
    <div className="app">
      <AppNavbar variant="student" />
      <main className="main-content">
        <div className="student-page">
          <h2>My Attendance</h2>
          <p>Attendance details here.</p>
        </div>
      </main>
    </div>
  )
}

function MyResults() {
  const [results, setResults] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return
      const { getStudentById, getResultsByStudent } = await getDbApi()
      const [studentData, resultsData] = await Promise.all([
        getStudentById(studentId),
        getResultsByStudent(studentId)
      ])
      setStudent(studentData)
      setResults(resultsData)
    } catch (error) {
      console.error('Failed to load results:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    return 'D'
  }

  const calculateGPA = (percentage) => {
    if (percentage >= 90) return 4.0
    if (percentage >= 80) return 3.7
    if (percentage >= 70) return 3.3
    if (percentage >= 60) return 3.0
    if (percentage >= 50) return 2.7
    return 2.0
  }

  const getOverallSummary = () => {
    let totalMarks = 0
    let totalMaxMarks = 0
    results.forEach(r => {
      totalMarks += r.subjects.reduce((s, sub) => s + parseFloat(sub.marks || 0), 0)
      totalMaxMarks += r.subjects.reduce((s, sub) => s + parseFloat(sub.maxMarks || 0), 0)
    })
    const overallPercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0
    return {
      totalMarks,
      totalMaxMarks,
      overallPercentage,
      finalGPA: calculateGPA(overallPercentage),
      finalGrade: calculateGrade(overallPercentage)
    }
  }

  if (loading) return <div className="loading">Loading results...</div>

  const summary = getOverallSummary()

  return (
    <div className="app">
      <AppNavbar variant="student" />
      <main className="main-content">
        <div className="student-page">
          <h2>My Results</h2>
          {student && results.length > 0 ? (
            <div className="marksheet-container">
              <div className="marksheet-header">
                <div className="school-name">PRATHMIK KUMARSHALA DEVLA</div>
                <div className="marksheet-title">STUDENT MARKSHEET</div>
                <div className="marksheet-subtitle">Academic Performance Report</div>
              </div>
              <div className="marksheet-student-info">
                <div className="info-item">
                  <span className="info-label">Student Name</span>
                  <span className="info-value">{student.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Class</span>
                  <span className="info-value">{student.class}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Roll Number</span>
                  <span className="info-value">{student.rollNumber}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date</span>
                  <span className="info-value">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="marksheet-table-container">
                <table className="marksheet-table">
                  <thead>
                    <tr>
                      <th>Exam Type</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Max Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(result => result.subjects.map((sub, idx) => {
                      const pct = sub.maxMarks > 0 ? (sub.marks / sub.maxMarks) * 100 : 0
                      return (
                        <tr key={`${result.id}-${idx}`}>
                          {idx === 0 && <td rowSpan={result.subjects.length}>{result.examType.replace('-', ' ').toUpperCase()}</td>}
                          <td>{sub.name}</td>
                          <td>{sub.marks}</td>
                          <td>{sub.maxMarks}</td>
                          <td>{pct.toFixed(1)}%</td>
                          <td><span className={`grade-badge ${calculateGrade(pct)}`}>{calculateGrade(pct)}</span></td>
                        </tr>
                      )
                    }))}
                  </tbody>
                </table>
              </div>
              <div className="marksheet-summary">
                <div className="summary-card">
                  <div className="summary-card-value">{summary.totalMarks}/{summary.totalMaxMarks}</div>
                  <div className="summary-card-label">Total Marks</div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-value">{summary.overallPercentage.toFixed(2)}%</div>
                  <div className="summary-card-label">Overall Percentage</div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-value">{summary.finalGPA}</div>
                  <div className="summary-card-label">Final GPA</div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-value"><span className={`grade-badge ${summary.finalGrade}`}>{summary.finalGrade}</span></div>
                  <div className="summary-card-label">Final Grade</div>
                </div>
              </div>
              <div className="marksheet-footer">
                This is a computer-generated marksheet. No signature required.
              </div>
            </div>
          ) : (
            <div className="no-data">No results found.</div>
          )}
        </div>
      </main>
    </div>
  )
}

function StudentAnnouncements() {
  return (
    <div className="app">
      <AppNavbar variant="student" />
      <main className="main-content">
        <div className="student-page">
          <h2>Announcements</h2>
          <p>Announcements here.</p>
        </div>
      </main>
    </div>
  )
}

function StudentGallery() {
  return (
    <div className="app">
      <AppNavbar variant="student" />
      <main className="main-content">
        <div className="student-page">
          <h2>Gallery</h2>
          <p>Gallery here.</p>
        </div>
      </main>
    </div>
  )
}

export default App