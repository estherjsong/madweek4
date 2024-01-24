import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Row, Col, CardTitle, CardBody, CardText, Button, Modal, ModalHeader, Form, FormGroup, Label, ModalBody, ModalFooter, Input, UncontrolledPopover, PopoverBody } from 'reactstrap';
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
import './animation.css'

const Detail = () => {
    const id = localStorage.getItem('id');
    console.log("userid", id)

    const { questionId } = useParams();
    const [post, setPost] = useState();
    const [loading, setLoading] = useState(true); // Track loading state
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const codeMirrorRef = useRef(null);
    const [selectedLine, setSelectedLine] = useState(0);
    const [codeMirrorTop, setCodeMirrorTop] = useState(0);
    const answerCardsContainerRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [answersList, setAnswersList] = useState([]);

    const [likes, setLikes] = useState({});
    const [lookingLines, setLookingLines] = useState([]);
    const [lineCounts, setLineCounts] = useState([]);
    const [lineCount, setLineCount] = useState(0);

    const handleButtonClick = (lineNumber) => {
        console.log(`Button clicked for Line ${lineNumber}`);

        setSelectedLine(lineNumber);
        setDescription(comments.find(comment => comment.line === lineNumber)?.description);
        if (codeMirrorRef.current) {
            const view = codeMirrorRef.current.view;
            const tr = view.state.update({
                selection: {
                    anchor: view.state.doc.line(lineNumber).from,
                    head: view.state.doc.line(lineNumber).to,
                },
            });
            view.dispatch(tr);
        }
    };

    const handleChange = (editor, data, value) => {
        setCode(editor)
    };

    const handleLike = async (answerId, like) => {
        try {
            const currentLike = likes[answerId];
            console.log("sendinglike", currentLike, currentLike === like ? 0 : like)

            const response = await fetch(`${API_BASE_URL}/answer/like/${answerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    like: currentLike === like ? 0 : like,
                }),
            });

            const result = await response.json();

            console.log("response", response);

            if (response.ok) {
                console.log('Answer like post successful', result);
                fetchAnswers();
            } else {
                console.log('Answer like post failed:', result);
                result.errors.forEach((error) => {
                    // error.msg에 따라 각각의 처리
                    switch (error.msg) {
                        case '사용자가 작성한 답변입니다.':
                            alert('Likes and dislikes are not available for your own responses.');
                    }
                });
            }
        } catch (error) {
            console.error('An error occurred during posting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
    }
    async function getLike(answerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/answer/like/${answerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                console.log('Answer getLike successful', result);
                console.log(result.like, typeof (result.like));
                return result.like;
            } else {
                console.log('Answer getLike failed:', result);
            }
        } catch (error) {
            console.error('An error occurred during posting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
        return 0;
    }

    const handleAnswerPost = async () => {
        console.log(comments);
        try {
            const response = await fetch(`${API_BASE_URL}/answer/${questionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    code: code,
                    comments: comments,
                }),
            })
            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                console.log('Answer post successful', result);
                fetchAnswers();
                setCode('');
                setDescription('');
            } else {
                console.log('Answer post failed:', result);
            }
        } catch (error) {
            console.error('An error occurred during posting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
    }

    const updateLineCount = (answerIndex, count) => {
        setLineCounts((prevLineCounts) => {
            const updatedLineCounts = [...prevLineCounts];
            updatedLineCounts[answerIndex] = count;
            return updatedLineCounts;
        });
        console.log("lineCounts", lineCounts);
    };

    const setLookingLine = (answerIndex, lineNumber) => {
        setLookingLines((prevLookingLines) => {
            const updatedLookingLines = [...prevLookingLines];
            updatedLookingLines[answerIndex] = lineNumber;
            return updatedLookingLines;
        });
    };

    // getLike 함수를 한 번만 호출하여 결과를 저장
    useEffect(() => {
        const fetchLikes = async () => {
            const likesMap = {};
            for (const answer of answersList) {
                const likeValue = await getLike(answer.id);
                likesMap[answer.id] = likeValue;
            }
            setLikes(likesMap);
        };

        fetchLikes();
    }, [answersList]);

    const fetchAnswers = async () => {
        try {
            const response = await axios.get(`/answer/${questionId}`);
            setAnswersList(response.data);
            console.log("fetchComments", response.data);
            response.data.forEach((answer, index) => {
                const codeString = answer.code || '';
                const lines = (codeString.match(/\n/g) || []).length + 1;
                updateLineCount(index, lines);
                console.log("update Likes", likes);
            })
            // console.log(typeof id, typeof post.userId, parseInt(id)===post.userId)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
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
        fetchAnswers();
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



    const renderLikeButton = (answerId, likeType) => (
        <Button
            className="btn ms-2 me-2"
            outline
            color={likeType === -1 ? "danger" : "primary"}
            size="sm"
            onClick={() => handleLike(answerId, likeType)}
        >
            {likes[answerId] === likeType ? (
                likeType === -1 ? (
                    <i className="bi bi-hand-thumbs-down-fill"></i>
                ) : (
                    <i className="bi bi-hand-thumbs-up-fill"></i>
                )
            ) : (
                likeType === -1 ? (
                    <i className="bi bi-hand-thumbs-down"></i>
                ) : (
                    <i className="bi bi-hand-thumbs-up"></i>
                )
            )}
        </Button>
    );



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
                                                </Button>
                                            </Link>
                                            <Button className="btn" size="sm" onClick={toggle} color="danger">
                                                <i className="bi bi-trash"> </i>
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </CardTitle>
                            <CardBody>
                                {/* <Row>
                                    <Col sm="5" lg="4" xl="4" xxl="4" className="order-2">
                                        <CardText>
                                            {post.title}
                                        </CardText>
                                    </Col>
                                    <Col sm="7" lg="8" xl="8" xxl="8" className="order-1">
                                        <CodeMirror
                                            className='mb-3'
                                            id="code"
                                            value={post.code}
                                            // value={'#include <stdio.h>\n\nint main() {\n    for(int i=0; i<5; i++){\n        for(int j=0; j<5; j++){\n            printf(\'%d %d\', i, j);\n        }\n    }\n     return 0;\n}'}
                                            theme={darcula}
                                            minHeight={'100px'}
                                            extensions={[loadLanguage(post.tags[0].name), EditorView.editable.of(false), EditorState.readOnly.of(true)]}
                                        />
                                    </Col>
                                </Row> */}
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

                        {/* <span className='ms-auto me-auto'>Go to answer this question</span> */}

                        <div ref={answerCardsContainerRef}>
                            {answersList.map((answer, index) => (
                                <Card id={`answerCard_${answer.id}`} key={index}>
                                    <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between">
                                        <div className='p-2'>
                                            {/* <i className="bi bi-chevron-left me-2"></i> */}
                                            # {index + 1} &nbsp; Answer
                                        </div>
                                        <div>
                                            {renderLikeButton(answer.id, -1)}
                                            {answer.like}
                                            {renderLikeButton(answer.id, 1)}
                                        </div>
                                    </CardTitle>
                                    <CardBody>
                                        <Row>
                                            <Col sm="7" lg="8" xl="8" xxl="8">
                                                <CodeMirror
                                                    className='mb-3'
                                                    id="code"
                                                    value={answer.code}
                                                    theme={darcula}
                                                    minHeight={'100px'}
                                                    extensions={[
                                                        loadLanguage(post.tags[0].name),
                                                        EditorView.editable.of(false),
                                                        EditorState.readOnly.of(true),
                                                    ]}
                                                />
                                            </Col>
                                            <Col sm="5" lg="4" xl="4" xxl="4" className="d-flex flex-column">
                                                {Array.from({ length: lineCounts[index] || 0 }, (_, lineNumber) => (
                                                    <div>
                                                        <Button
                                                            className={`btn-hover ${lookingLines[index] === lineNumber ? 'selected' : ''} ${!answer.comments.find(comment => comment.line === lineNumber + 1)?.description ? 'hidden' : ''}`}
                                                            outline
                                                            color='black'
                                                            id={`LookingClick_${index}${lineNumber}`}
                                                            key={lineNumber}
                                                            onClick={() => setLookingLine(index, lineNumber)}
                                                        >
                                                            <i className="bi bi-chevron-right"> </i>
                                                        </Button>
                                                        {document.getElementById(`LookingClick_${index}${lineNumber}`) && (
                                                            <UncontrolledPopover
                                                                placement="right"
                                                                target={`LookingClick_${index}${lineNumber}`}
                                                                trigger="legacy"
                                                                isOpen={lookingLines[index] === parseInt(lineNumber)}
                                                                style={{ backgroundColor: 'white', borderRadius: '10px' }}
                                                            >
                                                                <PopoverBody className="d-flex">
                                                                    {/* Assuming answersData is an array containing objects with properties line and content */}
                                                                    {answer.comments.find(comment => comment.line === lineNumber + 1)?.description}
                                                                </PopoverBody>
                                                            </UncontrolledPopover>
                                                        )}
                                                    </div>
                                                ))}
                                            </Col>
                                        </Row>
                                        <Col xs='auto' className='ms-auto'>
                                            <div className="d-flex flex-column">
                                                <small className="text-muted ms-auto">{formatDateString(answer.createdAt)}</small>
                                                <small className="text-muted ms-auto">{answer.user.nickname}</small>
                                            </div>
                                        </Col>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        <Card id={`answerCard_newAnswerCard`}>
                            <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between">
                                <div className='p-2'>
                                    <i className="bi bi-plus me-2"> </i>
                                    New Answer
                                </div>
                                <Button className="btn me-2" color="primary" size="sm"
                                    onClick={handleAnswerPost}>
                                    post
                                </Button>
                            </CardTitle>
                            <CardBody>
                                <Row>
                                    <Col sm="7" lg="8" xl="8" xxl="8">
                                        <CodeMirror
                                            ref={codeMirrorRef}
                                            theme={darcula}
                                            minHeight={'150px'}
                                            onChange={handleChange}
                                            extensions={[
                                                loadLanguage(post.tags[0].name),
                                                EditorView.updateListener.of((update) => {
                                                    if (update.docChanged) {
                                                        setLineCount(update.state.doc.lines);
                                                    }
                                                }),
                                            ]}
                                        />
                                    </Col>
                                    <Col sm="5" lg="4" xl="4" xxl="4" className="d-flex flex-column">
                                        {Array.from({ length: lineCount }, (_, index) => index + 1).map((lineNumber) => (
                                            <div>
                                                <Button
                                                    className={`btn-hover ${selectedLine === lineNumber ? 'selected' : ''}`}
                                                    outline
                                                    color='black'
                                                    id={`PopoverClick_${lineNumber}`}
                                                    key={lineNumber}
                                                    onClick={() => handleButtonClick(lineNumber)}
                                                >
                                                    <i className="bi bi-plus"> </i>
                                                </Button>
                                                <span>{Array.from(comments).find(comment => comment.line === lineNumber)?.description}</span>
                                                <UncontrolledPopover
                                                    placement="right"
                                                    target={`PopoverClick_${lineNumber}`}
                                                    trigger="legacy"
                                                    isOpen={selectedLine === parseInt(lineNumber)}
                                                    style={{ backgroundColor: 'white', borderRadius: '10px' }}
                                                >
                                                    <PopoverBody className="d-flex">
                                                        {/* Assuming answersData is an array containing objects with properties line and content */}
                                                        <Input
                                                            id="title"
                                                            name="title"
                                                            placeholder="with a placeholder"
                                                            type="textarea"
                                                            style={{ minHeight: '100px', marginRight: '10px' }}
                                                            value={description}
                                                            onChange={(e) => {
                                                                setDescription(e.target.value);
                                                            }}
                                                        />
                                                        <Button
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                color: 'black',
                                                                borderColor: 'transparent',
                                                                width: '30px', // 버튼의 너비 조정 (조절 가능)
                                                                padding: '0',
                                                            }}
                                                            onClick={() => {
                                                                setComments((prevComments) => {
                                                                    const updatedComments = [...prevComments];
                                                                    const existingCommentIndex = updatedComments.findIndex(comment => comment.line === lineNumber);

                                                                    if (existingCommentIndex !== -1) {
                                                                        // If a comment for the lineNumber already exists, update its description
                                                                        updatedComments[existingCommentIndex].description = description;
                                                                    } else {
                                                                        // If there's no comment for the lineNumber, create a new comment
                                                                        updatedComments.push({ line: lineNumber, description: description });
                                                                    }

                                                                    return updatedComments;
                                                                });
                                                                console.log(comments)
                                                            }}
                                                        >
                                                            <i className="bi bi-check-circle-fill"></i>
                                                        </Button>
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

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