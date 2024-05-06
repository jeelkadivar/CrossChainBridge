// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './BridgeBase.sol';

contract BridgeBinance is BridgeBase {
  constructor(address bridgetoken) BridgeBase(bridgetoken) {}
}
