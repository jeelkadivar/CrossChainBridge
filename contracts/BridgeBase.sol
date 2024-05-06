// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract BridgeBase {
    // Public variable to store the bridgetoken contract instance
    IToken public bridgetoken;

    // Mapping to keep track of processed nonces for each sender address
    mapping(address => mapping(uint256 => bool)) public processedNonces;

    // Enum to store the step of transfer process
    enum TransferStep {
        Burn,
        Mint
    }

    // Event to keep track of transfer process
    event TokenTransfer(
        address from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 nonce,
        bytes signature,
        TransferStep indexed step
    );

    // Constructor to initialize the token contract instance
    constructor(address _token) {
        // Assign the token contract address to the public bridgetoken variable
        bridgetoken = IToken(_token);
    }

    // Function to allow token burn
    function tokenBurn(
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        // Check if the nonce has already been processed
        require(
            processedNonces[msg.sender][nonce] == false,
            "transfer already processed"
        );
        // Mark the nonce as processed
        processedNonces[msg.sender][nonce] = true;
        // Burn the specified amount of tokens from the sender
        bridgetoken.tokenBurn(msg.sender, amount);
        // Emit the Transfer event with transfer details and step
        emit TokenTransfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            signature,
            TransferStep.Burn
        );
    }

    // Function to allow token mint
    function tokenMint(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        // Calculate the hash of the message to be signed
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(from, to, amount, nonce))
        );
        // Check if the signature matches the hash of the message
        require(recoverSigner(message, signature) == from, "wrong signature");
        // Check if the nonce has already been processed
        require(
            processedNonces[from][nonce] == false,
            "transfer already processed"
        );
        // Mark the nonce as processed
        processedNonces[from][nonce] = true;
        // Mint the specified amount of tokens to the receiver
        bridgetoken.tokenMint(to, amount);
        // Emit the Transfer event with transfer details and step
        emit TokenTransfer(
            from,
            to,
            amount,
            block.timestamp,
            nonce,
            signature,
            TransferStep.Mint
        );
    }

    // Utility function to calculate the hash of the signed message
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        // Calculate the hash of the message with the Ethereum signed message prefix
        return keccak256(abi
.encodePacked("\x19Ethereum Signed Message:\n32", hash));
}
function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
    // Declare variables to hold the values of v, r and s in the signature
    uint8 v;
    bytes32 r;
    bytes32 s;

    // Split the signature into its components (v, r, s)
    (v, r, s) = splitSignature(sig);

    // Recover the address that signed the message
    return ecrecover(message, v, r, s);
}

function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
    // Ensure that the length of the signature is 65 bytes
    require(sig.length == 65);

    // Declare variables to hold the values of r, s, and v in the signature
    bytes32 r;
    bytes32 s;
    uint8 v;

    // Extract the values of r, s, and v from the signature
    assembly {
        r := mload(add(sig, 32))
        s := mload(add(sig, 64))
        v := byte(0, mload(add(sig, 96)))
    }

    // Return the extracted values (v, r, s)
    return (v, r, s);
}
}