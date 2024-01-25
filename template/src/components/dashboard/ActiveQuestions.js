import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";

const tableData = [
    {
        avatar: user1,
        name: "Hanna Gover",
        email: "hgover@gmail.com",
        project: "Flexy React",
        status: "pending",
        weeks: "35",
        budget: "95K",
    },
    {
        avatar: user2,
        name: "Hanna Gover",
        email: "hgover@gmail.com",
        project: "Lading pro React",
        status: "done",
        weeks: "35",
        budget: "95K",
    },
    {
        avatar: user3,
        name: "Hanna Gover",
        email: "hgover@gmail.com",
        project: "Elite React",
        status: "holt",
        weeks: "35",
        budget: "95K",
    },
    {
        avatar: user4,
        name: "Hanna Gover",
        email: "hgover@gmail.com",
        project: "Flexy React",
        status: "pending",
        weeks: "35",
        budget: "95K",
    },
    {
        avatar: user5,
        name: "Hanna Gover",
        email: "hgover@gmail.com",
        project: "Ample React",
        status: "done",
        weeks: "35",
        budget: "95K",
    },
];

const ScoreTables = () => {
    return (
        <div>
            <Card>
                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                    <i className="bi bi-card-text me-2"> </i>
                    Active Questions
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
                        <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr><tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr><tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
};

export default ScoreTables;
