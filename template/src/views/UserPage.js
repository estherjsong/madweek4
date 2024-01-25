import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardGroup,
    Button,
    Row,
    Col,
} from "reactstrap";
import QuestionsTable from "../components/questionTable";
// import { ReactComponent as Gold } from "../assets/images/Gold.svg";
// import { ReactComponent as Silver } from "../assets/images/Silver.svg";
// import { ReactComponent as Bronze } from "../assets/images/Bronze.svg";
import Gold from "../assets/images/Gold.png"
import Silver from "../assets/images/Silver.png"
import Bronze from "../assets/images/Bronze.png"
import user1 from "../assets/images/users/user4.jpg";
import { formatDateString } from "../dateUtils";
import { useParams } from "react-router-dom";

const UserPage = () => {
    const { paramsid } = useParams();
    const id = localStorage.getItem('id');
    // const userId = localStorage.getItem('userId');
    // const nickname = localStorage.getItem('nickname');
    const [userId, setUserId] = useState('');
    const [nickname, setNickname] = useState('');
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [topLanguages, setTopLanguages] = useState([]);
    const [created, setCreated] = useState('');
    const [introduction, setIntroduction] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/${paramsid ? paramsid : id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                console.log('User information get successful', result);
                setAnswers(result.answers);
                setQuestions(result.questions);
                setTopLanguages(result.topLanguages);
                setScore(result.score);
                setCreated(result.createdAt);
                setIntroduction(result.introduction);
                setUserId(result.userId);
                setNickname(result.nickname);
                console.log("questions from mypage", questions);
                console.log("answers from mypage", answers);
                console.log("toplanguages", topLanguages);
            } else {
                console.log('User information get failed:', result);
            }
        } catch (error) {
            console.error('An error occurred during getting:', error);
            // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div>
            <Row>
                <Col lg="4" style={{ position: 'sticky', top: '0', maxHeight: '100vh', overflowY: 'auto' }}>
                    <Card body className="text-center">
                        <CardTitle tag="h4" className="mt-3">
                            Profile
                        </CardTitle>
                        <Row className="justify-content-center mt-4 mb-4">
                            <Col xs="auto">
                                <img
                                    src={user1}
                                    alt="profile"
                                    className="rounded-circle"
                                    width="80%"
                                />
                            </Col>
                        </Row>
                        <CardBody className="text-start ps-5">
                            <CardText>
                                <i className="bi bi-person mb-1 me-2"></i>
                                {nickname} ({userId})
                            </CardText>
                            <CardText>
                                <i className="bi bi-balloon mb-1 me-2"></i>
                                join from {formatDateString(created)}
                            </CardText>
                            <CardText>
                                <i className="bi bi-star mb-1 me-2"></i>
                                {score}
                            </CardText>
                            <CardText>
                                <i className="bi bi-card-text mb-1 me-2"></i>
                                {introduction}
                            </CardText>
                        </CardBody>
                        <Row className="justify-content-center mt-3 mb-5">
                            <Col xs="auto">
                                <Button outline color="primary">
                                    <i className="bi bi-pencil me-3"></i>
                                    Edit Profile
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col lg="8" style={{ overflowY: 'auto' }}>
                    <Row>
                        {topLanguages.map((lang, index) => (
                            <Col md="6" lg="4">
                                <Card body className="text-center">
                                    <CardTitle tag="h5" className="mb-3">{lang.name}</CardTitle>

                                    <CardText className="mt-3">
                                        {index === 0 && <img src={Gold} style={{ width: '50%' }} />}
                                        {index === 1 && <img src={Silver} style={{ width: '50%' }} />}
                                        {index === 2 && <img src={Bronze} style={{ width: '50%' }} />}
                                        {/* <img src={`/assets/images/Medal${index+1}.svg`} /> */}
                                        <Row className="p-2 mt-3">
                                            <Col>
                                                <h4>{lang.questionCount}</h4>
                                                <h5>Questions</h5>
                                            </Col>
                                            <Col>
                                                <h4>{lang.answerCount}</h4>
                                                <h5>Answers</h5>
                                            </Col>
                                        </Row>
                                    </CardText>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {/* <h5 className="mb-3 mt-3">My Questions</h5> */}
                        <Col lg="12">
                            <QuestionsTable listName={'My Questions'} questionList={questions} />
                        </Col>
                    </Row>

                    <Row>
                        {/* <h5 className="mb-3 mt-3">Answers</h5>
                        <Col sm="lg">
                            <Card body className="text-end">
                                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                                <CardText>
                                    With supporting text below as a natural lead-in to additional
                                    content.
                                </CardText>
                                <div>
                                    <Button color="light-success">Go somewhere</Button>
                                </div>
                            </Card>
                        </Col> */}
                        <Col lg="12">
                            <QuestionsTable listName={'My Answers'} questionList={answers.map((item) => item.question)} />
                        </Col>
                    </Row>
                </Col>
            </Row>

        </div >
    )
}

export default UserPage;