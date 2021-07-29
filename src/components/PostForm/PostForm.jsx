import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { post } from 'axios';

import { useForm } from '../../utils/hooks';
import { FETCH_POSTS_QUERY } from '../../utils/graphql';

import './PostForm.scss';

const PostForm = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [goodness, setGoodness] = useState(null);
  const { values, setValues, onChange, onSubmit } = useForm(
    createPostCallback,
    {
      body: '',
    }
  );

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: {
      body: values.body,
      imageUrl,
      goodness,
    },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      setValues({ body: '' });
    },
  });

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const fileUpload = (file) => {
    const url =
      process.env.NODE_ENV === 'production'
        ? 'https://obscure-scrubland-67457.herokuapp.com'
        : 'http://localhost:5000';
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

  async function createPostCallback() {
    setLoading(true);
    setImageError('');
    const { data } = await fileUpload(image);
    if (data.status === 'success') {
      setImageUrl(data.url);
      setGoodness(data.goodness);
      createPost();
    } else {
      setImageError(
        `This image goes against our terms and services with a goodness level of ${
          data.goodness * 100
        }%.`
      );
      setTimeout(() => setImageError(''), 4500);
    }
    setLoading(false);
  }

  return (
    // <div className="post-form-container">
    <>
      <Form onSubmit={onSubmit} loading={loading}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Write new post..."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <input
            type="file"
            style={{ display: 'hidden', marginBottom: 10 }}
            onChange={onImageChange}
          />
          <Button type="submit" color="brown">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && console.log(error.message)}
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.message}</li>
          </ul>
        </div>
        // error.graphQLErrors[0].message.replace('Error: ', '')
      )}
      {imageError && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{imageError}</li>
          </ul>
        </div>
      )}
      {/* </div> */}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!, $imageUrl: String!, $goodness: String!) {
    createPost(body: $body, imageUrl: $imageUrl, goodness: $goodness) {
      id
      body
      imageUrl
      goodness
      createdAt
      userName
      likes {
        id
        userName
        createdAt
      }
      likeCount
      comments {
        id
        body
        userName
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
