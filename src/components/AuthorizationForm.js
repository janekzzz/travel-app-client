import React, { useState } from "react";
import gql from "graphql-tag";
import { Card, Form, Icon } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

function AuthorizationForm(tripId) {
  const [user, setUser] = useState("");
  const [errors, setErrors] = useState({});
  const [authorizeUser] = useMutation(AUTHORIZE_USER_MUTATION, {
    update() {
      setUser("");
      setErrors({})
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      tripId: tripId.tripId,
      username: user,
    },
  });

  return (
    <Card fluid>
      <Card.Content>
        <p>Add user to this trip:</p>
        <Form>
          <div className="ui action input fluid">
            <input
              type="text"
              placeholder="Username.."
              name="username"
              value={user}
              onChange={(event) => setUser(event.target.value)}
            />
            <button
              
              size="tiny"
              type="submit"
              className="ui button orange tiny"
              disabled={user.trim() === ""}
              onClick={authorizeUser}
            >
              
            <Icon name="user plus"/>
            </button>
          </div>
        </Form>
        {Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
export default AuthorizationForm;

const AUTHORIZE_USER_MUTATION = gql`
  mutation($tripId: ID!, $username: String!) {
    authorizeUser(tripId: $tripId, username: $username) {
      id
      authorizedUsers {
        username
      }
    }
  }
`;
