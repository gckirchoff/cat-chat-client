import React from 'react';
import { useMutation, gql } from '@apollo/client';

const FileUploadButton = () => {
  const [singleUpload] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => console.log(data),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    singleUpload({ variables: { file } });
  };

  return (
    <div>
      <h1>UPLOAD FILE</h1>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

const UPLOAD_FILE = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      url
    }
  }
`;

export default FileUploadButton;
