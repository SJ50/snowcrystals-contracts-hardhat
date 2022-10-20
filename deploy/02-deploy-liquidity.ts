import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { ethers } from "hardhat";
// import * as UniswapV2Router from "../interfaces/router_abi.json";
import IUniswapV2Router from "../interfaces/router_abi.json";
import IUniswapV2Factory from "../interfaces/factory_abi.json";
import IUsdc from "../interfaces/usdc_abi.json";

const deployLiquidity: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const USDC = await ethers.getContractAt(
    IUsdc,
    networkConfig[network.name].usdc!
  );
  const UniswapV2Router = await ethers.getContractAt(
    IUniswapV2Router,
    networkConfig[network.name].router!
  );
  const UniswapV2Factory = await ethers.getContractAt(
    IUniswapV2Factory,
    UniswapV2Router.factory()
  );
  console.log(UniswapV2Router.WETH());
};
export default deployLiquidity;
deployLiquidity.tags = ["all", "liquidity"];
