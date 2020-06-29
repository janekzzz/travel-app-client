import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import {FETCH_TRIPS_QUERY} from '../util/graphql'

export default function TripForm() {
  const { values, onChange, onSubmit } = useForm(createTripCallback, {
    name: "",
    startDate: "",
    endDate:"",
  });
  const [createTrip, { error }] = useMutation(CREATE_TRIP_MUTATION, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_TRIPS_QUERY
      })
      //data.getTrips = [result.data.createTrip, ...data.getTrips]
      proxy.writeQuery({query: FETCH_TRIPS_QUERY, data: {
        getTrips: [result.data.createTrip,...data.getTrips]
      }})
      values.name = "";
      values.startDate = "";
      values.endDate = "";
    },
    variables: values,
  });

  function createTripCallback() {
    createTrip();
    
  }

  return (
    <>
    <Form onSubmit={onSubmit}>
      <h2> Create a new trip:</h2>
      <Form.Field>
        <Form.Input
          label="Trip name:"
          placeholder="Trip name"
          name="name"
          onChange={onChange}
          value={values.name}
        />
        <Form.Input label="Starting date:"name="startDate" type="date" onChange={onChange} value={values.startDate} />
        <Form.Input label="End date:" name="endDate" type="date" onChange={onChange} value={values.endDate} />
        <Button type="submit" color="orange" disabled={values.name.trim() ==='' || values.startDate==='' || values.endDate === ''}>
          Create
        </Button>
      </Form.Field>
    </Form>
    {error && <div className="ui error message">
      <ul className="list">
        <li>{error.graphQLErrors[0].message}</li>
      </ul>
      </div>}
    </>
  );
}

const CREATE_TRIP_MUTATION = gql`
  mutation createTrip($name: String!, $startDate: String!, $endDate: String!) {
    createTrip(name: $name, startDate: $startDate, endDate: $endDate) {
      id
      name
      createdAt
      username
      totalExpense
      days
      totalExpense
      dailyExpense
    }
  }
`;
