// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './TokenBase.sol';

contract TokenBinance is TokenBase {
  constructor() TokenBase('BSC Token', 'BTK') {}
}
