pragma solidity ^0.4.24;

/**
 * @title SmartTrust
 * @author Josh Ma
 * @notice SmartTrust is the entry point for interacting with a corresponding OpenLaw 'Smart Trusts' agreement
 **/
contract SmartTrust {

  /// @notice TrustInitialized is emitted when the trust is initialized 
  event TrustInitialized(address grantor, address trustee, address beneficiary, uint basisPoints);

  /// @notice TrustFunded is emitted when the Grantor adds funds to the trust 
  event TrustFunded(uint funding, uint trustValue);
  
  /// @notice PaymentMade is emitted every time a payment is made to the beneficiary
  event PaymentMade(uint payment, uint trustPaid, uint trustValue);
  
  address grantor;
  address trustee;
  address beneficiary;
  address openlaw;
  uint trustPaid;

  // percentages in this contract will be represented by basis points to permit small percentages i.e. 0.01% = 1 BP 
  uint paymentPercentInBP; 

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

  modifier onlyOpenLaw {
    require(msg.sender == openlaw, "uh oh, you don't have the right permissions");
    _;
  }

  /**
   * @notice initializeTrust is called by OpenLaw when the trust agreement is signed 
   * @param _grantor - grantor address
   * @param _trustee - trustee address
   * @param _beneficiary - beneficiary address
   * @param _basisPoints - percentage of trust paid per period in basis points
   */
  function initializeTrust (address _grantor, address _trustee, address _beneficiary, uint _basisPoints) public payable {
    
    // require that the openlaw variable is unset to implement access control 
    require(openlaw == address(0), "contract is already in use");
    openlaw = msg.sender;
    grantor = _grantor;
    beneficiary = _beneficiary;
    trustee = _trustee;
    paymentPercentInBP = _basisPoints;
    trustPaid = 0;
    emit TrustInitialized(grantor, trustee, beneficiary, paymentPercentInBP);
  }

  /**
   * @notice getTrustData returns all relevant information in this contract
   */
  function getTrustData () public view returns 
    (address, address, address, uint, uint, uint) {
    return(grantor, trustee, beneficiary, trustPaid, paymentPercentInBP, address(this).balance);
  }

  /// @notice fallback function which refunds ether if the caller is not the grantor. Will accept the ether if caller is the grantor
  function () external payable {
    if (msg.sender != grantor && msg.value > 0){
      msg.sender.transfer(msg.value);
    } else {
      fundTrust();
    }
  }

  /// @notice fundTrust allows the grantor to contribute funds to the trust. Called from DApp
  function fundTrust () public payable onlyGrantor {
    emit TrustFunded(msg.value, address(this).balance);
  }

  /**
   * @notice makePayment is called at an interval specified in the OpenLaw contract to distribute payments to beneficiary
   */
  function makePayment () public onlyOpenLaw {
    uint payment; 
    uint trustBalance = address(this).balance;
    payment = trustBalance * paymentPercentInBP / 10000;

    require(payment > 0 && payment < trustBalance, "make sure there are sufficient funds in the trust");
    beneficiary.transfer(payment);
    trustPaid += payment;
    emit PaymentMade(payment, trustPaid, address(this).balance);
  } 
  
  /**
   * @notice changePercentage is called by the grantor or trustee in a DApp to change the percentage paid to the beneficiary
   * @param _newPaymentPercentInBP - new payment percentage in basis points
   */
  function changePercentage (uint _newPaymentPercentInBP) public grantorOrTrustee {
    require(_newPaymentPercentInBP > 0, "please select a value greater than 0.0001");
    paymentPercentInBP = _newPaymentPercentInBP;
  }

  function withdrawFromTrust (uint _amount) public onlyGrantor {
    require(_amount <= address(this).balance, "can't withdraw more than the trust balance");
    grantor.transfer(_amount);
  }

  /// @notice terminateTrust is called by the grantor or trustee in a DApp to kill this contract and send remaining funds to beneficiary
  function terminateTrust () public grantorOrTrustee {
    selfdestruct(beneficiary);
  }
}