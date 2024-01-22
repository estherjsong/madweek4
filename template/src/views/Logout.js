import {
    Card,
    CardTitle,
    CardBody,
    Button,
} from "reactstrap";
import React from 'react';
import { API_BASE_URL } from "../config";
import { BackgroundOverlay } from '../components/CommonStyles';
import { useNavigate } from "react-router-dom";

const LogoutForm = ({ isVisible, onClose }) => {
    const navigate = useNavigate();

    // Submit function
    const handleLogout = async (e) => {

        localStorage.clear();

        try {
            // Perform your form submission logic here
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const result = await response.json();

            console.log("response", response)

        } catch (error) {
            console.error('An error occurred during login:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }

        navigate('/');
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
