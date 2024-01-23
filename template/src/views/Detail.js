import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Row, Col, CardTitle, CardBody, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CodeMirror from '@uiw/react-codemirror';
import { darcula } from '@uiw/codemirror-themes-all';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'react-tagsinput/react-tagsinput.css'; // Import the styles for react-tagsinput
import TagsInput from 'react-tagsinput'; // Import the react-tagsinput component
import { API_BASE_URL } from '../config';
import language from './languages.json';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import axios from 'axios';
import Loader from '../layouts/loader/Loader';
import { formatDateString } from '../dateUtils';

const Detail = () => {
    const id = localStorage.getItem('id');
    console.log("userid", id)
    const answersData = [
        {
            id: 1,
            author: 'John Doe',
            timestamp: '2024-01-21T10:30:00Z',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            startLineNumber: 3,  // Add the start line number
            endLineNumber: 7,    // Add the end line number
        },
        {
            id: 2,
            author: 'Jane Doe',
            timestamp: '2024-01-21T12:45:00Z',
            content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            startLineNumber: 6,  // Add the start line number
            endLineNumber: 9,    // Add the end line number
        },
        {
            id: 3,
            author: 'Alice Smith',
            timestamp: '2024-01-22T08:15:00Z',
            content: 'A new answer from another user.',
            startLineNumber: 5,  // Add the start line number
            endLineNumber: 6,    // Add the end line number
        },
        // Add more dummy answers as needed
    ];

    const { questionId } = useParams();
    const [post, setPost] = useState();
    const [loading, setLoading] = useState(true); // Track loading state
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();

    const toggle = () => setModal(!modal);

    useEffect(() => {
        // Define your function to fetch data
        const fetchData = async () => {
            try {
                const response = await axios.get(`/question/${questionId}`);
                setPost(response.data);
                console.log(response.data);
                // console.log(typeof id, typeof post.userId, parseInt(id)===post.userId)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        // Call the fetchData function when the component mounts or currentPage changes
        fetchData();
    }, [questionId]); // Include questionId as a dependency

    const handleGoBack = () => {
        navigate(-1); // Equivalent to history.goBack()
    };

    const deleteQuestion = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/question/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            console.log(response.data);
            // console.log(typeof id, typeof post.userId, parseInt(id)===post.userId)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            navigate('/questions');
        }
    };


    return (
        <Suspense fallback={<Loader />}>
            {loading ? (
                <Loader />
            ) : (
                <Row>
                    <Col lg="12">
                        <Card style={{ maxWidth: '1210px', overflowX: 'auto' }}>
                            <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between flex-column flex-sm-row">
                                <div className="p-2">
                                    <i className="bi bi-chevron-left me-2" onClick={handleGoBack}></i>
                                    # {questionId} Question
                                </div>

                                <div className="me-3">
                                    {(parseInt(id) === post.userId) &&
                                        <div>
                                            <Link to={`/edit/${post.id}`} className='me-3'>
                                                <Button className="btn" color="primary" size="sm">
                                                    <i className="bi bi-pencil-square"> </i>
                                                    {/* <span className="d-none d-sm-inline"> Edit Question</span> */}
                                                </Button>
                                            </Link>
                                            <Button className="btn" color="primary" size="sm" onClick={toggle} color="danger">
                                                <i className="bi bi-trash"> </i>
                                                {/* <span className="d-none d-sm-inline"> Delete Question</span> */}
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </CardTitle>
                            <CardBody>
                                <CardText>
                                    {post.title}
                                </CardText>
                                <CodeMirror
                                    className='mb-3'
                                    id="code"
                                    value={post.code}
                                    // value={'#include <stdio.h>\n\nint main() {\n    for(int i=0; i<5; i++){\n        for(int j=0; j<5; j++){\n            printf(\'%d %d\', i, j);\n        }\n    }\n     return 0;\n}'}
                                    theme={darcula}
                                    minHeight={'100px'}
                                    extensions={[loadLanguage(post.tags[0].name), EditorView.editable.of(false), EditorState.readOnly.of(true)]}
                                />

                                <Row>
                                    <Col>
                                        {post.tags.map((tag) => (
                                            <Button className="btn me-2" outline color="primary" size="sm" onClick={() => { navigate(`/questions?tag=${tag.name}`) }}>
                                                {tag.name}
                                            </Button>
                                        ))}
                                    </Col>
                                    <Col xs='auto' className='ms-auto'>
                                        <div className="d-flex flex-column">
                                            <small className="text-muted ms-auto">{formatDateString(post.createdAt)}</small>
                                            <small className="text-muted ms-auto">{post.user.nickname}</small>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        {answersData.map((answer, index) => (
                            <Card>
                                <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between">
                                    <div className='p-2'>
                                        {/* <i className="bi bi-chevron-left me-2"></i> */}
                                        # {index + 1} Answer
                                    </div>
                                    <Button className="btn me-2" outline color="primary" size="sm">
                                        <i className="bi bi-hand-thumbs-up me-2"> </i>
                                        {/* <i className ="bi bi-hand-thumbs-up-fill me-2"></i> */}
                                        6
                                    </Button>
                                </CardTitle>
                                <CardBody>
                                    <CardText>
                                        {answer.content}
                                    </CardText>
                                    <Col xs='auto' className='ms-auto'>
                                        <div className="d-flex flex-column">
                                            <small className="text-muted ms-auto">{formatDateString(answer.timestamp)}</small>
                                            <small className="text-muted ms-auto">{answer.author}</small>
                                        </div>
                                    </Col>
                                </CardBody>
                            </Card>
                        ))}
                        <Modal isOpen={modal} toggle={toggle}>
                            <ModalHeader toggle={toggle}>Question Deletion</ModalHeader>
                            <ModalBody>
                                Are you sure you want to delete this post? This action cannot be undone.
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={toggle}>
                                    Cancel
                                </Button>{' '}
                                <Button color="primary" onClick={deleteQuestion}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </Col>
                </Row >
            )}
        </Suspense >
    );
}

export default Detail;