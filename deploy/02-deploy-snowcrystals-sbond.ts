import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsSbond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const bondtoken_name = "snowcrystals.finance BOND";
  const bondtoken_symbol = "SBOND";

  log(`
----------------------------------------------------`);
  log("Deploying $SBOND and waiting for confirmations...");
  const sBond = await deploy("SBond", {
    from: deployer,
    args: [bondtoken_name, bondtoken_symbol],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(sBond.address, [bondtoken_name, bondtoken_symbol]);
  }
  log(`$SBOND deployed at ${sBond.address}`);
  log("----------------------------------------------------");
};
export default snowCrystalsSbond;
snowCrystalsSbond.tags = ["all", "snowcrystals", "sbond"];
