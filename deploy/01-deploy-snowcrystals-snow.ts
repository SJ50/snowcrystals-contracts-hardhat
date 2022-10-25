import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsSnow: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const maintoken_name = "snowcrystals.finance";
  const maintoken_symbol = "SNOW";

  log();
  log("----------------------------------------------------");
  log("Deploying $SNOW and waiting for confirmations...");
  const snow = await deploy("Snow", {
    from: deployer,
    args: [maintoken_name, maintoken_symbol],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(snow.address, [maintoken_name, maintoken_symbol]);
  }
  log(`$SNOW deployed at ${snow.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsSnow;
snowCrystalsSnow.tags = ["all", "snowcrystals", "snow"];
