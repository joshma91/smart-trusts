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
import SmartTrustContract from "./contracts/SmartTrust.json";
import getWeb3 from "./utils/getWeb3";
import getContract from "./utils/getContract";
import truffleContract from "truffle-contract";
import FixedMenu from "./components/FixedMenu";
import AdministrationTab from "./components/AdministrationTab";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, trustPaid: null, percent: null, remainingTrust: null};

  componentDidMount = async () => {
    await this.getWeb3AndContract()

    const { web3, accounts, contract } = this.state;
    const trustData = await contract.methods.getTrustData().call({ from: accounts[0] });
    this.setState({ trustPaid: trustData[3], percent: trustData[4], remainingTrust: trustData[5] })
  };

  getWeb3AndContract = async () => {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const contract = await getContract(web3, SmartTrustContract)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      await this.setState({ web3, accounts, contract });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  }

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
    const { web3, accounts, contract, trustPaid, percent, remainingTrust } = this.state;

    const panes = [
      {
        menuItem: "Administer Trust",
        render: () => (
          <Tab.Pane attached={true}>
            <AdministrationTab
              web3={web3}
              accounts={accounts}
              contract={contract}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: "Payment History",
        render: () => (
          <Tab.Pane attached={true}>Nothing to see here yet!</Tab.Pane>
        )
      }
    ];
    if (!this.state.web3 || trustPaid == null) {
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
                <Grid.Column>Remaining Trust: {remainingTrust} ETH</Grid.Column>
                <Grid.Column>Trust Paid: {trustPaid} ETH</Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>Percent/Payment: {percent/10000}%</Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <Divider section />

          <Tab menu={{ attached: true }} panes={panes} />
        </Container>
      </div>
    );
  }
}

export default App;
