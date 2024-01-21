import React from 'react';
import TagsInput from 'react-tagsinput';
import './Tags.scss'

const Tags = ({ value, onChange }) => {
    return (
        <TagsInput
            value={value}
            onChange={onChange}
            inputProps={{ placeholder: 'Add a tag' }}
            tagProps={{ className: 'my-custom-tag' }}
            className="my-custom-tagsinput"
            focusedClassName="my-focused-tagsinput"
        />
    );
};

export default Tags;
