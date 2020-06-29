import React, { useState, Fragment } from "react";
import { Accordion, Icon, Card, Transition } from "semantic-ui-react";
import CategorizeExpenses from '../util/CategorizeExpenses'

function CategoriesAccordion(props) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  let categories = CategorizeExpenses(props.expenses)


  let largestExpense =0;
  categories.forEach((cat) => {
    if (cat.totalExpense > largestExpense) largestExpense = cat.totalExpense;
  });
  categories.forEach((cat) => (cat.p = `${cat.totalExpense/largestExpense * 85}%`));
  
  
  

  return (
    <Card fluid>
      <Card.Content>
        <p>Expenses by category:</p>
        <Accordion fluid>
          {categories.map((cat, indx) => (
            <Fragment key={indx}>
              <Accordion.Title
                active={activeIndex === indx}
                index={indx}
                onClick={handleClick}
                
              >
                <Icon name="dropdown" />
                {cat.categoryName}
              </Accordion.Title>
              <div className="category-bar" style={{ width: cat.p }}>
                <p>{cat.percentage.toFixed(0)}%</p>
              </div>
              
                <Accordion.Content active={activeIndex === indx}>
                  <strong>Total Expense: {cat.totalExpense.toFixed(2)}</strong>
                  <hr />
                  Average Expense: {cat.averageExpense.toFixed(2)}
                  
                  <hr />
                  Largest expense: {cat.largestExpense.toFixed(2)} (
                  {cat.largestExpenseName})
                </Accordion.Content>
              
            </Fragment>
          ))}
        </Accordion>
      </Card.Content>
    </Card>
  );
}

export default CategoriesAccordion;
