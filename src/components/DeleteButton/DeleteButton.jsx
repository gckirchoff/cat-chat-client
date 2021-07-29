import React, { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import axios from 'axios';

import { FETCH_POSTS_QUERY } from '../../utils/graphql';
import PopupWrapper from '../../utils/PopupWrapper';

const DeleteButton = ({ postId, imageUrl, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrCommentMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        axios.delete(
          process.env.NODE_ENV === 'production'
            ? 'https://obscure-scrubland-67457.herokuapp.com'
            : 'http://localhost:5000',
          {
            data: { imageUrl },
          }
        );
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId),
          },
        });
      }
      if (callback) callback();
    },
    variables: { postId, commentId },
  });

  return (
    <>
      <PopupWrapper content={`Delete ${commentId ? 'comment' : 'post'}`}>
        <Button
          as="div"
          color="red"
          onClick={() => setConfirmOpen(true)}
          floated="right"
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </PopupWrapper>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrCommentMutation}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        userName
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
