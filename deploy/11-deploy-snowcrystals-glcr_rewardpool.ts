import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Glcr } from "../typechain-types";
import verify from "../utils/verify";
import { glcrStartTime } from "../utils/startTime";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsGlcrRewardPool: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const glcrRewardPoolStartTime = await glcrStartTime(network.name);

  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);

  log();
  log("----------------------------------------------------");
  log("Deploying GLCR_REWARD_POOL and waiting for confirmations...");
  const glcrRewardPool = await deploy("GlcrRewardPool", {
    from: deployer,
    args: [
      GLCR.address,
      networkConfig[network.name].dao,
      glcrRewardPoolStartTime,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcrRewardPool.address, [
      GLCR.address,
      networkConfig[network.name].dao,
      glcrRewardPoolStartTime,
    ]);
  }
  log(`GLCR_REWARD_POOL deployed at ${glcrRewardPool.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsGlcrRewardPool;
snowCrystalsGlcrRewardPool.tags = ["all", "snowcrystals", "glcrRewardPool"];
