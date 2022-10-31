import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { IERC20Token, Glcr, GlcrOracle, Treasury } from "../typechain-types";
import verify from "../utils/verify";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsDevGlcrRebateTreasury: DeployFunction = async function (
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
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying DEV_GLCR_REBATE_TREASURY and waiting for confirmations...");
  const glcrRebateTreasury = await deploy("DevGlcrRebateTreasury", {
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
  log(`DEV_GLCR_REBATE_TREASURY deployed at ${glcrRebateTreasury.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsDevGlcrRebateTreasury;
snowCrystalsDevGlcrRebateTreasury.tags = [
  "all",
  "snowcrystals",
  "dev_glcr_rebate_treasury",
];
