import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const TagShow = ({ tagsList }) => {
    const navigate = useNavigate();

    return (
        <div>
            {
                tagsList.map((tag) => (
                    <Button
                        key={tag.name} // 각 태그에 고유한 키를 할당해야 합니다.
                        className="btn me-2"
                        outline
                        color="primary"
                        size="sm"
                        onClick={() => { navigate(`/questions?tag=${tag.name}`) }}
                    >
                        {tag.name}
                    </Button>
                ))
            }
        </div>
    );
}

export default TagShow;