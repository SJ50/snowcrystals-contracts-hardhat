import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  Snow,
  IERC20Token,
  SeigniorageOracle,
  Treasury,
} from "../typechain-types";
import verify from "../utils/verify";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsDaoSnowRebateTreasury: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const SEIGNIORAGE_ORACLE: SeigniorageOracle = await ethers.getContract(
    "SeigniorageOracle",
    deployer
  );
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying DAO_SNOW_REBATE_TREASURY and waiting for confirmations...");
  const snowRebateTreasury = await deploy("SnowRebateTreasury", {
    from: deployer,
    args: [
      SNOW.address,
      SEIGNIORAGE_ORACLE.address,
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
      SEIGNIORAGE_ORACLE.address,
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
