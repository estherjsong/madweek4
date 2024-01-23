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

const MyPage = () => {
    const userId = localStorage.getItem('userId');
    const nickname = localStorage.getItem('nickname');
    const introduction = localStorage.getItem('introduction');
    
    return (
        <div>
            <Row className="align-items-center">
                <Col xs="auto">
                    <h4 style={{ marginBottom: 0 }}>Hello, {nickname}<span className="text-muted">({userId})</span></h4>
                </Col>
                <Col xs="auto">
                    <Button outline color="primary" size="sm">
                        <i className="bi bi-pencil"></i>
                    </Button>
                </Col>
            </Row>
            
            <h5 className="mb-3 mt-3">{introduction}</h5>
            <Row>
                <h5 className="mb-3 mt-3">Summary</h5>
                <Col md="6" lg="4">
                    <Card body>
                        <CardTitle tag="h5">Special Title Treatment</CardTitle>
                        <CardText>
                            With supporting text below as a natural lead-in to additional
                            content.
                        </CardText>
                        <div>
                            <Button color="light-warning">Go somewhere</Button>
                        </div>
                    </Card>
                </Col>
                <Col md="6" lg="4">
                    <Card body className="text-center">
                        <CardTitle tag="h5">Special Title Treatment</CardTitle>
                        <CardText>
                            With supporting text below as a natural lead-in to additional
                            content.
                        </CardText>
                        <div>
                            <Button color="light-danger">Go somewhere</Button>
                        </div>
                    </Card>
                </Col>
                <Col md="6" lg="4">
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
                </Col>
            </Row>

            <Row>
                <h5 className="mb-3 mt-3">Questions</h5>
                <Col lg="12">
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
                </Col>
            </Row>

            <Row>
                <h5 className="mb-3 mt-3">Answers</h5>
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
                </Col>
            </Row>
        </div>
    )
}

export default MyPage;