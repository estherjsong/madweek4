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

const RegisterForm = ({ isVisible, onClose, onLog }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
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

        // Validate confirmPassword
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Set errors state
        setErrors(newErrors);

        // Return true if no errors, false otherwise
        return Object.keys(newErrors).length === 0;
    };

    // Submit function
    const handleSubmit = (e) => {
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
            <Card isVisible={isVisible} onClick={(e) => e.stopPropagation()} style={{ width: '40%' }}>
                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                    <i class="bi bi-pencil-square">  </i>
                    Register
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
                        <FormGroup>
                            <Label for="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="confirm password"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleText">Introduce Yourself</Label>
                            <Input id="exampleText" name="text" type="textarea" />
                        </FormGroup>

                        <FormGroup check>
                            <Input type="checkbox" /> <Label check>Check me out</Label>
                        </FormGroup>
                        <Button onClick={handleSubmit} className="btn" color="secondary" style={{width: '100%', marginTop:'10px', marginBottom: '10px'}}>Submit</Button>
                        <Button onClick={onLog} className="btn" outline color="secondary" style={{width: '100%'}}>Login</Button>
                    </Form>
                </CardBody>
            </Card>
        </BackgroundOverlay>
    );
};

export default RegisterForm;
