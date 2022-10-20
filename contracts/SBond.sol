// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./access/Operator.sol";

/*
    https://snowcrystals.finance
*/

contract SBond is ERC20Burnable, Operator {
    using SafeMath for uint256;

    uint256 private totalBurned_;

    /**
     * @notice Constructs the Walrus Bond ERC-20 contract.
     */
    constructor(string memory name_, string memory symbol_)
        public
        ERC20(name_, symbol_)
    {}

    /**
     * @notice Operator mints basis bonds to a recipient
     * @param recipient_ The address of recipient
     * @param amount_ The amount of basis bonds to mint to
     * @return whether the process has been done
     */
    function mint(address recipient_, uint256 amount_)
        public
        onlyOperator
        returns (bool)
    {
        uint256 balanceBefore = balanceOf(recipient_);
        _mint(recipient_, amount_);
        uint256 balanceAfter = balanceOf(recipient_);

        return balanceAfter > balanceBefore;
    }

    function burn(uint256 amount) public override {
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount)
        public
        override
        onlyOperator
    {
        super.burnFrom(account, amount);
    }

    function totalBurned() external view returns (uint256) {
        return totalBurned_;
    }

    function _burn(address _account, uint256 _amount) internal override {
        super._burn(_account, _amount);
        totalBurned_ = totalBurned_.add(_amount);
    }

    function governanceRecoverUnsupported(
        address _token,
        uint256 _amount,
        address _to
    ) external onlyOperator {
        IERC20(_token).transfer(_to, _amount);
    }
}
