// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IToken {
  function tokenMint(address to, uint amount) external;
  function tokenBurn(address owner, uint amount) external;
}
