import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { User, Mail, Phone, MapPin, Globe, CreditCard, Save, Calendar, Flag } from 'lucide-react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Settings.module.css'; // Reusing settings styles for consistency
import './css/Profile.css'; // Custom styles

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Form State
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                setUser(data.user);
                setFormData(data.user);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setMessage('Profile updated successfully! 🎉');
                setUser(data.user);
                setEditMode(false);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <div className={styles.dashboardMain}>
                <Header />
                <main className="p-4 profile-page-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="text-white mb-1">My Profile</h2>
                            <p className="text-white-50">Manage your personal information</p>
                        </div>
                        <Button 
                            variant={editMode ? "secondary" : "primary"}
                            onClick={() => {
                                if(editMode) setFormData(user); // Reset on cancel
                                setEditMode(!editMode);
                                setMessage(null);
                                setError(null);
                            }}
                        >
                            {editMode ? 'Cancel Editing' : 'Edit Profile'}
                        </Button>
                    </div>

                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* Personal Information */}
                        <Card className="mb-4 bg-dark-subtle border-0 shadow-sm">
                            <Card.Header className="bg-transparent border-bottom border-secondary py-3">
                                <h5 className="mb-0 text-white"><User size={20} className="me-2 text-primary"/> Personal Details</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Full Name</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Username</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={formData.username || ''}
                                                disabled
                                                className="bg-dark text-white-50 border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Date of Birth</Form.Label>
                                            <Form.Control 
                                                type="date"
                                                name="dob"
                                                value={formData.dob ? formData.dob.split('T')[0] : ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Gender</Form.Label>
                                            <Form.Select 
                                                name="gender"
                                                value={formData.gender || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Citizenship No.</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                name="citizenNo"
                                                value={formData.citizenNo || ''}
                                                onChange={handleChange}
                                                disabled={!editMode} // Usually sensitive, maybe keep disabled? User asked for full edit.
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Contact Information */}
                        <Card className="mb-4 bg-dark-subtle border-0 shadow-sm">
                            <Card.Header className="bg-transparent border-bottom border-secondary py-3">
                                <h5 className="mb-0 text-white"><MapPin size={20} className="me-2 text-warning"/> Contact Information</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Email</Form.Label>
                                            <Form.Control 
                                                type="email"
                                                value={formData.contact?.email || ''}
                                                onChange={(e) => handleChange(e, 'contact')}
                                                name="email"
                                                disabled // Email usually not editable directly
                                                className="bg-dark text-white-50 border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Mobile Number</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={formData.contact?.mobile || ''}
                                                onChange={(e) => handleChange(e, 'contact')}
                                                name="mobile"
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Address</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={formData.contact?.address || ''}
                                                onChange={(e) => handleChange(e, 'contact')}
                                                name="address"
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Bank Details */}
                        <Card className="mb-4 bg-dark-subtle border-0 shadow-sm">
                            <Card.Header className="bg-transparent border-bottom border-secondary py-3">
                                <h5 className="mb-0 text-white"><CreditCard size={20} className="me-2 text-success"/> Bank Details</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Bank Name</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={formData.bankDetails?.bankName || ''}
                                                onChange={(e) => handleChange(e, 'bankDetails')}
                                                name="bankName"
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Branch</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={formData.bankDetails?.branch || ''}
                                                onChange={(e) => handleChange(e, 'bankDetails')}
                                                name="branch"
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Account Number</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={formData.bankDetails?.accountNumber || ''}
                                                onChange={(e) => handleChange(e, 'bankDetails')}
                                                name="accountNumber"
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="text-white-50">Account Type</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={formData.bankDetails?.accountType || ''}
                                                onChange={(e) => handleChange(e, 'bankDetails')}
                                                name="accountType"
                                                disabled={!editMode}
                                                className="bg-dark text-white border-secondary"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {editMode && (
                            <div className="d-flex justify-content-end mb-5">
                                <Button size="lg" variant="success" type="submit" disabled={saving}>
                                    {saving ? 'Saving...' : <><Save size={18} className="me-2"/> Save Changes</>}
                                </Button>
                            </div>
                        )}
                    </Form>
                </main>
            </div>
        </div>
    );
};

export default Profile;
