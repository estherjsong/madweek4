import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import user0 from "../../assets/images/users/user0.jpg";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";
const userImages = [user0, user1, user2, user3, user4, user5];

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
  const [rank, setRank] = useState([]);

  const fetchRanking = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rank`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      const result = await response.json();

      console.log("response", response)

      if (response.ok) {
        console.log('rank get succes', result);
        setRank(result)
      } else {
        console.log('rank get failed:', result);
      }
    } catch (error) {
      console.error('An error occurred during posting:', error);
      // 여기에서 적절한 에러 처리를 수행할 수 있습니다.
    }
  }

  useEffect(() => {
    fetchRanking();
  }, [])

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Ranking</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Questions are most often solved by...
          </CardSubtitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th></th>
                <th>Nickname</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {rank.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={userImages[tdata.profileId]}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <Link to={`/userpage/${tdata.id}`} className="nav-link">
                          <h6 className="mb-0">{tdata.nickname}</h6>
                        </Link>
                        {/* <span className="text-muted">{tdata.email}</span> */}
                      </div>
                    </div>
                  </td>
                  <td>{tdata.score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ScoreTables;
