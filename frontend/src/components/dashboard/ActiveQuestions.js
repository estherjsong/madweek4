import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import QuestionsTable from "../questionTable";

const ScoreTables = () => {
    const [questionList, setQuestionList] = useState([]);
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/question`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const result = await response.json();

            console.log("response", response)

            if (response.ok) {
                console.log('Questions get successed:', result);
                setQuestionList(result.questions);
            } else {
                console.log('Questions get failed:', result);
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
            <QuestionsTable listName={'Recent Questions'} questionList={questionList.slice(0,7)} postsPerPage={7} showPagination={false} goto={true} />
        </div>
    );
};

export default ScoreTables;
