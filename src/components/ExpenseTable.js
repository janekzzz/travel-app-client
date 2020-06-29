import _ from 'lodash'
import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import DeleteButton from './DeleteButton'


export default class ExpenseTable extends Component {
  state = {
    column: null,
    data: this.props.expenses,
    tripId: this.props.tripId,
    direction: null,
  }

  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  render() {
    const { column, data, direction } = this.state;
    return (
      <Table sortable celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={this.handleSort('name')}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'cost' ? direction : null}
              onClick={this.handleSort('cost')}
            >
              Cost
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'category' ? direction : null}
              onClick={this.handleSort('category')}
            >
              Category
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'currency' ? direction : null}
              onClick={this.handleSort('currency')}
            >
              Currency
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'username' ? direction : null}
              onClick={this.handleSort('username')}
            >
              Username
            </Table.HeaderCell>
            <Table.HeaderCell>
              Actions
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(data, ({ id, name, cost, category, currency, username }) => (
            <Table.Row key={id}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{cost}</Table.Cell>
              <Table.Cell>{category}</Table.Cell>
              <Table.Cell>{currency}</Table.Cell>
              <Table.Cell>{username}</Table.Cell>
              <Table.Cell><DeleteButton type={'expense'} tripId={this.state.tripId} expenseId={id} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}