import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IUsdc, Glcr } from "../typechain-types";
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

const snowCrystalsUsdcOracle: DeployFunction = async function (
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

  log();
  log("----------------------------------------------------");
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
