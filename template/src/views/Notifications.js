import React, { useEffect, useState } from "react";
import {
    Alert,
    UncontrolledAlert,
    Card,
    CardBody,
    CardTitle,
} from "reactstrap";
import { API_BASE_URL } from "../config";
import { formatDateString } from "../dateUtils";
import { Link } from "react-router-dom";

const Notifications = () => {
    // For Dismiss Button with Alert
    const [visible, setVisible] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const onDismiss = async (alertId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notification/${alertId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                console.log('Notifications get successful', result);
                fetchData();
            } else {
                console.log('Notifications get failed:', result);
            }
        } catch (error) {
            console.error('An error occurred during getting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/notification`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                console.log('Notifications get successful', result);
                setAlerts(result);
                console.log(alerts)
            } else {
                console.log('Notifications get failed:', result);
            }
        } catch (error) {
            console.error('An error occurred during getting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const renderAlertContent = (alert) => {
        switch (alert.content) {
            case "올리신 답변에 좋아요가 달렸습니다!":
                return <div>Your answer received a like!</div>;
            case "올리신 질문에 답변이 달렸습니다!":
                return <div>Your question received an answer!</div>;
            default:
                return <div>{alert.content}</div>;
        }
    };

    return (
        <div>
            {/* --------------------------------------------------------------------------------*/}
            {/* Card-1*/}
            {/* --------------------------------------------------------------------------------*/}
            <Card>
                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                    <i className="bi bi-bell me-2" />
                    Notifications
                </CardTitle>
                <CardBody className="">
                    <div>
                        {alerts.length > 0 && (
                            alerts.map((alert) => (
                                <Alert key={alert.id} color="info" isOpen={visible} toggle={() => onDismiss(alert.id)}>
                                    <Link to="/starter" className="nav-link">
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <span>
                                                {renderAlertContent(alert)}
                                            </span>
                                            <span>
                                                {formatDateString(alert.createdAt)}
                                            </span>
                                        </div>
                                    </Link>
                                </Alert>
                            ))
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* --------------------------------------------------------------------------------*/}
            {/* End Inner Div*/}
            {/* --------------------------------------------------------------------------------*/}
        </div >
    );
};

export default Notifications;
