import { Col, Row } from "reactstrap";
import SolvedChart from "../components/dashboard/SolvedChart";
import ScoreTable from "../components/dashboard/ScoreTable";
import ActiveQuestions from "../components/dashboard/ActiveQuestions";

import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";
import HeroImage from "../components/dashboard/HeroImage";

const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

const Starter = () => {
  return (
    <div>
      {/***Sales & Feed***/}
      <Row>
        <Col lg="12">
          <HeroImage />
        </Col>
      </Row>
      <Row>
        <Col sm="6" lg="6" xl="7" xxl="8" className="h-100">

          <ActiveQuestions />
        </Col>
        <Col sm="6" lg="6" xl="5" xxl="4" className="h-100">
          <ScoreTable />
        </Col>
      </Row>
      {/***Table ***/}
      {/* <Row>
        <Col lg="12">
          <ActiveQuestions />
        </Col>
      </Row> */}
    </div>
  );
};

export default Starter;
