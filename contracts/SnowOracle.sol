// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./lib/Babylonian.sol";
import "./lib/FixedPoint.sol";
import "./lib/UniswapV2OracleLibrary.sol";
import "./utils/Epoch.sol";
import "./interfaces/lib/IUniswapV2Pair.sol";

// fixed window oracle that recomputes the average price for the entire period once every period
// note that the price average is only guaranteed to be over at least 1 period, but may be over a longer period
contract SnowOracle is Epoch {
    using FixedPoint for *;
    using SafeMath for uint256;
    using SafeMath for uint144;

    /* ========== STATE VARIABLES ========== */
    address public immutable snow;
    uint144 public constant DECIMALS_MULTIPLER = 10**12; // USDC Decimals = 6
    // uniswap
    address public immutable token0;
    address public immutable token1;
    IUniswapV2Pair public immutable pair;

    // oracle
    uint32 public blockTimestampLast;
    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    FixedPoint.uq112x112 public price0Average;
    FixedPoint.uq112x112 public price1Average;

    /* ========== CONSTRUCTOR ========== */

    constructor(
        IUniswapV2Pair _pair,
        uint256 _period,
        uint256 _startTime,
        address _snow
    ) public Epoch(_period, _startTime, 0) {
        snow = address(_snow);
        pair = _pair;
        token0 = _pair.token0();
        token1 = _pair.token1();
        price0CumulativeLast = _pair.price0CumulativeLast(); // fetch the current accumulated price value (1 / 0)
        price1CumulativeLast = _pair.price1CumulativeLast(); // fetch the current accumulated price value (0 / 1)
        uint112 reserve0;
        uint112 reserve1;
        (reserve0, reserve1, blockTimestampLast) = _pair.getReserves();
        require(reserve0 != 0 && reserve1 != 0, "Oracle: NO_RESERVES"); // ensure that there's liquidity in the pair
    }

    /* ========== MUTABLE FUNCTIONS ========== */

    /** @dev Updates 1-day EMA price from Uniswap.  */
    function update() external checkEpoch {
        (
            uint256 price0Cumulative,
            uint256 price1Cumulative,
            uint32 blockTimestamp
        ) = UniswapV2OracleLibrary.currentCumulativePrices(address(pair));
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired

        if (timeElapsed == 0) {
            // prevent divided by zero
            return;
        }

        // overflow is desired, casting never truncates
        // cumulative price is in (uq112x112 price * seconds) units so we simply wrap it after division by time elapsed
        price0Average = FixedPoint.uq112x112(
            uint224((price0Cumulative - price0CumulativeLast) / timeElapsed)
        );
        price1Average = FixedPoint.uq112x112(
            uint224((price1Cumulative - price1CumulativeLast) / timeElapsed)
        );

        price0CumulativeLast = price0Cumulative;
        price1CumulativeLast = price1Cumulative;
        blockTimestampLast = blockTimestamp;

        emit Updated(price0Cumulative, price1Cumulative);
    }

    // note this will always return 0 before update has been called successfully for the first time.
    function consult(address _token, uint256 _amountIn)
        external
        view
        returns (uint144 amountOut)
    {
        if (_token == token0) {
            amountOut = price0Average.mul(_amountIn).decode144();
        } else {
            require(_token == token1, "Oracle: INVALID_TOKEN");
            amountOut = price1Average.mul(_amountIn).decode144();
        }
        if (_token == snow) {
            amountOut = uint144(amountOut.mul(DECIMALS_MULTIPLER));
        }
    }

    function twap(address _token, uint256 _amountIn)
        external
        view
        returns (uint144 _amountOut)
    {
        (
            uint256 price0Cumulative,
            uint256 price1Cumulative,
            uint32 blockTimestamp
        ) = UniswapV2OracleLibrary.currentCumulativePrices(address(pair));
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (_token == token0) {
            _amountOut = FixedPoint
                .uq112x112(
                    uint224(
                        (price0Cumulative - price0CumulativeLast) / timeElapsed
                    )
                )
                .mul(_amountIn)
                .decode144();
        } else if (_token == token1) {
            _amountOut = FixedPoint
                .uq112x112(
                    uint224(
                        (price1Cumulative - price1CumulativeLast) / timeElapsed
                    )
                )
                .mul(_amountIn)
                .decode144();
        }
        if (_token == snow) {
            _amountOut = uint144(_amountOut.mul(DECIMALS_MULTIPLER));
        }
    }

    event Updated(uint256 price0CumulativeLast, uint256 price1CumulativeLast);
}
