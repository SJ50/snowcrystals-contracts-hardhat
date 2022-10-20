// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IOracle {
    function update() external;

    function consult(address _token, uint256 _amountIn)
        external
        view
        returns (uint144 amountOut);

    function twap(address _token, uint256 _amountIn)
        external
        view
        returns (uint144 _amountOut);

    function getPegPrice() external view returns (int256);

    function getPegPriceUpdated() external view returns (int256);
}
