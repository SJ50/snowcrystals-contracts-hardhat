import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { IERC20Token } from "../typechain-types";
import verify from "../utils/verify";

import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsZap: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying ZAP and waiting for confirmations...");
  const zap = await deploy("Zap", {
    from: deployer,
    args: [USDC.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(zap.address, [USDC.address]);
  }
  log(`ZAP deployed at ${zap.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsZap;
snowCrystalsZap.tags = ["all", "snowcrystals", "zap"];
