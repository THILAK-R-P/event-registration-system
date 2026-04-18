import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import '../css/dashboard.css';
import { toast } from 'react-toastify';

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
    const [activeTab, setActiveTab] = useState('bit'); // 'bit' or 'other'
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('1');
    const [deleteModalOption, setDeleteModalOption] = useState({ isOpen: false, eventId: null });
    const [joinModalOption, setJoinModalOption] = useState({ isOpen: false, eventId: null });
    const [participantsModalOption, setParticipantsModalOption] = useState({ isOpen: false, participants: [], eventTitle: '' });
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


    const initiateJoin = (eventId) => {
        setJoinModalOption({ isOpen: true, eventId });
    };

    const cancelJoin = () => {
        setJoinModalOption({ isOpen: false, eventId: null });
    };

    const confirmJoin = async () => {
        const eventId = joinModalOption.eventId;
        setJoinModalOption({ isOpen: false, eventId: null });
        if (!eventId) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.warning("Please login to join events");
                navigate('/login');
                return;
            }
            await axios.post(`http://localhost:5000/api/events/${eventId}/join`, {}, {
                headers: {
  Authorization: `Bearer ${token}`
}
            });
            toast.success('Successfully Joined!');
            fetchEvents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to join');
        }
    };

    const initiateDelete = (eventId) => {
        setDeleteModalOption({ isOpen: true, eventId });
    };

    const cancelDelete = () => {
        setDeleteModalOption({ isOpen: false, eventId: null });
    };

    const confirmDelete = async () => {
        const eventId = deleteModalOption.eventId;
        setDeleteModalOption({ isOpen: false, eventId: null });
        if (!eventId) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
                headers: {
  Authorization: `Bearer ${token}`
}
            });
            toast.success('Event Deleted');
            fetchEvents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete Failed');
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
                                                        toast.warning("You must be logged in to delete events");
                                                        return;
                                                    }
                                                    initiateDelete(event._id);
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
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                                                <Link
                                                    to={`/update-event/${event._id}`}
                                                    className="btn btn-primary w-full"
                                                    style={{ textAlign: 'center' }}
                                                >
                                                    Update Event
                                                </Link>
                                                <button
                                                    onClick={() => setParticipantsModalOption({ isOpen: true, participants: event.attendees, eventTitle: event.title })}
                                                    className="btn btn-secondary w-full"
                                                >
                                                    Participants
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => initiateJoin(event._id)}
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

                {/* Confirm Delete Modal */}
                {deleteModalOption.isOpen && (
                    <div className="absolute-modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="modal-content" style={{
                            background: 'var(--surface-color)', padding: '2rem', borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ marginTop: 0, fontSize: '1.25rem', color: 'var(--text-color)' }}>Confirm Delete</h3>
                            <p style={{ margin: '1rem 0', color: 'var(--text-color)' }}>Are you sure you want to delete this event? This action cannot be undone.</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                                <button onClick={cancelDelete} className="btn btn-cancel">Cancel</button>
                                <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm Join Modal */}
                {joinModalOption.isOpen && (
                    <div className="absolute-modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="modal-content" style={{
                            background: 'var(--surface-color)', padding: '2rem', borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ marginTop: 0, fontSize: '1.25rem', color: 'var(--text-color)' }}>Confirm Join</h3>
                            <p style={{ margin: '1rem 0', color: 'var(--text-color)' }}>Are you sure you want to join this event?</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                                <button onClick={cancelJoin} className="btn btn-cancel">Cancel</button>
                                <button onClick={confirmJoin} className="btn btn-primary">Join</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Participants Modal */}
                {participantsModalOption.isOpen && (
                    <div className="absolute-modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="modal-content" style={{
                            background: 'var(--surface-color)', padding: '2rem', borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px', width: '90%',
                            maxHeight: '80vh', overflowY: 'auto',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ marginTop: 0, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                                Participants: {participantsModalOption.eventTitle}
                            </h3>
                            
                            {participantsModalOption.participants && participantsModalOption.participants.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    {participantsModalOption.participants.map((p, idx) => {
                                        const isString = typeof p === 'string';
                                        const username = isString ? 'Unknown User' : (p.username || p.name || 'Unknown User');
                                        const email = isString ? 'No email provided' : (p.email || 'No email provided');
                                        
                                        return (
                                            <div key={isString ? idx : (p._id || idx)} style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--background-color)', display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{username}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{email}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No participants have joined this event yet.</p>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setParticipantsModalOption({ isOpen: false, participants: [], eventTitle: '' })} className="btn btn-cancel">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;