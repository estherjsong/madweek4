import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
import axios from 'axios';

const Edit = () => {
    const navigate = useNavigate();
    const { questionId } = useParams();

    const [langSelect, setLangSelect] = useState('javascript')
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        tags: [{ name: 'javascript', type: 1 }],
    });
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const handleLanguageChange = (e) => {
        setLangSelect(e.target.value)

        setFormData({
            ...formData,
            tags: [{ name: e.target.value, type: 1 }],
        });

        console.log(langSelect, formData)
    };

    const handleChange = (editor, data, value) => {
        setFormData({
            ...formData,
            code: editor,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/question/${questionId}`);
                console.log(response.data);
                setFormData({
                    title: response.data.title,
                    code: response.data.code,
                    tags: response.data.tags,
                })
                setLangSelect(response.data.tags[0].name)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [])

    // const handleTagsChange = (tags) => {
    //     setFormData({
    //         ...formData,
    //         tags: tags,
    //     });
    //     console.log(tags)
    //     console.log(formData)
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform additional logic or send data to server

        setFormData({
            ...formData,
            tags: [{ name: langSelect, type: 1 }],
        });

        console.log('Form Data:', formData);

        try {
            // const response = await axios.put(`/question/${questionId}`, formData, { withCredentials: true });
            const response = await fetch(`${API_BASE_URL}/question/${questionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            })
            const result = await response.json();
            console.log("response", response)

            if (response.ok) {
                navigate(`/detail/${questionId}`)
                // console.log('Qeustion post successful', result);
            } else {
                // console.log('Qeustion post failed:', result);
                const newErrors = {};
                result.errors.forEach((error) => {
                    // error.msg에 따라 각각의 처리
                    switch (error.msg) {
                        case '제목을 작성해주세요.':
                            newErrors.title = 'Please write a title.';
                            break;
                        case '코드를 작성해주세요.':
                            newErrors.code = 'Please write the code.';
                            break;
                        default:
                            // 처리하고자 하는 에러 메시지가 없을 경우 아무 작업도 하지 않음
                            break;
                    }
                });

                setErrors(newErrors);
            }
        } catch (error) {
            console.error('An error occurred during posting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
    };

    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0 d-flex justify-content-between flex-column flex-sm-row">
                        <div>
                            <i className="bi bi-chevron-left me-2" onClick={toggle}></i>
                            # {questionId} Question Edit Form
                        </div>
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="with a placeholder"
                                    type="textarea"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                {errors.title && <div className="text-danger">{errors.title}</div>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="langSelect">Select Language</Label>
                                <Input
                                    id="langSelect"
                                    name="langSelect"
                                    type="select"
                                    value={langSelect}
                                    onChange={handleLanguageChange}
                                >
                                    {language.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="code">Code Area</Label>
                                <CodeMirror
                                    id="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    theme={darcula}
                                    minHeight={'300px'}
                                    extensions={[loadLanguage(langSelect)]}
                                />
                                {errors.code && <div className="text-danger">{errors.code}</div>}
                            </FormGroup>
                            {/* <FormGroup>
                                <Label for="tags">Tags</Label>
                                <Tags value={formData.tags} onChange={handleTagsChange} />
                            </FormGroup> */}
                            {/* <FormGroup>
                                <Label for="tags">Tags</Label>
                                <TagsInput
                                    value={formData.tags}
                                    onChange={handleTagsChange}
                                    inputProps={{ placeholder: 'Add a tag' }}
                                />
                            </FormGroup> */}
                            <Button type="submit">Save</Button>
                        </Form>
                    </CardBody>
                </Card>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Discard Changes and Exit</ModalHeader>
                    <ModalBody>
                        When you go back, the changes you made will not be saved. Do you want to continue?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>
                            Cancel
                        </Button>{' '}
                        <Button color="primary" onClick={() => { navigate(-1); }}>
                            Exit
                        </Button>
                    </ModalFooter>
                </Modal>
            </Col>
        </Row>
    );
};

export default Edit;
