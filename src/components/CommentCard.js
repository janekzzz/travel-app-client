import React from "react";
import { Card } from "semantic-ui-react";
import moment from "moment";
import DeleteButton from "./DeleteButton";

function CommentCard({
  comment: { username, id, createdAt, body },
  user,
  tid,
}) {
  return (
    <Card fluid key={id}>
      <Card.Content>
        {user && user.username === username && (
          <DeleteButton type={"comment"} tripId={tid} commentId={id} />
        )}
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
    </Card>
  );
}

export default CommentCard;
