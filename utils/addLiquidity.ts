import { getNamedAccounts, ethers, network } from "hardhat";
import { networkConfig } from "../helper-hardhat-config";

import { BigNumber } from "ethers";
import {
  IERC20Token,
  IUniswapV2Factory,
  IUniswapV2Router,
} from "../typechain-types";

const addLiquidity = async (
  tokenA: IERC20Token,
  tokenB: any,
  amountADesired: BigNumber,
  amountBDesired: BigNumber
) => {
  //   const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deployer } = await getNamedAccounts();

  const UniswapV2Router: IUniswapV2Router = await ethers.getContractAt(
    "IUniswapV2Router",
    networkConfig[network.name].router!,
    deployer
  );

  const factoryAddress: string = await UniswapV2Router.factory();
  const UniswapV2Factory: IUniswapV2Factory = await ethers.getContractAt(
    "IUniswapV2Factory",
    factoryAddress,
    deployer
  );
  let getPair;
  getPair = await UniswapV2Factory.getPair(tokenA.address, tokenB.address);

  if (getPair === "0x0000000000000000000000000000000000000000") {
    const approveTokenATransactionResponse = await tokenA.approve(
      networkConfig[network.name].router!,
      amountADesired
    );
    await approveTokenATransactionResponse.wait(1);
    console.log(`$${await tokenA.symbol()} approved`);

    const approveTokenBTransactionResponse = await tokenB.approve(
      networkConfig[network.name].router,
      amountBDesired
    );
    await approveTokenBTransactionResponse.wait(1);
    console.log(`$${await tokenB.symbol()} approved`);

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const addLiqudityTransactionResponse = await UniswapV2Router.addLiquidity(
      tokenA.address,
      tokenB.address,
      amountADesired,
      amountBDesired,
      0,
      0,
      deployer,
      timestampBefore + 300
    );
    addLiqudityTransactionResponse.wait(1);
    console.log(addLiqudityTransactionResponse);
    getPair = await UniswapV2Factory.getPair(tokenA.address, tokenB.address);
  }

  return getPair;
};
export default addLiquidity;
