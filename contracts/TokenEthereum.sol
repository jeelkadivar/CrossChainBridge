// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './TokenBase.sol';

contract TokenEthereum is TokenBase {
  constructor() TokenBase('ETH Token', 'ETK') {}
}
