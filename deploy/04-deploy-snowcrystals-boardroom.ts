import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig } from "../helper-hardhat-config";

const snowCrystalsBoardroom: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log();
  log("----------------------------------------------------");
  log("Deploying BOARDROOM and waiting for confirmations...");
  const boardRoom = await deploy("Boardroom", {
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
    await verify(boardRoom.address, []);
  }
  log(`BOARDROOM deployed at ${boardRoom.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsBoardroom;
snowCrystalsBoardroom.tags = ["all", "snowcrystals", "boardroom"];
