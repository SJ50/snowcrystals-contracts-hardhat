import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsTreasury: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`
----------------------------------------------------`);
  log("Deploying TREASURY and waiting for confirmations...");
  const treasury = await deploy("Treasury", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(treasury.address, []);
  }
  log(`TREASURY deployed at ${treasury.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsTreasury;
snowCrystalsTreasury.tags = ["all", "snowcrystals", "treasury"];
