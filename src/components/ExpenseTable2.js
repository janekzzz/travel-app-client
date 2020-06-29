import React, { useState } from "react";
import { Table, Button, Icon} from "semantic-ui-react";
import DeleteButton from "./DeleteButton";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import CellEdit from "./CellEdit";

export default function ExpenseTable2({ expenses, tripId, baseCurrency }) {
  const [editing, setEditing] = useState(false);
  const [editID, setEditID] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [currency] = useState("EUR");
  const [rate] = useState(1);

  const emojis = [
    {
      name: "Bed",
      emoji: "🛌",
    },
    { name: "Eating out", emoji: "🍴" },
    { name: "Flight tickets", emoji: "🛫" },
    { name: "Car rental", emoji: "🚗" },
    { name: "Attractions", emoji: "🎳" },
    { name: "Transportation", emoji: "🚌" },
    { name: "Fuel", emoji: "⛽" },
    { name: "Party", emoji: "🥂" },
  ];

  const edit = ({ name, category, id, cost, paidBy }) => {
    setEditing(true);
    setEditID(id);
    setName(name);
    setCost(cost);
    setCategory(category);
    setPaidBy(paidBy);
  };

  const [submitExpense] = useMutation(MODIFY_EXPENSE_MUATTION, {
    update() {
      setName("");
      setCost(0);
      setCategory("");
      setEditing(false);
    },
    variables: {
      tripId,
      expenseId: editID,
      name,
      cost,
      category,
      currency,
      rate,
      paidBy,
    },
  });

  return (
    <Table compact unstackable textAlign={"center"}>
      <Table.Header style={{ backgroundColor: "none" }}>
        <Table.Row>
          <Table.HeaderCell  width="5">
            Name
          </Table.HeaderCell>
          <Table.HeaderCell width="3">EUR</Table.HeaderCell>

          <Table.HeaderCell width="3">Category</Table.HeaderCell>
          <Table.HeaderCell width="2">Paid by</Table.HeaderCell>
          <Table.HeaderCell width="4"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

        <Table.Body>
        {expenses.map((expense) => (
          <Table.Row key={expense.id} style={{ marginBottom: 5 }}>
            <Table.Cell width="5">
              {editing && editID === expense.id ? (
                <CellEdit
                  submitCallback={submitExpense}
                  nameStr="name"
                  type={name}
                  setCallback={setName}
                />
              ) : (
                expense.name
              )}
            </Table.Cell>
            <Table.Cell width="3" style={{ backgroundColor: "#feca57" }}>
              {editing && editID === expense.id ? (
                <CellEdit
                  submitCallback={submitExpense}
                  inputType="number"
                  nameStr="cost"
                  type={cost}
                  setCallback={setCost}
                />
              ) : (
                <div>
                  <strong>
                    {(expense.cost / expense.rate).toFixed(2)} 
                  </strong>
                  {baseCurrency !== expense.currency && (
                    <div className="smol">
                      {expense.cost.toFixed(2)}  {expense.currency}
                    </div>
                  )}{" "}
                </div>
              )}
            </Table.Cell>
            <Table.Cell width="3">
              {editing && editID === expense.id ? (
                <CellEdit
                  submitCallback={submitExpense}
                  inputType="text"
                  nameStr="category"
                  type={category}
                  setCallback={setCategory}
                />
              ) : (
              <div >{expense.category} <br/>{emojis.find(e=> expense.category === e.name)? emojis[emojis.findIndex(e=> expense.category === e.name)].emoji : "💡"}</div>
              )}
            </Table.Cell>
            <Table.Cell width="2">
              {editing && editID === expense.id ? (
                <CellEdit
                  submitCallback={submitExpense}
                  inputType="text"
                  nameStr="paidBy"
                  type={paidBy}
                  setCallback={setPaidBy}
                />
              ) : (
                <>{expense.paidBy}</>
              )}
            </Table.Cell>

            <Table.Cell width="4">
              {editing && editID === expense.id ? (
                <>
                  <Button
                    icon
                    size="mini"
                    floated="left"
                    onClick={submitExpense}
                  >
                    {" "}
                    <Icon name="check" />
                  </Button>
                  <Button
                    icon
                    size="mini"
                    floated="right"
                    onClick={() => setEditing(false)}
                  >
                    <Icon name="x" />
                  </Button>
                </>
              ) : (
                <Button
                  icon
                  size="mini"
                  onClick={() => edit(expense)}
                >
                  <Icon name="pencil" />{" "}
                </Button>
              )}
              {editing && editID === expense.id ? null : (
                <DeleteButton
                  type={"expense"}
                  tripId={tripId}
                  expenseId={expense.id}
                />
              )}
            </Table.Cell>
          </Table.Row>
        ))}
        </Table.Body>
    </Table>
  );
}

const MODIFY_EXPENSE_MUATTION = gql`
  mutation modifyExpense(
    $name: String!
    $tripId: ID!
    $expenseId: ID!
    $cost: Float!
    $currency: String!
    $category: String!
    $rate: Float!
    $paidBy: String!
  ) {
    modifyExpense(
      name: $name
      tripId: $tripId
      expenseId: $expenseId
      cost: $cost
      currency: $currency
      category: $category
      rate: $rate
      paidBy: $paidBy
    ) {
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
