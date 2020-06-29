import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { Button, Icon, Confirm } from "semantic-ui-react";

import { FETCH_TRIPS_QUERY } from "../util/graphql";

function DeleteButton({
  type,
  tripId,
  commentId,
  expenseId,
  username,
  callback,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  let mutation;
  switch (type) {
    default:
      mutation = DELETE_TRIP_MUTATION;
      break;
    case "comment":
      mutation = DELETE_COMMENT_MUTATION;
      break;
    case "expense":
      mutation = DELETE_EXPENSE_MUTATION;
      break;
    case "user":
      mutation = UNAUTHORIZE_USER_MUTATION;
  }

  const [deleteTripOrComment] = useMutation(mutation, {
    update(proxy, result) {
      setConfirmOpen(false);
      if (type !== "comment" && type !== "expense") {
        const data = proxy.readQuery({
          query: FETCH_TRIPS_QUERY,
        });
        data.getTrips = data.getTrips.filter((t) => t.id !== tripId);
        proxy.writeQuery({ query: FETCH_TRIPS_QUERY, data });
      }

      if (callback) callback();
    },
    variables: {
      tripId,
      commentId,
      expenseId,
      username,
    },
  });
  return (
    <>
      <Button
        icon
        size="mini"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteTripOrComment}
      />
    </>
  );
}

const DELETE_TRIP_MUTATION = gql`
  mutation deleteTrip($tripId: ID!) {
    deleteTrip(tripId: $tripId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($tripId: ID!, $commentId: ID!) {
    deleteComment(tripId: $tripId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const DELETE_EXPENSE_MUTATION = gql`
  mutation deleteExpense($tripId: ID!, $expenseId: ID!) {
    deleteExpense(tripId: $tripId, expenseId: $expenseId) {
      id
      totalExpense
      dailyExpense
      expenses {
        id
        username
        createdAt
        cost
        name
        currency
        paidBy
      }
      authorizedUsers {
        username
      }
      expensesByCategory {
        id
        categoryName
        totalExpense
        averageExpense
        percentage
        largestExpense
        largestExpenseName
        expenseCount
      }
    }
  }
`;

const UNAUTHORIZE_USER_MUTATION = gql`
  mutation unauthorizeUser($tripId: ID!, $username: String!) {
    unauthorizeUser(tripId: $tripId, username: $username) {
      id
      authorizedUsers {
        username
      }
    }
  }
`;


export default DeleteButton;
