import React, { useState } from 'react';
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

const Ask = () => {
    const [langSelect, setLangSelect] = useState('javascript')
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        tags: [{ name: 'javascript', type: 1 }],
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform additional logic or send data to server

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
            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                console.log('Qeustion post successful', result);
            } else {
                console.log('Qeustion post failed:', result);
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
                                    height={'500px'}
                                    extensions={[loadLanguage(langSelect)]}
                                />
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
                            <Button type="submit">Submit</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Ask;
