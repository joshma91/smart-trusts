import React from "react";
import {
  Container,
  Header,
  Divider,
  Segment,
  Button,
  Grid,
  Form,
  Input,
  Tab,
  Table
} from "semantic-ui-react";

export default class HistoryTab extends React.Component {
  state = {};

  componentDidMount = async () => {
    const { web3, contract, accounts, beneficiary } = this.props;

    contract.events.PaymentMade(
      {
        fromBlock: 0
      },
      function(error, event) {
        console.log(event);
      }
    );
  };
  render() {
    return (
      <div>
        {" "}
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Date Joined</Table.HeaderCell>
              <Table.HeaderCell>E-mail</Table.HeaderCell>
              <Table.HeaderCell>Called</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>{this.props.beneficiary}</Table.Cell>
              <Table.Cell>September 14, 2013</Table.Cell>
              <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
              <Table.Cell>No</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}
