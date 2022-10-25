import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IUsdc, Glcr, GlcrOracle, Treasury } from "../typechain-types";
import verify from "../utils/verify";
import addLiqudity from "../utils/addLiquidity";

import {
  networkConfig,
  developmentChains,
  deploymentChains,
  mocksDeploymentChains,
} from "../helper-hardhat-config";

import usdcABI from "../contracts/interfaces/usdc_abi.json";
import { Contract } from "ethers";

const snowCrystalsDevGlcrRebateTreasury: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const maintoken_name = "snowcrystals.finance";
  const maintoken_symbol = "SNOW";
  const bondtoken_name = "snowcrystals.finance BOND";
  const bondtoken_symbol = "SBOND";
  const sharetoken_name = "snowcrystals.finance SHARE";
  const sharetoken_symbol = "GLCR";
  const currentTimestampInSeconds = Math.round(Date.now() / 1000); // local timezone

  const utcSnowCrystalsStartTimeEpoch = Math.round(
    Date.parse("2022-10-25T00:00:00Z") / 1000
  ); // UTC; ISO8601-compliant; "Z" at the end means UTC

  const ONE_DAYS_IN_SECS = 24 * 60 * 60;
  let glcrStartTime;
  if (network.name == "cronosTestnet") {
    glcrStartTime = utcSnowCrystalsStartTimeEpoch + ONE_DAYS_IN_SECS;
  } else {
    glcrStartTime = utcSnowCrystalsStartTimeEpoch;
  }
  const glcrRewardPoolStartTime = glcrStartTime;
  const snowGenesisRewardPoolStartTime = glcrStartTime;
  const oraclePeriod = 6 * 60 * 60;
  const oracleStartTime = currentTimestampInSeconds + 600;
  const nodeStartTime = glcrStartTime + 9 * ONE_DAYS_IN_SECS;

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

  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const GLCR_ORACLE: GlcrOracle = await ethers.getContract(
    "GlcrOracle",
    deployer
  );
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  log();
  log("----------------------------------------------------");
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
  "devGlcrRebateTreasury",
];
