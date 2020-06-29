import gql from 'graphql-tag';

export const FETCH_TRIPS_QUERY = gql`
  {
    getTrips {
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
