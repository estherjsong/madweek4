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
import { API_BASE_URL } from "../config";
import { BackgroundOverlay } from '../components/CommonStyles';

const LoginForm = ({ isVisible, onClose, onReg }) => {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Validate userId
        if (!formData.userId) {
            newErrors.userId = 'ID is required';
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
    const handleLogin = async (e) => {
        e.preventDefault();

        // Validate the form
        const isValid = validateForm();


        // localStorage.setItem('nickname', 'aaa')
        // console.log(localStorage.getItem('nickname'))

        // If the form is valid, proceed with form submission
        if (isValid) {
            // Perform your form submission logic here
            try {
                // Perform your form submission logic here
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                console.log("response", response)

                if (response.ok) {
                    // 로그인이 성공한 경우
                    console.log('Login successful - result:', result);

                    localStorage.setItem('userId', result.userId)
                    localStorage.setItem('nickname', result.nickname)
                    localStorage.setItem('id', result.id)
                    localStorage.setItem('introductioin', result.introduction)

                    // cookie.save('userId',result.userId, {
                    //     path: '/',
                    // })

                    onClose();
                    window.location.reload();

                } else {
                    // 로그인이 실패한 경우
                    console.log('Login failed:', result);
                    // 여기에서 적절한 에러 처리를 수행할 수 있습니다.

                    const newErrors = {};
                    switch (result.message) {
                        case '존재하지 않는 아이디입니다.':
                            newErrors.userId = 'This ID does not exist.';
                            break;
                        case '비밀번호가 일치하지 않습니다.':
                            newErrors.password = 'Passwords do not match.';
                            break;
                        default:
                            // 처리하고자 하는 에러 메시지가 없을 경우 아무 작업도 하지 않음
                            break;
                    }
                    console.log(newErrors);
                    setErrors(newErrors);
                }
            } catch (error) {
                console.error('An error occurred during login:', error);
                // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
            }
        } else {
            console.log('Form validation failed');
        }
    };

    // Handle key press event
    const handleKeyPress = (e) => {
        // 엔터 키를 눌렀을 때 handleLogin 함수 호출
        if (e.key === 'Enter') {
            handleLogin(e);
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
                            <Label for="userId">ID</Label>
                            <Input
                                id="userId"
                                name="userId"
                                placeholder="userId"
                                type="text"
                                value={formData.ID}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                            {errors.userId && <div className="text-danger">{errors.userId}</div>}
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
                                onKeyPress={handleKeyPress}
                            />
                            {errors.password && <div className="text-danger">{errors.password}</div>}
                        </FormGroup>

                        <Button onClick={handleLogin} className="btn" color="secondary" style={{ width: '100%', marginBottom: '10px' }}>Login</Button>
                        <Button onClick={onReg} className="btn" outline color="secondary" style={{ width: '100%' }}>Register</Button>
                    </Form>
                </CardBody>
            </Card>
        </BackgroundOverlay>
    );
};

export default LoginForm;
