pragma solidity ^0.5.1;

/**
 * @title SmartTrust
 * @author Josh Ma
 * @notice SmartTrust is the entry point for interacting with a corresponding OpenLaw 'Smart Trusts' agreement
 **/
contract SmartTrust {
  /// @notice TrustFunded is emitted when the Grantor adds funds to the trust 
  event TrustFunded(uint funding, uint trustValue);
  

  /// @notice PaymentMade is emitted every time a payment is made to the beneficiary
  event PaymentMade(uint payment, uint trustValue);
  
  address grantor;
  address payable beneficiary;
  address trustee;
  address openlaw;

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
   * @notice initializeParties is called by OpenLaw when the trust agreement is signed 
   * @param _grantor - grantor address
   * @param _trustee - trustee address
   * @param _beneficiary - beneficiary address
   * @param _basisPoints - percentage of trust paid per period in basis points
   */
  function initializeParties (address _grantor, address _trustee, address payable _beneficiary, uint _basisPoints) public payable {
    
    // require that the openlaw variable is unset to implement access control 
    require(openlaw == address(0), "contract is already in use");
    openlaw = msg.sender;
    grantor = _grantor;
    beneficiary = _beneficiary;
    trustee = _trustee;
    paymentPercentInBP = _basisPoints;
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
   * @param _percent - this just serves as a dummy variable because I haven't haven't figured out how to call Solidity functions with 0 arguments in OpenLaw
   */
  function makePayment (uint _percent) public onlyOpenLaw {
    uint payment; 
    uint trustBalance = address(this).balance;
    payment = trustBalance * paymentPercentInBP / 10000;

    require(payment > 0 && payment < trustBalance, "make sure there are sufficient funds in the trust");
    beneficiary.transfer(payment);
    emit PaymentMade(payment, address(this).balance);
  } 
  
    /**
   * @notice changePercentage is called by the grantor or trustee in a DApp to change the percentage paid to the beneficiary
   * @param _newPaymentPercentInBP - new payment percentage in basis points
   */
  function changePercentage (uint _newPaymentPercentInBP) public grantorOrTrustee {
    require(_newPaymentPercentInBP > 0, "please select a value greater than 0.0001");
    paymentPercentInBP = _newPaymentPercentInBP;
  }


  /// @notice terminateTrust is called by the grantor or trustee in a DApp to kill this contract and send remaining funds to beneficiary
  function terminateTrust () public grantorOrTrustee {
    selfdestruct(beneficiary);
  }
}