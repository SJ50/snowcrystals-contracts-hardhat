// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/IStdReference.sol";
import "../interfaces/IERC20Metadata.sol";

/**
 https://docs.bandchain.org/band-standard-dataset/supported-blockchains.html
 https://docs.bandchain.org/band-standard-dataset/using-band-dataset/using-band-dataset-evm.html
**/
contract DataFeedOracle {
    using SafeMath for uint256;
    IStdReference private immutable ref;

    uint256 public price;
    uint256[] public pricesArr;

    constructor(IStdReference _ref) public {
        ref = _ref;
    }

    function consult(
        address, /* _token */
        uint256 /* _amountIn */
    ) external pure returns (uint144 amountOut) {
        return 1e18;
    }

    function twap(
        address, /* _token */
        uint256 /* _amountIn */
    ) external pure returns (uint144 _amountOut) {
        return 1e18;
    }

    function getPrice(string memory _base, string memory _quote)
        external
        view
        returns (uint256)
    {
        IStdReference.ReferenceData memory data = ref.getReferenceData(
            _base,
            _quote
        );
        return data.rate;
    }

    function getMultiPrices(string[] memory _bases, string[] memory _quotes)
        external
        view
        returns (uint256[] memory)
    {
        require(_bases.length == _quotes.length, "BAD_INPUT_LENGTH");
        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(
            _bases,
            _quotes
        );

        uint256 len = _bases.length;
        uint256[] memory prices = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            prices[i] = data[i].rate;
        }

        return prices;
    }

    function savePrice(string memory _base, string memory _quote) external {
        IStdReference.ReferenceData memory data = ref.getReferenceData(
            _base,
            _quote
        );
        price = data.rate;
    }

    function saveMultiPrices(string[] memory _bases, string[] memory _quotes)
        public
    {
        require(_bases.length == _quotes.length, "BAD_INPUT_LENGTH");
        uint256 len = _bases.length;
        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(
            _bases,
            _quotes
        );
        delete pricesArr;
        for (uint256 i = 0; i < len; i++) {
            pricesArr.push(data[i].rate);
        }
    }
}
