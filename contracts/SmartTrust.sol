pragma solidity ^0.4.24;

contract SmartTrust {
  event TrustFunded(uint funding, uint totalValue);
  
  address grantor;
  address beneficiary;
  address trustee;
  
  modifier onlyGrantor () {
    require(msg.sender == grantor, "uh oh, you don't have the right permissions");
    _;
  } 

  modifier grantorOrTrustee () {
    require(msg.sender == grantor || msg.sender == trustee, "uh oh, you don't have the right permissions");
    _;
  }

  modifier onlyBeneficiary () {
    require(msg.sender == beneficiary, "uh oh, you don't have the right permissions");
    _;
  }

  function initializeParties (address _grantor, address _trustee, address _beneficiary) public payable {
    grantor = _grantor;
    beneficiary = _beneficiary;
    trustee = _trustee;
  }

  function () payable public {
    if (msg.sender != grantor && msg.value > 0){
      msg.sender.transfer(msg.value);
    } else {
      fundTrust();
    }
  }

  function fundTrust () public payable onlyGrantor() {
    emit TrustFunded(msg.value, address(this).balance);
  }
}