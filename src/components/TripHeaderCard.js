import React, { useState } from "react";
import { Card, Icon, Button, Form } from "semantic-ui-react";
import DeleteButton from "../components/DeleteButton";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function TripHeaderCard(props) {
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState(props.name);
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);

  const [modifyTrip, { error }] = useMutation(MODIFY_TRIP_MUTATION, {
    update() {
      setEditable(false)

    },
    variables: {
      tripId: props.id,
      name,
      startDate,
      endDate
    }
  });

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header className="tripTitle">
          {editable && (
            <Form>
              <Form.Input
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </Form>
          )}
          {!editable && <h1>{props.name}</h1>}
        </Card.Header>

        <Card.Description className="trip-description-date">
          <Icon name="calendar alternate outline" />
          {props.startDate} - {props.endDate}
        </Card.Description>
        <Card.Description className="trip-description-1">
          <h3>
            <Icon name="tags" /> &nbsp;
            {props.totalExpense.toFixed(2)}
            <span> EUR</span>
          </h3>
          Total Expense
        </Card.Description>
        <Card.Description className="trip-description-1">
          <h3>
            <Icon name="tag" /> &nbsp;
            {props.dailyExpense.toFixed(2)}
            <span> EUR</span>
          </h3>
          Daily Expense
        </Card.Description>
        <Card.Content>
          {props.user && props.user.username === props.username && (
            <div>
              <DeleteButton tripId={props.id} callback={props.callback} />
            </div>
          )}
          {props.user.username === props.username && !editable && (
            <Button icon size="mini" onClick={() => setEditable(true)}>
              <Icon name="pencil" />{" "}
            </Button>
          )}
          {props.user.username === props.username && editable && (
            <>
              <Button icon size="mini" floated="left" onClick={modifyTrip}>
                {" "}
                <Icon name="check" />
              </Button>
              <Button
                icon
                size="mini"
                floated="left"
                onClick={() => setEditable(false)}
              >
                <Icon name="x" />
              </Button>
            </>
          )}
        </Card.Content>
      </Card.Content>
    </Card>
  );
}

const MODIFY_TRIP_MUTATION = gql`
  mutation modifyTrip(
    $name: String!
    $tripId: ID!
    $startDate: String!
    $endDate: String!
  ) {
    modifyTrip(
      name: $name
      tripId: $tripId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      name
      startDate
      endDate
    }
  }
`;
