import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { IERC20Token, Snow, Glcr, SnowOracle } from "../typechain-types";
import verify from "../utils/verify";

import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsTaxOffice: DeployFunction = async function (
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
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const SNOWORACLE: SnowOracle = await ethers.getContract(
    "SnowOracle",
    deployer
  );

  log();
  log("----------------------------------------------------");
  log("Deploying TAXOFFICE and waiting for confirmations...");
  const taxOffice = await deploy("TaxOfficeV3", {
    from: deployer,
    args: [
      SNOW.address,
      GLCR.address,
      SNOWORACLE.address,
      USDC.address,
      networkConfig[network.name].router,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(taxOffice.address, [
      SNOW.address,
      GLCR.address,
      SNOWORACLE.address,
      USDC.address,
      networkConfig[network.name].router,
    ]);
  }
  log(`TAXOFFICE deployed at ${taxOffice.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsTaxOffice;
snowCrystalsTaxOffice.tags = ["all", "snowcrystals", "taxOffice"];
