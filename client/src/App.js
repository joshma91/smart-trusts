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
import HistoryTab from "./components/HistoryTab";

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    beneficiary: null,
    trustPaid: null,
    percent: null,
    remainingTrust: null
  };

  componentDidMount = async () => {
    await this.getWeb3AndContract();

    const { web3, accounts, contract } = this.state;
    const trustData = await contract.methods
      .getTrustData()
      .call({ from: accounts[0] });


    // poll blockchain for payments that are made and change state accordingly
    contract.events.PaymentMade(
      {
        fromBlock: (await web3.eth.getBlockNumber()), toBlock:'pending'
      },
      async (error, event) => {
        if (!error && event != null) {
          await this.setState({
            trustPaid: web3.utils.fromWei(event.returnValues.trustPaid),
            percent: event.returnValues.paymentPercentInBP,
            remainingTrust: web3.utils.fromWei(event.returnValues.trustValue)
          })
        }
      }
    );

    this.setState({
      beneficiary: trustData[2],
      trustPaid: web3.utils.fromWei(trustData[3]),
      percent: trustData[4],
      remainingTrust: web3.utils.fromWei(trustData[5])
    });
  };

  getWeb3AndContract = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract(web3, SmartTrustContract);

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
  };

  render() {
    const {
      web3,
      accounts,
      contract,
      beneficiary,
      trustPaid,
      percent,
      remainingTrust
    } = this.state;

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
          <Tab.Pane attached={true}>
            {" "}
            <HistoryTab
              web3={web3}
              accounts={accounts}
              contract={contract}
              beneficiary={beneficiary}
            />
          </Tab.Pane>
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
                <Grid.Column>Percent/Payment: {percent / 100}%</Grid.Column>
                <Grid.Column>
                  Beneficiary: {beneficiary.substring(2)}
                </Grid.Column>
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
