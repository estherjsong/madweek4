// import React, { Suspense, useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { Card, Row, Col, CardTitle, CardBody, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, UncontrolledPopover, PopoverBody } from 'reactstrap';
// import CodeMirror from '@uiw/react-codemirror';
// import { darcula } from '@uiw/codemirror-themes-all';
// import { loadLanguage } from '@uiw/codemirror-extensions-langs';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';
// import 'codemirror/mode/javascript/javascript';
// import 'react-tagsinput/react-tagsinput.css'; // Import the styles for react-tagsinput
// import TagsInput from 'react-tagsinput'; // Import the react-tagsinput component
// import { API_BASE_URL } from '../config';
// import language from './languages.json';
// import { EditorView } from '@codemirror/view';
// import { EditorState } from '@codemirror/state';
// import axios from 'axios';
// import Loader from '../layouts/loader/Loader';
// import { formatDateString } from '../dateUtils';
// import './animation.css'

// const Detail = () => {
//     const id = localStorage.getItem('id');
//     console.log("userid", id)
//     const answersData = [
//         {
//             id: 1,
//             author: 'John Doe',
//             timestamp: '2024-01-21T10:30:00Z',
//             content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//             line: 4
//         },
//         {
//             id: 2,
//             author: 'Jane Doe',
//             timestamp: '2024-01-21T12:45:00Z',
//             content: '2222Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//             line: 5
//         },
//         {
//             id: 3,
//             author: 'Alice Smith',
//             timestamp: '2024-01-22T08:15:00Z',
//             content: 'A new answer from another user.',
//             line: 8
//         },
//         {
//             id: 4,
//             author: 'Jane Doe',
//             timestamp: '2024-01-21T12:45:00Z',
//             content: '4444Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//             line: 5
//         },
//         // Add more dummy answers as needed
//     ];

//     const { questionId } = useParams();
//     const [post, setPost] = useState();
//     const [loading, setLoading] = useState(true); // Track loading state
//     const [modal, setModal] = useState(false);
//     const navigate = useNavigate();
//     const codeMirrorRef = useRef(null);
//     const [selectedLine, setSelectedLine] = useState(0);
//     const [codeMirrorTop, setCodeMirrorTop] = useState(0);
//     const answerCardsContainerRef = useRef(null);

//     // line 값의 등장 횟수를 저장할 객체
//     const lineCountMap = {};

//     // answersData를 순회하면서 line 값의 등장 횟수를 계산
//     answersData.forEach((answer) => {
//         const lineValue = answer.line;

//         // line 값이 이미 등장한 경우, 횟수를 1 증가
//         if (lineCountMap[lineValue]) {
//             lineCountMap[lineValue] += 1;
//         } else {
//             // line 값이 처음 등장하는 경우, 횟수를 1로 초기화
//             lineCountMap[lineValue] = 1;
//         }
//     });

//     const scrollToAnswerCard = (answerId) => {
//         const answerCard = document.getElementById(`answerCard_${answerId}`);
//         if (answerCard) {
//             // Add the class to highlight the answer card
//             answerCard.classList.add('highlighted');

//             // Scroll into view
//             answerCard.scrollIntoView({ behavior: 'smooth' });

//             // Remove the class after a delay (adjust the delay as needed)
//             setTimeout(() => {
//                 answerCard.classList.remove('highlighted');
//             }, 2000); // 1000 milliseconds = 1 second
//         }
//     };

//     // EditorView.updateListener.of((v) => {
//     //     if (v.docChanged) {
//     //         console.log(view.state.doc.lineAt(view.state.selection.main.head).number)
//     //     }
//     // })

//     console.log("lineCountMap", lineCountMap, Object.keys(lineCountMap))

//     const distanceChildFromTop = () => {
//         console.log(codeMirrorRef)
//         console.log(codeMirrorRef.current)
//         let chTop = codeMirrorRef.current?.editor.getBoundingClientRect().top;
//         let chBottom = codeMirrorRef.current?.editor.getBoundingClientRect().bottom;
//         setCodeMirrorTop(chTop);
//         // let peTop = codeCardRef.current.getBoundingClientRect().top;
//         // console.log("부모요소와의 거리(각 요소의  TOP),", chTop - peTop);
//         console.log("codeMirror", chTop, chBottom, chBottom - chTop, (chBottom - chTop) / 10);
//     };

//     const toggle = () => setModal(!modal);

//     useEffect(() => {
//         // Define your function to fetch data
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`/question/${questionId}`);
//                 setPost(response.data);
//                 console.log(response.data);
//                 // console.log(typeof id, typeof post.userId, parseInt(id)===post.userId)
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false); // Set loading to false regardless of success or failure
//             }
//         };

//         // Call the fetchData function when the component mounts or currentPage changes
//         fetchData();
//         window.addEventListener("scroll", distanceChildFromTop);
//     }, [questionId]); // Include questionId as a dependency

//     const handleGoBack = () => {
//         navigate(-1); // Equivalent to history.goBack()
//     };

//     const deleteQuestion = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/question/${questionId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//             })
//             console.log(response.data);
//             // console.log(typeof id, typeof post.userId, parseInt(id)===post.userId)
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             navigate('/questions');
//         }
//     };


//     return (
//         <Suspense fallback={<Loader />}>
//             {loading ? (
//                 <Loader />
//             ) : (
//                 <Row>
//                     <Col lg="12">
//                         {/* <Card style={{ maxWidth: '1210px', overflowX: 'auto' }}>
//                             <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between flex-column flex-sm-row">
//                                 <div className="p-2">
//                                     <i className="bi bi-chevron-left me-2" onClick={handleGoBack}></i>
//                                     # {questionId} Question
//                                 </div>

//                                 <div className="me-3">
//                                     {(parseInt(id) === post.userId) &&
//                                         <div>
//                                             <Link to={`/edit/${post.id}`} className='me-3'>
//                                                 <Button className="btn" color="primary" size="sm">
//                                                     <i className="bi bi-pencil-square"> </i>
//                                                 </Button>
//                                             </Link>
//                                             <Button className="btn" color="primary" size="sm" onClick={toggle} color="danger">
//                                                 <i className="bi bi-trash"> </i>
//                                             </Button>
//                                         </div>
//                                     }
//                                 </div>
//                             </CardTitle>
//                             <CardBody>
//                                 <CardText>
//                                     {post.title}
//                                 </CardText>
//                                 <CodeMirror
//                                     className='mb-3'
//                                     id="code"
//                                     value={post.code}
//                                     // value={'#include <stdio.h>\n\nint main() {\n    for(int i=0; i<5; i++){\n        for(int j=0; j<5; j++){\n            printf(\'%d %d\', i, j);\n        }\n    }\n     return 0;\n}'}
//                                     theme={darcula}
//                                     minHeight={'100px'}
//                                     extensions={[loadLanguage(post.tags[0].name), EditorView.editable.of(false), EditorState.readOnly.of(true)]}
//                                 />

//                                 <Row>
//                                     <Col>
//                                         {post.tags.map((tag) => (
//                                             <Button className="btn me-2" outline color="primary" size="sm" onClick={() => { navigate(`/questions?tag=${tag.name}`) }}>
//                                                 {tag.name}
//                                             </Button>
//                                         ))}
//                                     </Col>
//                                     <Col xs='auto' className='ms-auto'>
//                                         <div className="d-flex flex-column">
//                                             <small className="text-muted ms-auto">{formatDateString(post.createdAt)}</small>
//                                             <small className="text-muted ms-auto">{post.user.nickname}</small>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </CardBody>
//                         </Card> */}
//                         <Row>
//                             <Col sm="7" lg="8" xl="8" xxl="8">
//                                 <Card>
//                                     <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between flex-column flex-sm-row">
//                                         <div className="p-2">
//                                             <i className="bi bi-chevron-left me-2" onClick={handleGoBack}></i>
//                                             # {questionId} Question
//                                         </div>

//                                         <div className="me-3">
//                                             {(parseInt(id) === post.userId) &&
//                                                 <div>
//                                                     <Link to={`/edit/${post.id}`} className='me-3'>
//                                                         <Button className="btn" color="primary" size="sm">
//                                                             <i className="bi bi-pencil-square"> </i>
//                                                             {/* <span className="d-none d-sm-inline"> Edit Question</span> */}
//                                                         </Button>
//                                                     </Link>
//                                                     <Button className="btn" size="sm" onClick={toggle} color="danger">
//                                                         <i className="bi bi-trash"> </i>
//                                                         {/* <span className="d-none d-sm-inline"> Delete Question</span> */}
//                                                     </Button>
//                                                 </div>
//                                             }
//                                         </div>
//                                     </CardTitle>
//                                     <CardBody>
//                                         <CardText>
//                                             {post.title}
//                                         </CardText>
//                                         <CodeMirror
//                                             ref={codeMirrorRef}
//                                             className='mb-3'
//                                             id="code"
//                                             value={post.code}
//                                             // value={'#include <stdio.h>\n\nint main() {\n    for(int i=0; i<5; i++){\n        for(int j=0; j<5; j++){\n            printf(\'%d %d\', i, j);\n        }\n    }\n     return 0;\n}'}
//                                             theme={darcula}
//                                             minHeight={'100px'}
//                                             extensions={[
//                                                 loadLanguage(post.tags[0].name),
//                                                 EditorView.editable.of(false),
//                                                 EditorState.readOnly.of(true),
//                                                 EditorView.updateListener.of((v) => {
//                                                     // console.log(v);
//                                                     if (v.selectionSet) {
//                                                         const line = v.state.doc.lineAt(v.state.selection.main.head).number;
//                                                         setSelectedLine(line);
//                                                         console.log(`Current line: ${line}`);
//                                                         // You can use the line number as needed.
//                                                     }
//                                                 }),
//                                             ]}
//                                         />

//                                         <Row>
//                                             <Col>
//                                                 {post.tags.map((tag) => (
//                                                     <Button className="btn me-2" outline color="primary" size="sm" onClick={() => { navigate(`/questions?tag=${tag.name}`) }}>
//                                                         {tag.name}
//                                                     </Button>
//                                                 ))}
//                                             </Col>
//                                             <Col xs='auto' className='ms-auto'>
//                                                 <div className="d-flex flex-column">
//                                                     <small className="text-muted ms-auto">{formatDateString(post.createdAt)}</small>
//                                                     <small className="text-muted ms-auto">{post.user.nickname}</small>
//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </CardBody>
//                                 </Card>
//                             </Col>

//                             <Col sm="5" lg="4" xl="4" xxl="4">
//                                 <div style={{ position: 'relative' }}>
//                                     <div
//                                         style={{
//                                             position: 'absolute',
//                                             top: `100px`,
//                                             left: '0',
//                                             width: '30px', // Adjust the width as needed
//                                             height: '232px', // Adjust the height as needed
//                                             backgroundColor: '#2b2b2b',
//                                             borderRadius: '20px'
//                                         }}
//                                     />
//                                     {Object.keys(lineCountMap).map((key) => (
//                                         <div key={key}>
//                                             <Button
//                                                 id={`PopoverClick_${key}`}
//                                                 type="button"
//                                                 size="sm"
//                                                 style={{
//                                                     position: 'absolute',
//                                                     width: '30px',
//                                                     textAlign: 'center',
//                                                     top: `${76 + parseInt(key) * 23}px`,
//                                                     left: '0',
//                                                     padding: '0',
//                                                     margin: '0',
//                                                     borderColor: 'transparent',
//                                                     backgroundColor: (selectedLine === parseInt(key)) ? '#595959' : 'transparent',
//                                                     color: 'white',
//                                                 }}
//                                                 onClick={() => {
//                                                     setSelectedLine(parseInt(key));
//                                                     if (codeMirrorRef.current) {
//                                                         const view = codeMirrorRef.current.view;
//                                                         const tr = view.state.update({
//                                                             selection: {
//                                                                 anchor: view.state.doc.line(parseInt(key)).from,
//                                                                 head: view.state.doc.line(parseInt(key)).to,
//                                                             },
//                                                         });
//                                                         view.dispatch(tr);
//                                                     }
//                                                 }}
//                                             >
//                                                 {lineCountMap[key]}
//                                             </Button>
//                                             <UncontrolledPopover
//                                                 placement="right"
//                                                 target={`PopoverClick_${key}`}
//                                                 trigger="legacy"
//                                                 isOpen={selectedLine === parseInt(key)}
//                                                 style={{ backgroundColor: 'white', borderRadius: '10px' }}
//                                             >
//                                                 <PopoverBody>
//                                                     {/* Assuming answersData is an array containing objects with properties line and content */}
//                                                     {answersData.filter(answer => answer.line === parseInt(key)).map((filteredAnswer, index, array) => (
//                                                         <div>
//                                                             <div key={filteredAnswer.line} className="d-flex justify-content-between">
//                                                                 {/* Display content from the filtered answer */}
//                                                                 <div>
//                                                                     {filteredAnswer.content}
//                                                                 </div>
//                                                                 {/* Button on the right */}
//                                                                 <Button style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'transparent' }}
//                                                                     onClick={() => {
//                                                                         scrollToAnswerCard(filteredAnswer.id)
//                                                                     }}>
//                                                                     <i className="bi bi-arrow-right"></i>
//                                                                 </Button>
//                                                             </div>

//                                                             {/* Add a divider if it's not the last element in the array */}
//                                                             <hr />
//                                                         </div>
//                                                     ))}
//                                                     <Button style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'transparent', width: '100%', padding: '0' }}
//                                                         onClick={() => scrollToAnswerCard('newAnswerCard')}>
//                                                         <i className="bi bi-plus me-2"> </i>
//                                                     </Button>
//                                                 </PopoverBody>
//                                             </UncontrolledPopover>
//                                         </div>
//                                     ))}
//                                 </div>

//                             </Col>
//                         </Row>


//                         {/* <span className='ms-auto me-auto'>Go to answer this question</span> */}

//                         <div ref={answerCardsContainerRef}>
//                             {answersData.map((answer, index) => (
//                                 <Card id={`answerCard_${answer.id}`} key={index}>
//                                     <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between">
//                                         <div className='p-2'>
//                                             {/* <i className="bi bi-chevron-left me-2"></i> */}
//                                             # {index + 1} &nbsp; Answer
//                                         </div>
//                                         <Button className="btn me-2" outline color="primary" size="sm">
//                                             <i className="bi bi-hand-thumbs-up me-2"> </i>
//                                             {/* <i className ="bi bi-hand-thumbs-up-fill me-2"></i> */}
//                                             6
//                                         </Button>
//                                     </CardTitle>
//                                     <CardBody>
//                                         <CardText>
//                                             {answer.content}
//                                         </CardText>
//                                         <Col xs='auto' className='ms-auto'>
//                                             <div className="d-flex flex-column">
//                                                 <small className="text-muted ms-auto">{formatDateString(answer.timestamp)}</small>
//                                                 <small className="text-muted ms-auto">{answer.author}</small>
//                                             </div>
//                                         </Col>
//                                     </CardBody>
//                                 </Card>
//                             ))}
//                         </div>

//                         <Card id={`answerCard_newAnswerCard`}>
//                             <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between">
//                                 <div className='p-2'>
//                                     <i className="bi bi-plus me-2"> </i>
//                                     New Answer
//                                 </div>
//                                 <Button className="btn me-2" color="primary" size="sm">
//                                     post
//                                 </Button>
//                             </CardTitle>
//                             <CardBody>
//                                 <Input
//                                     id="title"
//                                     name="title"
//                                     placeholder="with a placeholder"
//                                     type="textarea"
//                                     style={{ minHeight: '100px' }}
//                                 />
//                             </CardBody>
//                         </Card>

//                         <Modal isOpen={modal} toggle={toggle}>
//                             <ModalHeader toggle={toggle}>Question Deletion</ModalHeader>
//                             <ModalBody>
//                                 Are you sure you want to delete this post? This action cannot be undone.
//                             </ModalBody>
//                             <ModalFooter>
//                                 <Button color="secondary" onClick={toggle}>
//                                     Cancel
//                                 </Button>{' '}
//                                 <Button color="primary" onClick={deleteQuestion}>
//                                     Delete
//                                 </Button>
//                             </ModalFooter>
//                         </Modal>
//                     </Col>
//                 </Row >
//             )}
//         </Suspense >
//     );
// }

// export default Detail;