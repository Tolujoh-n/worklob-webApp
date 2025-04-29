// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LOBToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("LOB Token", "LOB") {
        _mint(msg.sender, initialSupply * 10**18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount * 10**18);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount * 10**18);
    }
}
