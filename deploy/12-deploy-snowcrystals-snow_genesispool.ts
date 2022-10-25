import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IUsdc } from "../typechain-types";
import verify from "../utils/verify";
import utcSnowCrystalsStartTimeEpoch from "../utils/startTime";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsSnowGenesisRewardPool: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const ONE_DAYS_IN_SECS = 24 * 60 * 60;
  let glcrStartTime;
  if (network.name == "cronosTestnet") {
    glcrStartTime =
      Number(await utcSnowCrystalsStartTimeEpoch(network.name)) +
      ONE_DAYS_IN_SECS;
  } else {
    glcrStartTime = Number(await utcSnowCrystalsStartTimeEpoch(network.name));
  }
  const snowGenesisRewardPoolStartTime = glcrStartTime;

  let USDC: IUsdc;
  if (mocksDeploymentChains.includes(network.name)) {
    USDC = await ethers.getContract("Mock USDC", deployer);
  } else {
    USDC = await ethers.getContractAt(
      "IUsdc",
      networkConfig[network.name].usdc!,
      deployer
    );
  }
  const SNOW: Snow = await ethers.getContract("Snow", deployer);

  log();
  log("----------------------------------------------------");
  log("Deploying SNOW_GENESIS_REWARD_POOL and waiting for confirmations...");
  const snowGenesisRewardPool = await deploy("SnowGenesisRewardPool", {
    from: deployer,
    args: [
      SNOW.address,
      snowGenesisRewardPoolStartTime,
      networkConfig[network.name].dao,
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
      networkConfig[network.name].dao,
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
