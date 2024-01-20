import React, { useState } from 'react';
import { Card, Row, Col, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import CodeMirror from '@uiw/react-codemirror';
import { darcula } from '@uiw/codemirror-themes-all';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

import language from './languages.json';

const Ask = () => {
    const [formData, setFormData] = useState({
        question: '',
        lanSelect: 'javascript',
        text: '',
        file: '',
        radio1: '',
        checkbox: false,
    });

    const handleLanguageChange = (e) => {
        setFormData({
            ...formData,
            lanSelect: e.target.value,
        });
    };

    const handleChange = (editor, data, value) => {
        setFormData({
            ...formData,
            text: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Perform additional logic or send data to server
    };

    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Ask Form
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="question">Question</Label>
                                <Input
                                    id="question"
                                    name="question"
                                    placeholder="with a placeholder"
                                    type="textarea"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lanSelect">Select Language</Label>
                                <Input
                                    id="lanSelect"
                                    name="lanSelect"
                                    type="select"
                                    value={formData.lanSelect}
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
                                <Label for="exampleText">Code Area</Label>
                                <CodeMirror
                                    value={formData.text}
                                    onChange={handleChange}
                                    theme={darcula}
                                    height={'500px'}
                                    extensions={[loadLanguage(formData.lanSelect)]}
                                />
                            </FormGroup>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Ask;
