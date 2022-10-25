import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IUsdc, Oracle, Treasury } from "../typechain-types";
import verify from "../utils/verify";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsDaoSnowRebateTreasury: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let USDC: IUsdc;
  if (mocksDeploymentChains.includes(network.name)) {
    USDC = await ethers.getContract("Mock USDC", deployer);
  } else {
    USDC = await ethers.getContractAt(
      "IUsdc",
      networkConfig[network.name].usdc!,
      deployer
    );
  }
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const TREASURY_ORACLE: Oracle = await ethers.getContract("Oracle", deployer);
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  log();
  log("----------------------------------------------------");
  log("Deploying DAO_SNOW_REBATE_TREASURY and waiting for confirmations...");
  const snowRebateTreasury = await deploy("SnowRebateTreasury", {
    from: deployer,
    args: [
      SNOW.address,
      TREASURY_ORACLE.address,
      TREASURY.address,
      USDC.address,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(snowRebateTreasury.address, [
      SNOW.address,
      TREASURY_ORACLE.address,
      TREASURY.address,
      USDC.address,
    ]);
  }
  log(`DAO_SNOW_REBATE_TREASURY deployed at ${snowRebateTreasury.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsDaoSnowRebateTreasury;
snowCrystalsDaoSnowRebateTreasury.tags = [
  "all",
  "snowcrystals",
  "daoSnowRebateTreasury",
];
