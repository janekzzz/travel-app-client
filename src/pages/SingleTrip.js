import React, { useContext } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Card, Icon, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import CommentCard from "../components/CommentCard";
import CommentForm from "../components/CommentForm";
import ExpenseTable2 from "../components/ExpenseTable2";
import ExpenseForm from "../components/ExpenseForm";
import CategoriesAccordion from "../components/CategoriesAccordion";
import AuthorizationForm from "../components/AuthorizationForm";
import UsersAccordion from "../components/UserAccordion";
import TripHeaderCard from "../components/TripHeaderCard";

function SingleTrip(props) {
  const tripId = props.match.params.tripId;
  const { user } = useContext(AuthContext);

  const { data } = useQuery(FETCH_TRIP_QUERY, {
    variables: {
      tripId,
    },
  });

  function deleteTripCallback() {
    props.history.push("/");
  }

  let tripMarkup;
  if (!data) {
    tripMarkup = <p>Loading trip...</p>;
  } else {
    const {
      id,
      name,
      username,
      comments,
      totalExpense,
      dailyExpense,
      startDate,
      endDate,
      expenses,
      expensesByCategory,
      authorizedUsers,
      baseCurrency,
    } = data.getTrip;
    let chartData = [];
    expensesByCategory.forEach((el) =>
      chartData.push({ value: el.totalExpense, name: el.categoryName })
    );

    tripMarkup = (
      <Grid stackable float>
        <Grid.Row>
          <Grid.Column width={4}>
            <TripHeaderCard
              name={name}
              startDate={startDate}
              endDate={endDate}
              totalExpense={totalExpense}
              dailyExpense={dailyExpense}
              id={id}
              username={username}
              user={user}
              callback={deleteTripCallback}
            />
            {expenses.length > 0 && <CategoriesAccordion expenses={expenses} />}
            {expenses.length > 0 && (
              <UsersAccordion
                expenses={expenses}
                users={[...authorizedUsers, { username: username }]}
              />
            )}
          </Grid.Column>
          <Grid.Column width={9}>
            <ExpenseForm
              tripId={tripId}
              users={[...authorizedUsers, { username: username }]}
            />
            {expenses.length > 0 && (
              <ExpenseTable2
                expenses={expenses}
                tripId={tripId}
                baseCurrency={baseCurrency}
              />
            )}
          </Grid.Column>
          <Grid.Column width={3}>
            <AuthorizationForm tripId={tripId} />
            <Card>
              <Card.Content>
                <Icon name="user circle" />
                {username} (admin)
              </Card.Content>
              <Transition.Group>
              {authorizedUsers.map((u) => (
                <Card.Content key={u.username}>
                  <Icon name="user circle" />
                  {u.username}
                  {user.username === username && (
                    <DeleteButton
                      type={"user"}
                      username={u.username}
                      tripId={tripId}
                    />
                  )}
                </Card.Content>
              ))}
              </Transition.Group>
            </Card>
            {user && <CommentForm tripId={tripId} />}
            <Transition.Group>
            {comments.map((comment) => (
              
              <CommentCard
                user={user}
                tid={tripId}
                comment={comment}
                key={comment.id}
              />
            ))}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return tripMarkup;
}

const FETCH_TRIP_QUERY = gql`
  query($tripId: ID!) {
    getTrip(tripId: $tripId) {
      id
      name
      createdAt
      username
      totalExpense
      dailyExpense
      baseCurrency
      startDate
      endDate
      comments {
        id
        username
        createdAt
        body
      }
      expenses {
        id
        name
        cost
        currency
        category
        rate
        username
        paidBy
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
      authorizedUsers {
        username
      }
    }
  }
`;
export default SingleTrip;
