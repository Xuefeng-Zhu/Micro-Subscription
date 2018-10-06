pragma solidity ^0.4.24;

import "chainlink/solidity/contracts/Chainlinked.sol";

contract ChainCloud is Chainlinked {
  uint256 public uptime;

  address constant ROPSTEN_LINK_ADDRESS = 0x20fE562d797A42Dcb3399062AE9546cd06f63280;
  address constant ROPSTEN_ORACLE_ADDRESS = 0x18170370BceC331F31d41B9b83DE772F5Bd47D82;
  bytes32 constant JOB_ID = bytes32("269d3dd5e693414eb09fd83f8f143797");

  constructor(){
    uptime = 1;
    setLinkToken(ROPSTEN_LINK_ADDRESS);
    setOracle(ROPSTEN_ORACLE_ADDRESS);
  }

  function updateUptime() public {
    ChainlinkLib.Run memory run = newRun(JOB_ID, this, "report(bytes32,uint256)");
    run.add("url", "https://chaincloud-a384b.firebaseio.com/health.json");
    string[] memory path = new string[](1);
    path[0] = "running";
    run.addStringArray("path", path);
    chainlinkRequest(run, LINK(1));

  }

  function report(bytes32 _externalId, uint256 _uptime)
    public
    checkChainlinkFulfillment(_externalId)
  {
    uptime = _uptime;
  }

  function bytesToUint(bytes b) public returns (uint256){
    uint256 number;
    for(uint i=0;i<b.length;i++){
      number = number + uint(b[i])*(256 ** i);
    }
    return number;
  }

  function isFinalized(bytes _query, uint _timeout) public view returns (bool) {
    require(_query.length <= 8);
    uint256 time = bytesToUint(_query);
    return uptime == 0 || now > uint(time);
  }

  function queryResult(bytes _query) public view returns (bool) {
    require(_query.length == 1);
    return uptime == uint8(_query[0]);
  }
}
