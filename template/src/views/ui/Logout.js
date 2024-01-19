import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
} from "reactstrap";
import React, { useState } from 'react';

import { BackgroundOverlay } from '../../components/CommonStyles';

const LogoutForm = ({ isVisible, onClose, logout }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Validate email
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        // Set errors state
        setErrors(newErrors);

        // Return true if no errors, false otherwise
        return Object.keys(newErrors).length === 0;
    };

    // Submit function
    const handleLogout = (e) => {
        logout()
        onClose()
        window.location.reload();
    };

    return (
        <BackgroundOverlay isVisible={isVisible} onClick={onClose}>
            <Card isVisible={isVisible} onClick={(e) => e.stopPropagation()} style={{ width: '40%' }}>
                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                    <i class="bi bi-box-arrow-right"> </i>
                    Logout
                </CardTitle>
                <CardBody>
                    <p>Are you sure you want to log out?</p>

                    <Button className="btn" outline color="primary"
                        onClick={onClose}>
                        Cancel
                    </Button>
                    &nbsp;&nbsp;
                    <Button className="btn" color="primary"
                        onClick={handleLogout}>
                        Confirm
                    </Button>
                </CardBody>
            </Card>
        </BackgroundOverlay>
    );
};

export default LogoutForm;
