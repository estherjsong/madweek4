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

import { BackgroundOverlay} from '../../components/CommonStyles';

const LoginForm = ({ isVisible, onClose, onReg }) => {
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
    const handleLogin = (e) => {
        e.preventDefault();

        // Validate the form
        const isValid = validateForm();

        // If the form is valid, proceed with form submission
        if (isValid) {
            // Perform your form submission logic here
            console.log('Form submitted:', formData);
            onClose();
        } else {
            console.log('Form validation failed');
        }
    };

    // Update form data function
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <BackgroundOverlay isVisible={isVisible} onClick={onClose}>
            <Card isVisible={isVisible} onClick={(e) => e.stopPropagation()} style={{ width: '30%' }}>
                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                    <i class="bi bi-box-arrow-in-right"> </i>
                    Login
                </CardTitle>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <div className="text-danger">{errors.password}</div>}
                        </FormGroup>
                        
                        <Button onClick={handleLogin} className="btn" color="secondary" style={{width: '100%', marginBottom: '10px'}}>Login</Button>
                        <Button onClick={onReg} className="btn" outline color="secondary" style={{width: '100%'}}>Register</Button>
                    </Form>
                </CardBody>
            </Card>
        </BackgroundOverlay>
    );
};

export default LoginForm;
