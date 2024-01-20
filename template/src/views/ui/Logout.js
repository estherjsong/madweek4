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
import { API_BASE_URL } from "../../config";
import { BackgroundOverlay } from '../../components/CommonStyles';

const LogoutForm = ({ isVisible, onClose }) => {

    // Submit function
    const handleLogout = async (e) => {
        localStorage.removeItem('userId');
        localStorage.removeItem('nickname');
        localStorage.clear();

        try {
            // Perform your form submission logic here
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                // 로그인이 성공한 경우
                console.log('Logout successful - result:', result);

                // 여기에서 result에 있는 정보를 활용하여 필요한 작업을 수행할 수 있습니다.
                const { success } = result;
                if (success) {
                    console.log("logout success")
                }

                onClose();
            } else {
                // 로그인이 실패한 경우
                console.log('Logout failed:', result);
                // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }

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
