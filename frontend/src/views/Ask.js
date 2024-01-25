import React, { useEffect, useState } from 'react';
import { Card, Row, Col, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
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
import { useNavigate } from 'react-router-dom';
import { parse } from 'partial-json';

const Ask = () => {
    const navigate = useNavigate();

    const [langSelect, setLangSelect] = useState('javascript')
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        tags: [{ name: 'javascript', type: 1 }],
        isRequestAI: false,
    });
    const [errors, setErrors] = useState({});
    const [answer, setAnswer] = useState({});

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
        // console.log(editor, data, value)
        // console.log(formData.code)
        // console.log(formData)
    };

    // const handleTagsChange = (tags) => {
    //     setFormData({
    //         ...formData,
    //         tags: tags,
    //     });
    //     console.log(tags)
    //     console.log(formData)
    // };
    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            isRequestAI: e.target.checked,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform additional logic or send data to server

        if (answer.code) return;

        setFormData({
            ...formData,
            tags: [{ name: langSelect, type: 1 }],
        });

        console.log('Form Data:', formData);

        try {
            const response = await fetch(`${API_BASE_URL}/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            })
            console.log('response', response);

            if (response.ok) {
                const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
                let result;
                let message = '';

                while (true) {
                    const stream = await reader.read();
                    if (!result) {
                        result = parse(stream.value);
                        console.log('Question post successful', result);
                    } else if (formData.isRequestAI && stream.value) {
                        message += stream.value;
                        if (message.includes('{')) {
                            setAnswer(parse(message.substring(message.indexOf('{'))));
                        }
                        console.log(stream.value);
                    }
                    if (stream.done) {
                        navigate(`/detail/${result.id}`);
                        break;
                    }
                }
            } else {
                const result = await response.json();
                console.log('Question post failed:', result);
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

    useEffect(() => {
        if (!localStorage.getItem('id')) {
            navigate('/');
        }
    }, []);

    return (
        <Row>
            {!answer.code ? <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Ask Form
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
                            <FormGroup check>
                                <Label check>Would you like to use AI-generated responses?</Label>
                                <Input
                                    id="isRequestAI"
                                    name="isRequestAI"
                                    type="checkbox"
                                    checked={formData.isRequestAI}
                                    onChange={handleCheckboxChange} />
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
                            <Button type="submit" className='mt-3'>Submit</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col> :
                <Col>
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-robot me-2"> </i>
                            AI Answer
                        </CardTitle>
                        <CardBody>
                            <CodeMirror
                                id="code"
                                value={answer.code}
                                onChange={handleChange}
                                theme={darcula}
                                minHeight={'300px'}
                                lang={formData.tags[0].name}
                                extensions={[loadLanguage(langSelect)]}
                                readOnly={true}
                            >
                            </CodeMirror>
                            <strong className='p-2 d-block'>Comments</strong>
                            {answer.comments && answer.comments.map((comment) => <p className='p-1'>{`Line ${comment.line}: ${comment.description || ''}`}</p>)}
                        </CardBody>
                    </Card>
                </Col>
            }
        </Row>
    );
};

export default Ask;
