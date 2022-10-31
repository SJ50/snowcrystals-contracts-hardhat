import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import dappStartTime from "../utils/startTime";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

const snowCrystalsGlcr: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, dao, dev } = await getNamedAccounts();

  const sharetoken_name = "snowcrystals.finance SHARE";
  const sharetoken_symbol = "GLCR";

  const DAO: string =
    developmentChains.includes(network.name) ||
    networkConfig[network.name].dao === undefined
      ? dao
      : networkConfig[network.name].dao!;

  let DEV: string =
    developmentChains.includes(network.name) ||
    networkConfig[network.name].dev === undefined
      ? dev
      : networkConfig[network.name].dev!;

  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying $GLCR and waiting for confirmations...");

  const glcr = await deploy("Glcr", {
    from: deployer,
    args: [
      sharetoken_name,
      sharetoken_symbol,
      await dappStartTime(network.name),
      DAO,
      DEV,
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
      await dappStartTime(network.name),
      DAO,
      DEV,
    ]);
  }
  log(`$GLCR deployed at ${glcr.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsGlcr;
snowCrystalsGlcr.tags = ["all", "snowcrystals", "glcr"];
