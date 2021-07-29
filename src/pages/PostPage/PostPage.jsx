import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import {
  Grid,
  Image,
  Card,
  Button,
  Label,
  Icon,
  Form,
} from 'semantic-ui-react';
import moment from 'moment';

import LikeButton from '../../components/LikeButton/LikeButton';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import PopupWrapper from '../../utils/PopupWrapper';

import { AuthContext } from '../../context/auth';

const PostPage = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const deletePostCallback = () => {
    props.history.push('/');
  };

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      imageUrl,
      createdAt,
      userName,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Image src={imageUrl} size="huge" float="right" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{userName}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <PopupWrapper content="Comment">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log('Comment')}
                  >
                    <Button basic color="brown">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="brown" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </PopupWrapper>
                {user && user.userName === userName && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment...</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button orange"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.userName === comment.userName && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.userName}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      imageUrl
      createdAt
      userName
      likeCount
      likes {
        userName
      }
      commentCount
      comments {
        id
        userName
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        userName
      }
      commentCount
    }
  }
`;

export default PostPage;
