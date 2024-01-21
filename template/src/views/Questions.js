import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import { useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Questions = () => {
    // Dummy data for questions
    const dummyData = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        question: `Question ${index + 1}`,
        tags: `Tag ${index + 1}`,
        username: `User${index + 1}`,
    }));

    const [postsPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total number of pages
    const totalPages = Math.ceil(dummyData.length / postsPerPage);

    // Update current posts when currentPage changes
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = dummyData.slice(indexOfFirst, indexOfLast);

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
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-card-text me-2"> </i>
                        Table with Hover
                    </CardTitle>
                    <CardBody className="">
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th className="col-md-1"> # </th>
                                    <th className="col-md-6"> Question </th>
                                    <th className="col-md-3"> Tags </th>
                                    <th className="col-md-2"> Username </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Use the map function to dynamically render rows */}
                                {currentPosts.map((data) => (
                                    <tr key={data.id}>
                                        <th scope="row">{data.id}</th>
                                        <td>{data.question}</td>
                                        <td>{data.tags}</td>
                                        <td>{data.username}</td>
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
                                        <PaginationLink href="javascript:void(0)" onClick={() => handlePageChange(index + 1)}>
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