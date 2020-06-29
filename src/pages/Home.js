import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Loader } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

import { FETCH_TRIPS_QUERY } from "../util/graphql";
import TripForm from "../components/TripForm";
import TripCard from "../components/TripCard";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_TRIPS_QUERY);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          {user && (
            <Grid.Column>
              <TripForm />
            </Grid.Column>
          )}
        </Grid.Column>
        <Grid.Column width={12}>
          
      <h2>Your trips:</h2>
          <Grid columns={3}>
            <Grid.Row>
              {loading ? (
                <Loader active/>
              ) : (
                <Transition.Group>
                  {data.getTrips &&
                    data.getTrips.map((trip) => (
                      <Grid.Column key={trip.id} style={{ marginBottom: 20 }}>
                        <TripCard trip={trip} className="trip-card" />
                      </Grid.Column>
                    ))}
                </Transition.Group>
              )}
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
