import { Row, Col, Table, Card, CardTitle, CardBody, Pagination, PaginationItem, PaginationLink, Button } from "reactstrap";
import { useState, useEffect, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layouts/loader/Loader";
import TagShow from "../components/TagShow";

const QuestionsTable = ({ listName, questionList, addShow = true, postsPerPage = 5, showPagination = true, goto = false }) => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [indexOfLast, setIndexOfLast] = useState(1);
    const [indexOfFirst, setIndexOfFirst] = useState(1);
    const [loading, setLoading] = useState(true); // Track loading state
    const totalNumber = questionList.length;
    const totalPages = Math.ceil(totalNumber / postsPerPage);

    useEffect(() => {
        console.log("questionList from question Table", questionList);
        setIndexOfLast(currentPage * postsPerPage);
        setIndexOfFirst(indexOfLast - postsPerPage);
        console.log(indexOfFirst, indexOfLast);
        setCurrentPosts(questionList.slice(indexOfFirst, indexOfLast));
        console.log("currentPosts", questionList, indexOfFirst, indexOfLast, currentPosts);
        setLoading(false);
    }, [currentPage, postsPerPage, questionList, indexOfFirst, indexOfLast]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <Suspense fallback={<Loader />}>
            {loading ? (
                <Loader />
            ) : (
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between flex-column flex-sm-row">
                                <div className="p-2">
                                    <i className="bi bi-card-text me-2"> </i>
                                    {listName}
                                </div>
                                {addShow && (
                                    <div className="d-flex align-items-center">
                                        {/* Add the grid classes to control the width of elements */}
                                        <div className="me-3">
                                            <Link to="/ask">
                                                <Button className="btn" color="primary" size="sm">
                                                    <i className="bi bi-plus"> </i>
                                                    <span className="d-none d-sm-inline"> Add Question</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                            </CardTitle>

                            <CardBody className="">
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th className="col-md-1"> # </th>
                                            <th className="col-md-9"> Question </th>
                                            <th className="col-md-2"> Answers </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentPosts && currentPosts.map((data) => (
                                                <tr key={data.id}>
                                                    <th scope="row">{data.id}</th>
                                                    <td style={{
                                                        maxHeight: '50px',
                                                        overflow: 'hidden',
                                                        maxWidth: '200px', // Set a maximum width for the cell
                                                    }}>
                                                        <Link to={`/detail/${data.id}`} className='mb-3' style={{
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            backgroundColor: 'transparent',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                        }}>
                                                            <span
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                    textOverflow: 'ellipsis',
                                                                    overflow: 'hidden',
                                                                    display: 'block',
                                                                }}
                                                                title={data.title}
                                                            >
                                                                {data.title}
                                                            </span>
                                                        </Link>
                                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <div>
                                                                {/* <TagShow tagsList={data.tags} /> */}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {data.answerCount}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>

                                {showPagination && (
                                    <div>
                                        {/* Pagination */}
                                        <Pagination>
                                            <PaginationItem>
                                                <PaginationLink first onClick={() => handlePageChange(1)} />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                                            </PaginationItem>
                                            {Array.from({ length: totalPages }, (_, index) => (
                                                <PaginationItem key={index + 1} active={index + 1 === currentPage}>
                                                    <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink last onClick={() => handlePageChange(totalPages)} />
                                            </PaginationItem>
                                        </Pagination>
                                    </div>
                                )}

                                {goto && (
                                    <div className="d-flex justify-content-end">
                                        <Link to={'/questions'}>
                                            <Button outline size="sm">
                                                See All Questions
                                                <i className="bi bi-arrow-right ms-1"></i>
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
        </Suspense>
    );
};

export default QuestionsTable;