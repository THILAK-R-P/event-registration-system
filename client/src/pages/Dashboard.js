import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import '../css/dashboard.css';

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const paddedHour = hour.toString().padStart(2, '0');
    return `${paddedHour}:${minute} ${ampm}`;
};

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
    const [activeTab, setActiveTab] = useState('bit'); // 'bit' or 'other'
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('1');
    const eventsPerPage = 9;
    const navigate = useNavigate();

    const userRole = localStorage.getItem('role') || 'user';

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    const handleJoin = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to join events");
                navigate('/login');
                return;
            }
            await axios.post(`http://localhost:5000/api/events/${eventId}/join`, {}, {
                headers: { Authorization: token }
            });
            alert('Successfully Joined!');
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join');
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
                headers: { Authorization: token }
            });
            alert('Event Deleted');
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete Failed');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const filteredEvents = events.filter(event => {
        const locationLower = (event.location || '').toLowerCase();
        const isBitEvent = locationLower.includes('bit') || locationLower.includes('bannari amman institute of technology');
        const tabMatch = activeTab === 'bit' ? isBitEvent : !isBitEvent;
        if (!tabMatch) return false;

        const searchLower = searchTerm.toLowerCase();
        if (!searchLower) return true;

        const titleMatch = (event.title || '').toLowerCase().includes(searchLower);
        const locMatch = locationLower.includes(searchLower);
        return titleMatch || locMatch;
    });

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setPageInput(newPage.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageSubmit = (e, totalPages) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            let targetPage = parseInt(pageInput, 10);
            if (isNaN(targetPage)) {
                setPageInput(currentPage.toString());
                return;
            }
            if (targetPage < 1) targetPage = 1;
            if (targetPage > totalPages) targetPage = totalPages;

            handlePageChange(targetPage);
        }
    };

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    return (
        <div className="dashboard-page">
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">EventSys</Link>
                    </div>
                    <div className="nav-menu">
                        <DarkModeToggle />
                        <span className="nav-link active">Dashboard</span>
                        {userRole === 'admin' && <Link to="/create-event" className="nav-link">Create Event</Link>}
                        {userRole === 'user' && <Link to="/myevents" className="nav-link">My Events</Link>}
                        <button onClick={handleLogout} className="btn btn-danger" style={{ border: 'none' }}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container main-content-area">
                <div className="dashboard-header-section">
                    <h2>Event Dashboard</h2>
                </div>

                {/* Categorization & Create Button Row */}
                <div className="dashboard-actions">
                    {/* Toggles Group */}
                    <div className="dashboard-toggles">
                        <button
                            className={`btn ${activeTab === 'bit' ? 'btn-primary' : 'toggle-btn-secondary'}`}
                            onClick={() => { setActiveTab('bit'); setCurrentPage(1); }}
                        >
                            BIT Events
                        </button>
                        <button
                            className={`btn ${activeTab === 'other' ? 'btn-primary' : 'toggle-btn-secondary'}`}
                            onClick={() => { setActiveTab('other'); setCurrentPage(1); }}
                        >
                            Other Events
                        </button>
                    </div>

                    {/* Create Button */}
                    {userRole === 'admin' && (
                        <Link to="/create-event" className="btn btn-primary">
                            + Create New Event
                        </Link>
                    )}
                </div>

                <div className="dashboard-header-with-search">
                    <h3>Upcoming Events ({activeTab === 'bit' ? 'BIT' : 'Other'})</h3>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search events by title or location..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="input-field search-input"
                        />
                    </div>
                </div>

                {filteredEvents.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', background: 'var(--surface-color)', borderRadius: 'var(--radius)' }}>
                        <p>No matching events found</p>
                    </div>
                ) : (
                    <>
                        <div className="events-grid">
                            {filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage).map(event => (
                                <div key={event._id} className="event-card">
                                    <div className="card-body">
                                        <div className="card-top">
                                            <div style={{ flex: 1 }}>
                                                <h4 className="event-title">{event.title}</h4>
                                                <div style={{ marginTop: '0.25rem' }}></div>
                                            </div>
                                            {userRole === 'admin' && (
                                                <button onClick={() => {
                                                    const token = localStorage.getItem('token');
                                                    if (!token) {
                                                        alert("You must be logged in to delete events");
                                                        return;
                                                    }
                                                    handleDelete(event._id);
                                                }} className="btn btn-danger btn-sm-delete">
                                                    Delete
                                                </button>
                                            )}
                                        </div>

                                        <p className="event-description">{event.description}</p>

                                        <div className="event-details">
                                            <div className="detail-item">
                                                📅 {new Date(event.date).toLocaleDateString()} {event.time && `at ${formatTime(event.time)}`}
                                            </div>
                                            <div className="detail-item">
                                                📍 {event.location}
                                            </div>
                                            <div className="detail-item">
                                                Attendees: {event.attendees.length}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-footer" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                                        {event.brochureUrl && (
                                            <a
                                                href={event.brochureUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn w-full"
                                                style={{ textAlign: 'center', backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none' }}
                                            >
                                                View Brochure
                                            </a>
                                        )}
                                        {userRole === 'admin' ? (
                                            <Link
                                                to={`/update-event/${event._id}`}
                                                className="btn btn-primary w-full"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Update Event
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleJoin(event._id)}
                                                className="btn btn-primary w-full"
                                            >
                                                Join Event
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {filteredEvents.length > eventsPerPage && (
                            <div className="pagination">
                                <button
                                    className="btn btn-secondary pagination-btn"
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="pagination-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Page
                                    <input
                                        type="number"
                                        value={pageInput}
                                        onChange={(e) => setPageInput(e.target.value)}
                                        onKeyDown={(e) => handlePageSubmit(e, totalPages)}
                                        onBlur={(e) => handlePageSubmit(e, totalPages)}
                                        className="input-field"
                                        style={{ width: '60px', padding: '0.25rem 0.5rem', textAlign: 'center', margin: '0 0.25rem' }}
                                        min="1"
                                        max={totalPages}
                                    />
                                    of {totalPages}
                                </span>
                                <button
                                    className="btn btn-secondary pagination-btn"
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;