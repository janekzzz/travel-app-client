import React, { useState } from "react";
import gql from "graphql-tag";
import { Card, Form, Button, Dropdown } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import axios from "axios";

function ExpenseForm({ tripId, users }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [rate, setRate] = useState(1);
  const [paidBy, setPaidBy] = useState(users[users.length - 1].username);

  const catClues = [
    {
      catName: "Bed",
      clues: ["accommodation", "hotel", "motel", "room", "hostel", "airbnb"],
    },
    {
      catName: "Eating out",
      clues: [
        "eating",
        "dinner",
        "lunch",
        "breakfast",
        "pizza",
        "burger",
        "sushi",
        "kebab",
        "brunch",
        "restaurant",
        "coffee",
      ],
    },
    {
      catName: "Transport",
      clues: ["bus", "tram", "ferry", "uber", "taxi", "train", "taxi", "uber"],
    },
    { catName: "Flight tickets", clues: ["plane", "flight", "airline", "air"] },
    {
      catName: "Groceries",
      clues: ["food", "shop", "groceries", "shopping", "grocery"],
    },
    {
      catName: "Attractions",
      clues: ["museum", "fun", "zoo", "cinema", "tour"],
    },
    {
      catName: "Car rental",
      clues: ["rental", "car"],
    },
    {
      catName: "Party",
      clues: ["drink", "beer", "club", "pub", "bar", "dancing"],
    },
  ];

  let baseCurrency = "EUR";
  const options = [
    { key: "EUR", text: "EUR", value: "EUR" },
    { key: "USD", text: "USD", value: "USD" },
    { key: "DKK", text: "DKK", value: "DKK" },
    { key: "PLN", text: "PLN", value: "PLN" },
  ];

  let userOptions = [];
  users.forEach((u) =>
    userOptions.push({ key: u.username, text: u.username, value: u.username })
  );

  const checkCategory = (event) => {
    let found = false;
    let words = event.target.value.toLowerCase().split(" ");

    catClues.forEach((cat) => {
      cat.clues.forEach((clue) => {
        words.forEach((word) => {
          if (word === clue) {
            setCategory(cat.catName);
            found = true;
            return;
          }
        });
      });
    });
    if (!found) setCategory("Other");
  };

  const currencyCheck = async (currency1) => {
    if (currency1 && currency1.length === 3) {
      axios
        .get(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`)
        .then((response) => {
          let rates = response.data.rates;
          if (
            Object.values(rates)[
              Object.keys(rates).findIndex((el) => el === currency1)
            ]
          ) {
            let exchangeRate = Object.values(rates)[
              Object.keys(rates).findIndex((el) => el === currency1)
            ];
            setRate(exchangeRate);
          } else setRate(1);

          submitExpense();
        });
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const onDropdownChange = (e, data) => {
    setCurrency(data.value);
  };

  const onDropdownSearchChange = (e, data) => {
    setSearchQuery(data.searchQuery);
  };


  const onDropdownChangeUser = (e, data) => {
    setPaidBy(data.value);
  };

  

  const submit = () => {
    currencyCheck(currency);
  };

  const [submitExpense] = useMutation(SUBMIT_EXPENSE_MUTATION, {
    update(proxy, result) {
      setName("");
      setCost(0);
      setCategory("");
      setCurrency("EUR");
      setSearchQuery("");
      setPaidBy(users[users.length - 1].username);
      //commentInputRef.current.blur();
    },
    variables: {
      tripId: tripId,
      name,
      cost,
      category,
      currency,
      rate,
      paidBy,
    },
  });

  return (
    <Card fluid>
      <Card.Content style={{ margin: "auto" }}>
        <Form>
          <Form.Group>
            <Form.Input
              label="Name of the expense:"
              className="input-field"
              type="text"
              placeholder="What did you buy?"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={(event) => checkCategory(event)}
            />
            <Form.Input
              label="Price:"
              className="input-field-dropdown"
              action={
                <Dropdown
                  className="input-dropdown"
                  button
                  basic
                  floating
                  options={options}
                  search
                  text={searchQuery}
                  searchQuery={searchQuery}
                  value={currency}
                  onChange={onDropdownChange}
                  onSearchChange={onDropdownSearchChange}
                />
              }
              type="number"
              placeholder="Cost.."
              name="cost"
              value={cost}
              onChange={(event) => setCost(parseInt(event.target.value, 10))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Category"
              className="input-field"
              placeholder="Category.."
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              list="categories"
            />
            <datalist id="categories">
              <option value="Eating out" />
              <option value="Bed" />
              <option value="Plane tickets" />
              <option value="Car rental" />
              <option value="Attractions" />
              <option value="Fuel" />
              <option value="Party" />
              <option value="Groceries" />
              <option value="Other" />
            </datalist>
            <Form.Field><label>Paid by:</label>
            <Dropdown
              className="input-dropdown-alone"
              button
              basic
              floating
              options={userOptions}
              value={paidBy}
              onChange={onDropdownChangeUser}
            /></Form.Field>
          </Form.Group>
          <Button
            type="submit"
            className="ui button orange input-button"
            disabled={
              name.trim() === "" ||
              category.trim() === "" ||
              currency.trim() === ""
            }
            onClick={submit}
          >
            Add Expense
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
}
export default ExpenseForm;

const SUBMIT_EXPENSE_MUTATION = gql`
  mutation(
    $tripId: ID!
    $name: String!
    $cost: Float!
    $currency: String!
    $category: String!
    $rate: Float!
    $paidBy: String!
  ) {
    createExpense(
      tripId: $tripId
      name: $name
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
        username
        rate
        paidBy
        createdAt
      }
     
    }
  }
`;
