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
import language from '../views/languages.json';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import axios from 'axios';
import Loader from '../layouts/loader/Loader';
import { formatDateString } from '../dateUtils';
import '../views/animation.css'
import TagShow from '../components/TagShow';




const EditableAnswer = (post) => {
    const codeMirrorRef = useRef(null);
    const [selectedLine, setSelectedLine] = useState(0);
    const [codeMirrorTop, setCodeMirrorTop] = useState(0);
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState([]);
    const [lineCount, setLineCount] = useState(0);
    const [lineCounts, setLineCounts] = useState([]);
    const [code, setCode] = useState('');

    const handleChange = (editor, data, value) => {
        setCode(editor)
    };

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

    const handleAnswerPost = async (questionId, code, comments) => {
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
                result.errors.forEach((error) => {
                    switch (error.msg) {
                        case '사용자가 작성한 질문입니다.':
                            alert('You cannot reply to your own question.');
                            break;
                        default:
                            break;
                    }
                })
            }
        } catch (error) {
            console.error('An error occurred during posting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
    }

    return (
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
    )
}

export default EditableAnswer;