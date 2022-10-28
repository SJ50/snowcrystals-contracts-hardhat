import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IERC20Token } from "../typechain-types";
import verify from "../utils/verify";
import { glcrStartTime } from "../utils/startTime";
import {
  networkConfig,
  mocksDeploymentChains,
  developmentChains,
} from "../helper-hardhat-config";

const snowCrystalsSnowGenesisRewardPool: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer, dao } = await getNamedAccounts();

  const DAO: string =
    developmentChains.includes(network.name) ||
    networkConfig[network.name].dao === undefined
      ? dao
      : networkConfig[network.name].dao!;

  const snowGenesisRewardPoolStartTime = await glcrStartTime(network.name);

  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying SNOW_GENESIS_REWARD_POOL and waiting for confirmations...");
  const snowGenesisRewardPool = await deploy("SnowGenesisRewardPool", {
    from: deployer,
    args: [
      SNOW.address,
      snowGenesisRewardPoolStartTime,
      DAO,
      120,
      USDC.address,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(snowGenesisRewardPool.address, [
      SNOW.address,
      snowGenesisRewardPoolStartTime,
      DAO,
      120,
      USDC.address,
    ]);
  }
  log(`SNOW_GENESIS_REWARD_POOL deployed at ${snowGenesisRewardPool.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsSnowGenesisRewardPool;
snowCrystalsSnowGenesisRewardPool.tags = [
  "all",
  "snowcrystals",
  "snowGenesisRewardPool",
];
