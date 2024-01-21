import { useParams } from "react-router-dom";
import React from "react";
const Detail = () => {
    const { questionId } = useParams();

    return (
        <div>
            <p>{questionId}</p>
        </div>
    )
}

export default Detail;