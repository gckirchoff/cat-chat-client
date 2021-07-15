import React, { useContext } from 'react';
import { Card, Icon, Label, Button, Image, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../../context/auth';
import LikeButton from '../LikeButton/LikeButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import PopupWrapper from '../../utils/PopupWrapper';

const PostCard = ({
  post: {
    body,
    createdAt,
    id,
    userName,
    likeCount,
    commentCount,
    likes,
    comments,
  },
}) => {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{userName}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <PopupWrapper content="Comment on post.">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="brown" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="brown" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </PopupWrapper>
        {user && user.userName === userName && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
