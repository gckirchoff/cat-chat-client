import React, { useState } from 'react';
import { post } from 'axios';

const FlaskFileUploadButton = () => {
  const [image, setImage] = useState(null);

  const fileUpload = (file) => {
    const url = 'http://localhost:5000';
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'content-type': 'multipart/form-data',
      },
    };
    return post(url, formData, config);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const { data } = await fileUpload(image);
    console.log(data);
  };

  const onChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input type="file" onChange={onChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default FlaskFileUploadButton;
