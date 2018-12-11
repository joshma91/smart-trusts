pragma solidity ^0.4.24;

contract SmartTrust {
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

  function initializeParties (address _grantor, address _trustee, address _beneficiary) public {
    grantor = _grantor;
    beneficiary = _beneficiary;
    trustee = _trustee;
  }
}