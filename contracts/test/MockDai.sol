// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract MockDai is ERC20 {
    constructor() public ERC20("Mock DAI", "DAI") {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
