pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SmartTrust is Ownable {
  event TrustFunded(uint funding, uint trustValue);
  event PaymentMade(uint payment, uint trustValue);
  
  address grantor;
  address beneficiary;
  address trustee;
  uint paymentPercentInBP; //percentages in this contract will be represented by basis points to allow small percentages i.e. 0.01% = 1 BP 
  
  modifier onlyGrantor {
    require(msg.sender == grantor, "uh oh, you don't have the right permissions");
    _;
  } 

  modifier grantorOrTrustee {
    require(msg.sender == grantor || msg.sender == trustee, "uh oh, you don't have the right permissions");
    _;
  }

  modifier onlyBeneficiary {
    require(msg.sender == beneficiary, "uh oh, you don't have the right permissions");
    _;
  }

  function initializeParties (address _grantor, address _trustee, address _beneficiary, uint _basisPoints) public payable {
    grantor = _grantor;
    beneficiary = _beneficiary;
    trustee = _trustee;
    paymentPercentInBP = _basisPoints;
  }

  function () public payable {
    if (msg.sender != grantor && msg.value > 0){
      msg.sender.transfer(msg.value);
    } else {
      fundTrust();
    }
  }

  function fundTrust () public payable onlyGrantor {
    emit TrustFunded(msg.value, address(this).balance);
  }

  function makePayment (uint _percent) public onlyOwner {
    uint memory payment; 
    uint memory trustBalance = address(this).balance;
    payment = trustBalance * paymentPercentInBP / 10000;
    require(payment > 0 && payment < trustBalance, "make sure there are sufficient funds in the trust");
    beneficiary.transfer(payment);
    emit PaymentMade(payment, address(this).balance);
  } 
  
  function changePercentage (uint _newPaymentPercentInBP) public grantorOrTrustee {
    require(_newPaymentPercentInBP > 0, "please select a value greater than 0.0001");
    paymentPercentInBP = _newPaymentPercentInBP;
  }

  function terminateTrust () public grantorOrTrustee {
    selfdestruct(beneficiary);
  }
}