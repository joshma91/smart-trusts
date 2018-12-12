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
  state = { response: null}

  async componentDidMount() {
    const {web3, accounts, contract } = this.props;
    // const response = await contract.methods.get().call({ from: accounts[2] });
    // this.setState({response})
  }

  render(){
    const { response } = this.state
    return (
      <div>
      {response ? (response.toNumber()): null}
      <Header as="h4" attached="top" block>
      OpenLaw Contract Functions (TestRPC Only!)
    </Header>
    <Segment attached>
      <Button>Initialize Trust</Button>
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