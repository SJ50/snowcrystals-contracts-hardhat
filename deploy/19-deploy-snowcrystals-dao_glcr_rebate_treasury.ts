import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { IERC20Token, Glcr, GlcrOracle, Treasury } from "../typechain-types";
import verify from "../utils/verify";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsDaoGlcrRebateTreasury: DeployFunction = async function (
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
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const GLCR_ORACLE: GlcrOracle = await ethers.getContract(
    "GlcrOracle",
    deployer
  );
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  log(`
----------------------------------------------------`);
  log("Deploying DAO_GLCR_REBATE_TREASURY and waiting for confirmations...");
  const glcrRebateTreasury = await deploy("GlcrRebateTreasury", {
    from: deployer,
    args: [GLCR.address, GLCR_ORACLE.address, TREASURY.address, USDC.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcrRebateTreasury.address, [
      GLCR.address,
      GLCR_ORACLE.address,
      TREASURY.address,
      USDC.address,
    ]);
  }
  log(`DAO_GLCR_REBATE_TREASURY deployed at ${glcrRebateTreasury.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsDaoGlcrRebateTreasury;
snowCrystalsDaoGlcrRebateTreasury.tags = [
  "all",
  "snowcrystals",
  "daoGlcrRebateTreasury",
];
