import React, { useState, useEffect } from 'react';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import PopupWrapper from '../../utils/PopupWrapper';

const LikeButton = ({ post: { id, likeCount, likes }, user }) => {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.userName === user.userName)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="orange">
        <Icon name="paw" />
      </Button>
    ) : (
      <Button color="orange" basic>
        <Icon name="paw" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="orange" basic>
      <Icon name="paw" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <PopupWrapper content={liked ? 'Unlike' : 'Like'}>
        {likeButton}
      </PopupWrapper>
      <Label basic color="orange" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        userName
      }
      likeCount
    }
  }
`;

export default LikeButton;
