import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsUsdcOracle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying USDC_ORACLE and waiting for confirmations...");
  const usdcOracle = await deploy("UsdcOracle", {
    from: deployer,
    args: [networkConfig[network.name].bandDatafeedRef],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(usdcOracle.address, [
      networkConfig[network.name].bandDatafeedRef,
    ]);
  }
  log(`USDC_ORACLE deployed at ${usdcOracle.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsUsdcOracle;
snowCrystalsUsdcOracle.tags = ["all", "snowcrystals", "usdcOracle"];
