import React from 'react';
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
  state = {}

  async componentDidMount() {
    const {web3, accounts, contract } = this.props;

  }

  initializeTrust = async () => {
    const {web3, accounts, contract } = this.props;
    
    await contract.methods
    .initializeTrust("0xf17f52151EbEF6C7334FAD080c5704D77216b732", "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef", "0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2", 1000)
    .send({ from: accounts[0]})
    .on("receipt", function(receipt) {
      console.log(receipt.events.TrustInitialized.returnValues);
    });
  }

  render(){

    return (
      <div>
      <Header as="h4" attached="top" block>
      OpenLaw Contract Functions (TestRPC Only!)
    </Header>
    <Segment attached>
      <Button onClick={this.initializeTrust}>Initialize Trust</Button>
      <Button style={{ marginLeft: "50px" }}>Make Payment</Button>
    </Segment>

    <Header as="h4" attached="top" block>
      Grantor Powers
    </Header>
    <Segment attached style={{ textAlign: "left" }}>
      <Form className="manual-center">
        <Form.Field inline>
          <label>Fund Trust</label>
          <input placeholder="0 ETH" />
          <Button type="submit">Fund</Button>
        </Form.Field>
      </Form>

      <Form className="manual-center">
        <Form.Field inline>
          <label>Withdraw From Trust</label>
          <input placeholder="0 ETH" />
          <Button type="submit">Withdraw</Button>
        </Form.Field>
      </Form>
    </Segment>

    <Header as="h4" attached="top" block>
      Grantor/Trustee Powers
    </Header>
    <Segment attached>
      <Form>
        <Form.Field inline>
          <label>Set Distribution Rate</label>
          <input placeholder="0.1% per Period" />
          <Button type="submit">Set</Button>
        </Form.Field>
      </Form>

      <Form>
        <Button negative>Terminate Trust</Button>
      </Form>
    </Segment>
    </div>
    )
  }
}