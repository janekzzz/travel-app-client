import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

function PostCard({
  trip: { name, createdAt, id, username, days, totalExpense },
}) {
  return (
    <Card fluid className="trip-card">
      <Card.Content header={name} as={Link} to={`/trips/${id}`} className="orange-background"/>

      <Card.Content>
        <Icon name="tag" />
        {totalExpense.toFixed(2)} EUR spent
      </Card.Content>
      <Card.Content>
        <Icon name="calendar outline" />
        {days} days
      </Card.Content>
    </Card>
  );
}

export default PostCard;
