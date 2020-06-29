import React from "react";
import { Form, Input } from "semantic-ui-react";

export default function CellEdit({
  submitCallback,
  nameStr,
  type,
  setCallback,
  inputType,
}) {
  let markup;

  if (nameStr === "category") {
    markup = (
      <Form onSubmit={submitCallback}>
        <Form.Input
          size="tiny"
          type={inputType}
          name={nameStr}
          list="categories"
          value={type}
          onClick={() => setCallback("")}
          onChange={(event) => setCallback(event.target.value)}
          style={{ margin: 0, padding: 0, width: 100 }}
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
      </Form>
    );
  } else if (nameStr === "cost") {
    markup = (
      <Form onSubmit={submitCallback}>
        <Input
          size="small"
          type={inputType}
          name={nameStr}
          value={type}
          onChange={(event) => setCallback(parseInt(event.target.value, 10))}
          style={{ margin: 0, padding: 0, width: 100 }}
        />
      </Form>
    );
  } else {
    markup = (   <Form onSubmit={submitCallback}>
      <Input
        size="small"
        type={inputType}
        name={nameStr}
        value={type}
        onChange={(event) => setCallback(event.target.value)}
        style={{ margin: 0, padding: 0, width: 70 }}
      />
    </Form>)
  }

  return markup;
}
