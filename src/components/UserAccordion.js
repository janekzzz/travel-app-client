import React from "react";
import { Icon, Card, Transition } from "semantic-ui-react";

function UserAccordion(props) {
  let expByUser = [];
  let largestExpense = 0;
  props.users.forEach((u) =>
    expByUser.unshift({ username: u.username, totalExpense: 0 })
  );
    
  props.users.forEach((user) => {
    props.expenses.forEach((exp) => {
      if (exp.paidBy === user.username) {
        let index = expByUser.findIndex((el) => el.username === user.username);
        expByUser[index].totalExpense += exp.cost / exp.rate;
      }
    });
  });
  let total = expByUser.reduce((acc, el)=>acc + el.totalExpense,0);
  expByUser.forEach(e=> {if (e.totalExpense> largestExpense) largestExpense = e.totalExpense})
  expByUser.forEach(e=>e.width = `${e.totalExpense /largestExpense*85}%`)

  return (
    <Card fluid>
      <Card.Content>
        <p>Expenses by user:</p>
      </Card.Content>
      {expByUser.map((u, indx) => (
        <Transition.Group>
        <Card.Content key={indx}>
          <Icon name="user circle" />
          {u.username}: {u.totalExpense.toFixed(2)} EUR<br/>
          <div className="category-bar" style={{ width: u.width }}>
                <p>{(u.totalExpense / total*100).toFixed(0)}%</p>
              </div>
          
        </Card.Content>
        </Transition.Group>
      ))}
    </Card>
  );
}

export default UserAccordion;
