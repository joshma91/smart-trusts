import React from "react";
import {
  Table,
  Loader
} from "semantic-ui-react";
import { formatNumber } from "../utils/formatNumber"

export default class HistoryTab extends React.Component {
  state = { payments: [] };

  componentDidMount = async () => {
    const { web3, contract, accounts, beneficiary } = this.props;

    contract.events
      .PaymentMade(
        {
          fromBlock: 0
        },
        function(error, event) {}
      )
      .on("data", async event => {
        const { payments } = this.state;
        const hash = event.transactionHash;
        const block = await web3.eth.getTransaction(hash);
        const time = await web3.eth.getBlock(block.blockNumber);
        const d = new Date(time.timestamp * 1000);
        const date =
          d.getDate() +
          "/" +
          (parseInt(d.getMonth()) + 1) +
          "/" +
          d.getFullYear() +
          " " +
          d.getHours() +
          ":" +
          d.getMinutes();
        payments.push({
          d,
          date,
          payment: event.returnValues.payment,
          trustPaid: event.returnValues.trustPaid
        });
        this.setState({ payments });
      });
  };

  render() {
    const { payments } = this.state;
    payments.sort((a, b) => {
      return b.d - a.d;
    });
    
    const { web3 } = this.props;
    return (
      <div>
        {" "}
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Payment</Table.HeaderCell>
              <Table.HeaderCell>Trust Paid</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {payments.length > 0 ? (
              payments.map(x => {
                return (
                  <Table.Row>
                    <Table.Cell>{x.date}</Table.Cell>
                    <Table.Cell>{formatNumber(web3.utils.fromWei(x.payment))} ETH</Table.Cell>
                    <Table.Cell>
                      {formatNumber(web3.utils.fromWei(x.trustPaid))} ETH
                    </Table.Cell>
                  </Table.Row>
                );
              })): (<Loader style={{marginTop:"50px"}} active />)}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
