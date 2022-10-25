import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import utcSnowCrystalsStartTimeEpoch from "../utils/startTime";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsGlcr: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const sharetoken_name = "snowcrystals.finance SHARE";
  const sharetoken_symbol = "GLCR";

  const ONE_DAYS_IN_SECS = 24 * 60 * 60;
  let glcrStartTime;
  if (network.name == "cronosTestnet") {
    glcrStartTime =
      Number(await utcSnowCrystalsStartTimeEpoch(network.name)) +
      ONE_DAYS_IN_SECS;
  } else {
    glcrStartTime = Number(await utcSnowCrystalsStartTimeEpoch(network.name));
  }

  log();
  log("----------------------------------------------------");
  log("Deploying $GLCR and waiting for confirmations...");
  log(network.name);
  const glcr = await deploy("Glcr", {
    from: deployer,
    args: [
      sharetoken_name,
      sharetoken_symbol,
      glcrStartTime,
      networkConfig[network.name].dao,
      networkConfig[network.name].dev,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcr.address, [
      sharetoken_name,
      sharetoken_symbol,
      glcrStartTime,
      networkConfig[network.name].dao,
      networkConfig[network.name].dev,
    ]);
  }
  log(`$GLCR deployed at ${glcr.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsGlcr;
snowCrystalsGlcr.tags = ["all", "snowcrystals", "glcr"];
