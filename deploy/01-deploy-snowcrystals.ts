import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

const snowCrystals: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const maintoken_name = "snowcrystals.finance";
  const maintoken_symbol = "SNOW";
  const SBondbondtoken_name = "snowcrystals.finance BOND";
  const bondtoken_symbol = "SBOND";
  const sharetoken_name = "snowcrystals.finance SHARE";
  const sharetoken_symbol = "GLCR";

  // let ethUsdPriceFeedAddress: string;
  // if (developmentChains.includes(network.name)) {
  //   const ethUsdAggregator = await deployments.get("MockV3Aggregator");
  //   ethUsdPriceFeedAddress = ethUsdAggregator.address;
  // } else {
  //   ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed!;
  // }
  log("----------------------------------------------------");
  log("Deploying $SNOW and waiting for confirmations...");
  const snow = await deploy("Snow", {
    from: deployer,
    args: [maintoken_name, maintoken_symbol],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  log(`$SNOW deployed at ${snow.address}`);
  log("----------------------------------------------------");
  // log(process.env.ETHERSCAN_API_KEY);
  // if (
  //   !developmentChains.includes(network.name) &&
  //   process.env.CRONOSCAN_TESTNET_API_KEY
  // ) {
  //   await verify(snow.address, [maintoken_name, maintoken_symbol]);
  // }
};
export default snowCrystals;
snowCrystals.tags = ["all", "snowCrystals"];
