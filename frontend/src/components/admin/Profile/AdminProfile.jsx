import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { User, Mail, Phone, MapPin, CreditCard, Save } from 'lucide-react';

const AdminProfile = () => {
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
            // Assuming admin profile can be fetched from the same endpoint or similar
            // If admin has a different endpoint, user should specify, but 'api/auth/profile' is usually generic
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
        <div className="d-flex justify-content-center align-items-center h-100 text-dark">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (!user) return (
        <div className="p-4">
            <Alert variant="danger">{error || 'Failed to load profile'}</Alert>
        </div>
    );

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 text-dark">My Profile</h2>
                    <p className="text-secondary">Manage your admin account details</p>
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
                <Card className="mb-4 text-dark border shadow-sm">
                    <Card.Header className="bg-white border-bottom py-3">
                        <h5 className="mb-0 text-dark"><User size={20} className="me-2 text-primary"/> Personal Details</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-secondary">Full Name</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName || ''}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-secondary">Username</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        value={formData.username || ''}
                                        disabled
                                        className="text-muted"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-secondary">Email</Form.Label>
                                    <Form.Control 
                                        type="email"
                                        value={formData.contact?.email || ''}
                                        disabled
                                        className="text-muted"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-secondary">Role</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        value={user.isAdmin ? 'Admin' : 'User'}
                                        disabled
                                        className="text-muted"
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
        </div>
    );
};

export default AdminProfile;
