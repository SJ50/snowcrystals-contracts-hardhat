import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsWrappedRouter: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`
----------------------------------------------------`);
  log("Deploying WRAPPED_ROUTER and waiting for confirmations...");
  const wrappedRouter = await deploy("WrappedRouter", {
    from: deployer,
    args: [networkConfig[network.name].router],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(wrappedRouter.address, [networkConfig[network.name].router]);
  }
  log(`WRAPPED_ROUTER deployed at ${wrappedRouter.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsWrappedRouter;
snowCrystalsWrappedRouter.tags = ["all", "snowcrystals", "wrappedRouter"];
