import React, { Component } from "react";
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
import "semantic-ui-css/semantic.min.css";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import FixedMenu from "./components/FixedMenu";
import AdministrationTab from "./components/AdministrationTab"

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.set(5, { from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

    // Update state with the result.
    this.setState({ storageValue: response.toNumber() });
  };

  render() {
    const {web3, accounts, contract } = this.state;

    const panes = [
      {
        menuItem: "Administer Trust",
        render: () => (
          <Tab.Pane attached={true}>
            <AdministrationTab web3={web3} accounts={accounts} contract={contract}/>
          </Tab.Pane>
        )
      },
      {
        menuItem: "Payment History",
        render: () => (
          <Tab.Pane attached={true}>
            Nothing to see here yet!
          </Tab.Pane>
        )
      }];
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <FixedMenu />

        <Container text style={{ marginTop: "7em" }}>
          <Header as="h4" attached="top" block>
            Trust Information
          </Header>
          <Segment attached>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>Remaining Trust: asdfasdfasdf</Grid.Column>
                <Grid.Column>Trust Paid: asdfasdf</Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>Percent/Payment:</Grid.Column>
                <Grid.Column>Trust Paid:</Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <Divider section />

          <Tab menu={{ attached: true}} panes={panes}/>
        </Container>
      </div>
    );
  }
}

export default App;
