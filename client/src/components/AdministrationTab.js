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
  Tab
} from "semantic-ui-react";

export default class AdministrationTab extends React.Component {
  state = { fundAmount: "", withdrawAmount: "", newPaymentRate: "" };

  async componentDidMount() {
    const { web3, accounts, contract } = this.props;
  }

  setFundAmount = e => this.setState({ fundAmount: e.target.value });
  setWithdrawAmount = e => this.setState({ withdrawAmount: e.target.value });
  setNewPaymentRate = e => this.setState({ newPaymentRate: e.target.value });

  initializeTrust = async () => {
    const { web3, accounts, contract } = this.props;

    await contract.methods
      .initializeTrust(
        "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
        "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
        "0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2",
        100
      )
      .send({ from: accounts[0] })
      .on("receipt", function(receipt) {
        console.log(receipt.events.TrustInitialized.returnValues);
      });
  };

  makePayment = async () => {
    const { web3, accounts, contract } = this.props;
    await contract.methods.makePayment().send({ from: accounts[0] });
  };

  fundTrust = async () => {
    const { web3, accounts, contract } = this.props;
    const { fundAmount } = this.state;
    const amountToSend = web3.utils.toWei(fundAmount);
    await contract.methods
      .fundTrust()
      .send({ from: accounts[0], value: amountToSend });
  };

  withdrawFunds = async () => {
    const { web3, accounts, contract } = this.props;
    const { withdrawAmount } = this.state;
    const amountToWithdraw = web3.utils.toWei(withdrawAmount);
    await contract.methods
      .withdrawFromTrust(amountToWithdraw)
      .send({ from: accounts[0] });
  };

  setRate = async () => {
    const { web3, accounts, contract } = this.props;
    const { newPaymentRate } = this.state;
    await contract.methods
      .changePercentage(newPaymentRate * 100)
      .send({ from: accounts[0] });
  };

  terminateTrust = async () => {
    const { web3, accounts, contract } = this.props;
    await contract.methods
      .terminateTrust()
      .send({ from: accounts[0], gas: 3000000 });
  };

  render() {
    return (
      <div>
        <Header as="h4" attached="top" block>
          OpenLaw Contract Functions (TestRPC Only!)
        </Header>
        <Segment attached>
          <Button onClick={this.initializeTrust}>Initialize Trust</Button>
          <Button style={{ marginLeft: "50px" }} onClick={this.makePayment}>
            Make Payment
          </Button>
        </Segment>

        <Header as="h4" attached="top" block>
          Grantor Powers
        </Header>
        <Segment attached style={{ textAlign: "left" }}>
          <Form className="manual-center">
            <Form.Field inline>
              <label>Fund Trust</label>
              <input
                value={this.state.fundAmount}
                onChange={this.setFundAmount}
                placeholder="0 ETH"
              />
              <Button onClick={this.fundTrust}>Fund</Button>
            </Form.Field>
          </Form>

          <Form className="manual-center">
            <Form.Field inline>
              <label>Withdraw From Trust</label>
              <input
                value={this.state.withdrawAmount}
                onChange={this.setWithdrawAmount}
                placeholder="0 ETH"
              />
              <Button onClick={this.withdrawFunds} type="submit">
                Withdraw
              </Button>
            </Form.Field>
          </Form>
        </Segment>

        <Header as="h4" attached="top" block>
          Grantor/Trustee Powers
        </Header>
        <Segment attached>
          <Form>
            <Form.Field inline>
              <label>Set Payment Rate</label>
              <input
                value={this.state.newPaymentRate}
                onChange={this.setNewPaymentRate}
                placeholder="0.1% per Period"
              />
              <Button onClick={this.setRate}>Set</Button>
            </Form.Field>
          </Form>

          <Form>
            <Button negative onClick={this.terminateTrust}>
              Terminate Trust
            </Button>
          </Form>
        </Segment>
      </div>
    );
  }
}
