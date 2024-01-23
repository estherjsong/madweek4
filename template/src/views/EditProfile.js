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

const RegisterForm = ({ isVisible, onClose, onLog }) => {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        introduction: '',
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

        // Validate confirmPassword
        // if (formData.password !== formData.confirmPassword) {
        //     newErrors.confirmPassword = 'Passwords do not match';
        // }

        // Set errors state
        setErrors(newErrors);

        // Return true if no errors, false otherwise
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const isValid = validateForm();
        console.log(isValid, formData, JSON.stringify(formData))

        // If the form is valid, proceed with form submission
        if (isValid) {
            try {
                // Perform your form submission logic here
                const response = await fetch(`${API_BASE_URL}/signup`, {
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
                    // 회원가입이 성공한 경우
                    console.log('Registration successful:', result);

                    // 여기에서 result에 있는 정보를 활용하여 필요한 작업을 수행할 수 있습니다.
                    const { success, user } = result;
                    if (success) {
                        console.log('User ID:', user.userId);
                        console.log('Nickname:', user.nickname);
                        // 원하는 작업 수행
                    }

                    onClose();
                    onLog();
                } else {
                    // 회원가입이 실패한 경우
                    console.log('Registration failed:', result);
                    // 여기에서 적절한 에러 처리를 수행할 수 있습니다.

                    const newErrors = {};
                    result.errors.forEach((error) => {
                        // error.msg에 따라 각각의 처리
                        switch (error.msg) {
                            case '아이디는 6-12자 이내의 영문/숫자만 사용 가능합니다.':
                                newErrors.userId = 'The ID can only contain letters and numbers within 6-12 characters.';
                                break;
                            case '이미 존재하는 아이디입니다.':
                                newErrors.userId = 'The ID that already exists.';
                                break;
                            case '비밀번호는 8자 이상의 문자/숫자가 포함되어야합니다.':
                                newErrors.password = 'Password must contain at least 8 letters / numbers.';
                                break;
                            case '비밀번호가 일치하지 않습니다.':
                                newErrors.confirmPassword = 'Passwords do not match.';
                                break;
                            case '닉네임은 3-16자만 사용 가능합니다.':
                                newErrors.nickname = 'Nicknames can only contain 3-16 characters.';
                                break;
                            case '닉네임은 3-16자만 사용 가능합니다.':
                                newErrors.nickname = 'The nickname that already exists.';
                                break;
                            default:
                                // 처리하고자 하는 에러 메시지가 없을 경우 아무 작업도 하지 않음
                                break;
                        }
                    });

                    setErrors(newErrors);
                }
            } catch (error) {
                console.error('An error occurred during registration:', error);
                // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
            }
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
                    Edit Profile
                </CardTitle>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="userId">ID</Label>
                            <Input
                                id="userId"
                                name="userId"
                                placeholder="ID"
                                type="text"
                                value={formData.userId}
                                onChange={handleChange}
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
                            <Label for="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                name="nickname"
                                placeholder="nickname"
                                type="text"
                                value={formData.nickname}
                                onChange={handleChange}
                            />
                            {errors.nickname && <div className="text-danger">{errors.nickname}</div>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="introduction">Introduce Yourself</Label>
                            <Input
                                id="introduction"
                                name="introduction"
                                type="textarea"
                                value={formData.introduction}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup check>
                            <Input type="checkbox" /> <Label check>Check me out</Label>
                        </FormGroup>
                        <Button onClick={handleSubmit} className="btn" color="secondary" style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}>Submit</Button>
                    </Form>
                </CardBody>
            </Card>
        </BackgroundOverlay>
    );
};

export default RegisterForm;
