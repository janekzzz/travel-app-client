import React, {useState} from 'react';
import gql from 'graphql-tag'
import {Card, Form, Icon} from 'semantic-ui-react'
import {useMutation} from "@apollo/react-hooks"

function CommentForm(tripId) {
    const [comment, setComment] = useState("");

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      //commentInputRef.current.blur();
      
    },
    variables: {
      tripId: tripId.tripId,
      body: comment,
    },
  });

  return (
    <Card fluid>
    <Card.Content>
      <p>Post a comment</p>
      <Form>
        <div className="ui action input fluid">
          <input
            type="text"
            placeholder="Comment.."
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button
            type="submit"
            className="ui button orange"
            disabled={comment.trim() === ""}
            onClick={submitComment}
           
          >
            <Icon name="comment outline"/>
          </button>
        </div>
      </Form>
    </Card.Content>
  </Card>
  )

}
export default CommentForm;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($tripId: ID!, $body: String!) {
    createComment(tripId: $tripId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;