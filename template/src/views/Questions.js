import { Row, Col, Table, Card, CardTitle, CardBody, Pagination, PaginationItem, PaginationLink, Button, Input, InputGroup, ButtonDropdown, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { formatDateString } from "../dateUtils";
import TagShow from "../components/TagShow";

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

    const navigate = useNavigate();
    const [postsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [searchSelect, setSearchSelect] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    // Calculate total number of pages
    // const totalPages = Math.ceil(dummyData.length / postsPerPage);

    // Update current posts when currentPage changes
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;

    const fetchData = async (params) => {
        try {
            // Define the base parameters
            const baseParams = {
                offset: indexOfFirst,
                // Add other common parameters here
            };

            // Conditionally add title, nickname, and tag based on params
            if (params.title) baseParams.title = params.title;
            if (params.nickname) baseParams.nickname = params.nickname;
            if (params.tag) baseParams.tag = params.tag;

            // Send a GET request with the constructed parameters
            const response = await axios.get(`/question`, { params: baseParams });

            // Set the fetched posts to the state
            console.log(response);
            setPosts(response.data.questions);
            setTotalPages(Math.ceil(response.data.count / postsPerPage));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
        console.log(hashParams);
        const tagParam = hashParams.get('tag');
        console.log(tagParam);
        if (tagParam) {
            setSearchOpen(true);
            setSearchSelect('Tag');
            setSearchTerm(tagParam);
        }
        // Define your function to fetch data
        // Call the fetchData function when the component mounts or currentPage changes
        fetchData({
            title: undefined,
            nickname: undefined,
            tag: tagParam ? tagParam : undefined,
        });
    }, [currentPage, indexOfFirst, postsPerPage, window.location.hash]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSearch = () => {
        const params = {
            title: searchSelect === 'Title' ? searchTerm : undefined,
            nickname: searchSelect === 'Author' ? searchTerm : undefined,
            tag: searchSelect === 'Tag' ? searchTerm : undefined,
        };

        fetchData(params);
    };

    return (
        <Row>
            <Col lg="12">


                <Card>
                    <CardTitle tag="h6" className="border-bottom p-1 mb-0 d-flex justify-content-between flex-column flex-sm-row">
                        <div className="p-2">
                            <i className="bi bi-card-text me-2"> </i>
                            Questions
                        </div>

                        <div className="d-flex align-items-center">
                            {/* Add the grid classes to control the width of elements */}

                            {searchOpen ? (
                                <div className="">
                                    <InputGroup size="sm">
                                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                            <DropdownToggle caret>{searchSelect}</DropdownToggle>
                                            <DropdownMenu className="me-3">
                                                <DropdownItem onClick={() => setSearchSelect('All')}>All</DropdownItem>
                                                <DropdownItem onClick={() => setSearchSelect('Title')}>Title</DropdownItem>
                                                <DropdownItem onClick={() => setSearchSelect('Tag')}>Tag</DropdownItem>
                                                <DropdownItem onClick={() => setSearchSelect('Author')}>Author</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <Input
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch();
                                                }
                                            }}
                                        />
                                        <Button onClick={() => handleSearch()}>
                                            <i className="bi bi-search"></i>
                                        </Button>
                                        <Button onClick={() => { setSearchOpen(false); setSearchTerm(''); setSearchSelect('All'); fetchData({}); navigate('/questions') }} className="me-3 border-0 bg-transparent" size="sm">
                                            <i className="bi bi-x text-dark"> </i>
                                        </Button>
                                    </InputGroup>
                                </div>
                            ) : (
                                <Button onClick={() => { setSearchOpen(true) }} className="me-3 border-0 bg-transparent" size="sm">
                                    <i className="bi bi-search text-dark"> </i>
                                </Button>
                            )}


                            <div className="me-3">
                                <Link to="/ask">
                                    <Button className="btn" color="primary" size="sm">
                                        <i className="bi bi-plus"> </i>
                                        <span className="d-none d-sm-inline"> Add Question</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardTitle>


                    <CardBody className="">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th className="col-md-1"> # </th>
                                    <th className="col-md-7"> Question </th>
                                    <th className="col-md-4"> Answers </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Use the map function to dynamically render rows */}
                                {posts.map((data) => (
                                    <tr key={data.id}>
                                        <th scope="row">{data.id}</th>
                                        <td style={{ maxHeight: '50px', overflow: 'hidden' }}>
                                            <Link to={`/detail/${data.id}`} className='mb-3' style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                backgroundColor: 'transparent',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                <span>{data.title}</span>
                                            </Link>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <div>
                                                    <TagShow tagsList={data.tags} />
                                                </div>
                                                <div>
                                                    <small>
                                                        {data.user.nickname} asked {formatDateString(data.createdAt)}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {data.answerCount}
                                        </td>
                                        {/* <span>
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
                                        <td>{data.user.nickname}</td> */}
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