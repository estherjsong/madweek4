import { Row, Col, Table, Card, CardTitle, CardBody, Pagination, PaginationItem, PaginationLink, Button } from "reactstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { formatDateString } from "../dateUtils";

const Questions = () => {
    // Dummy data for questions
    const dummyData = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        question: `Question ${index + 1}`,
        tags: `Tag ${index + 1}`,
        user: {
            nickname: `User${index + 1}`,
        }
    }));

    const [postsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    // Calculate total number of pages
    // const totalPages = Math.ceil(dummyData.length / postsPerPage);

    // Update current posts when currentPage changes
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;

    const currentPosts = dummyData.slice(indexOfFirst, indexOfLast);

    useEffect(() => {
        // Define your function to fetch data
        const fetchData = async () => {
            try {
                // Send a GET request with the offset parameter
                const response = await axios.get(`/question`, {
                    params: {
                        offset: indexOfFirst,
                        // Add other parameters as needed
                    },
                });

                console.log('response', response);
                console.log('response.data.questions', response.data.questions);
                // Set the fetched posts to the state
                setPosts(response.data.questions);
                setTotalPages(Math.ceil(response.data.count / postsPerPage));
                console.log("posts, count, TotalPages", posts, response.data.count, totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the fetchData function when the component mounts or currentPage changes
        fetchData();
    }, [currentPage, indexOfFirst, postsPerPage]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <Row>
            <Col lg="12">
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between">
                        <div className="p-2">
                            <i className="bi bi-card-text me-2"> </i>
                            Questions
                        </div>
                        <Link to="/ask" className="me-2">
                            <Button className="btn" color="primary" size="sm">
                                <i className="bi bi-plus"> </i>
                                Add Question
                            </Button>
                        </Link>
                    </CardTitle>
                    <CardBody className="">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th className="col-md-1"> # </th>
                                    <th className="col-md-7"> Question </th>
                                    <th className="col-md-2">  </th>
                                    <th className="col-md-2"> Username </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Use the map function to dynamically render rows */}
                                {posts.map((data) => (
                                    <tr key={data.id}>
                                        <th scope="row">{data.id}</th>
                                        <td style={{ maxHeight: '50px', overflow: 'hidden' }}>
                                            <Link to={`/detail/${data.id}`} style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                backgroundColor: 'transparent',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                <span>{data.title}</span>
                                            </Link>
                                            <span>
                                                {data.tags.map((tag) => (
                                                    <small key={tag.id}>{tag.name}, </small>
                                                ))}
                                            </span>
                                        </td>
                                        <td>
                                            <small>
                                                {formatDateString(data.createdAt)}
                                            </small>
                                        </td>
                                        <td>{data.user.nickname}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Questions;