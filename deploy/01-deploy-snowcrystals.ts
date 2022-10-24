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

const snowCrystals: DeployFunction = async function (
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
  log("Deploying $SNOW and waiting for confirmations...");
  const snow = await deploy("Snow", {
    from: deployer,
    args: [maintoken_name, maintoken_symbol],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(snow.address, [maintoken_name, maintoken_symbol]);
  }
  log(`$SNOW deployed at ${snow.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
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

  log();
  log("----------------------------------------------------");
  log("Deploying $GLCR and waiting for confirmations...");
  log(network.name);
  const glcr = await deploy("Glcr", {
    from: deployer,
    args: [
      sharetoken_name,
      sharetoken_symbol,
      glcrStartTime,
      networkConfig[network.name].dao,
      networkConfig[network.name].dev,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcr.address, [
      sharetoken_name,
      sharetoken_symbol,
      glcrStartTime,
      networkConfig[network.name].dao,
      networkConfig[network.name].dev,
    ]);
  }
  log(`$GLCR deployed at ${glcr.address}`);
  log("----------------------------------------------------");

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
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);

  const UsdcSnowLpAddress: string = await addLiqudity(
    USDC,
    SNOW,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );

  const UsdcGlcrLpAddress: string = await addLiqudity(
    USDC,
    GLCR,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );

  log();
  log("----------------------------------------------------");
  log("Deploying TREASURY_ORACLE and waiting for confirmations...");
  const treasuryOracle = await deploy("Oracle", {
    from: deployer,
    args: [UsdcSnowLpAddress, oraclePeriod, oracleStartTime, snow.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(treasuryOracle.address, [
      UsdcSnowLpAddress,
      oraclePeriod,
      oracleStartTime,
      snow.address,
    ]);
  }
  log(`TREASURY_ORACLE deployed at ${treasuryOracle.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying SNOW_ORACLE and waiting for confirmations...");
  const snowOracle = await deploy("SnowOracle", {
    from: deployer,
    args: [UsdcSnowLpAddress, oraclePeriod, oracleStartTime, snow.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(snowOracle.address, [
      UsdcSnowLpAddress,
      oraclePeriod,
      oracleStartTime,
      snow.address,
    ]);
  }
  log(`SNOW_ORACLE deployed at ${snowOracle.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying GLCR_ORACLE and waiting for confirmations...");
  const glcrOracle = await deploy("GlcrOracle", {
    from: deployer,
    args: [UsdcGlcrLpAddress, oraclePeriod, oracleStartTime, glcr.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcrOracle.address, [
      UsdcGlcrLpAddress,
      oraclePeriod,
      oracleStartTime,
      glcr.address,
    ]);
  }
  log(`GLCR_ORACLE deployed at ${glcrOracle.address}`);
  log("----------------------------------------------------");

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

  log();
  log("----------------------------------------------------");
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

  log();
  log("----------------------------------------------------");
  log("Deploying GLCR_REWARD_POOL and waiting for confirmations...");
  const glcrRewardPool = await deploy("GlcrRewardPool", {
    from: deployer,
    args: [
      glcr.address,
      networkConfig[network.name].dao,
      glcrRewardPoolStartTime,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcrRewardPool.address, [
      glcr.address,
      networkConfig[network.name].dao,
      glcrRewardPoolStartTime,
    ]);
  }
  log(`GLCR_REWARD_POOL deployed at ${glcrRewardPool.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying SNOW_GENESIS_REWARD_POOL and waiting for confirmations...");
  const snowGenesisRewardPool = await deploy("SnowGenesisRewardPool", {
    from: deployer,
    args: [
      snow.address,
      snowGenesisRewardPoolStartTime,
      networkConfig[network.name].dao,
      120,
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
    await verify(snowGenesisRewardPool.address, [
      snow.address,
      snowGenesisRewardPoolStartTime,
      networkConfig[network.name].dao,
      120,
      USDC.address,
    ]);
  }
  log(`SNOW_GENESIS_REWARD_POOL deployed at ${snowGenesisRewardPool.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying SNOW_NODE and waiting for confirmations...");
  const snowNode = await deploy("SnowNode", {
    from: deployer,
    args: [nodeStartTime, UsdcSnowLpAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(snowNode.address, [nodeStartTime, UsdcSnowLpAddress]);
  }
  log(`SNOW_NODE deployed at ${snowNode.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying GLCR_NODE and waiting for confirmations...");
  const glcrNode = await deploy("GlcrNode", {
    from: deployer,
    args: [nodeStartTime, UsdcGlcrLpAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcrNode.address, [nodeStartTime, UsdcGlcrLpAddress]);
  }
  log(`GLCR_NODE deployed at ${glcrNode.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying TAXOFFICE and waiting for confirmations...");
  const taxOffice = await deploy("TaxOfficeV3", {
    from: deployer,
    args: [
      snow.address,
      glcr.address,
      snowOracle.address,
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
      snow.address,
      glcr.address,
      snowOracle.address,
      USDC.address,
      networkConfig[network.name].router,
    ]);
  }
  log(`TAXOFFICE deployed at ${taxOffice.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying WRAPPED_ROUTER and waiting for confirmations...");
  const wrappedRouter = await deploy("WrappedRouter", {
    from: deployer,
    args: [networkConfig[network.name].router],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(wrappedRouter.address, [networkConfig[network.name].router]);
  }
  log(`WRAPPED_ROUTER deployed at ${wrappedRouter.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying ZAP and waiting for confirmations...");
  const zap = await deploy("Zap", {
    from: deployer,
    args: [USDC.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(zap.address, [USDC.address]);
  }
  log(`ZAP deployed at ${zap.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying SNOW_REBATE_TREASURY and waiting for confirmations...");
  const snowRebateTreasury = await deploy("SnowRebateTreasury", {
    from: deployer,
    args: [
      snow.address,
      treasuryOracle.address,
      treasury.address,
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
      snow.address,
      treasuryOracle.address,
      treasury.address,
      USDC.address,
    ]);
  }
  log(`SNOW_REBATE_TREASURY deployed at ${snowRebateTreasury.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying GLCR_REBATE_TREASURY and waiting for confirmations...");
  const glcrRebateTreasury = await deploy("GlcrRebateTreasury", {
    from: deployer,
    args: [glcr.address, glcrOracle.address, treasury.address, USDC.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(glcrRebateTreasury.address, [
      glcr.address,
      glcrOracle.address,
      treasury.address,
      USDC.address,
    ]);
  }
  log(`GLCR_REBATE_TREASURY deployed at ${glcrRebateTreasury.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying DEV_SNOW_REBATE_TREASURY and waiting for confirmations...");
  const devSnowRebateTreasury = await deploy("DevSnowRebateTreasury", {
    from: deployer,
    args: [
      snow.address,
      treasuryOracle.address,
      treasury.address,
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
    await verify(devSnowRebateTreasury.address, [
      snow.address,
      treasuryOracle.address,
      treasury.address,
      USDC.address,
    ]);
  }
  log(`DEV_SNOW_REBATE_TREASURY deployed at ${devSnowRebateTreasury.address}`);
  log("----------------------------------------------------");

  log();
  log("----------------------------------------------------");
  log("Deploying DEV_GLCR_REBATE_TREASURY and waiting for confirmations...");
  const devGlcrRebateTreasury = await deploy("DevGlcrRebateTreasury", {
    from: deployer,
    args: [glcr.address, glcrOracle.address, treasury.address, USDC.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    await verify(devGlcrRebateTreasury.address, [
      glcr.address,
      glcrOracle.address,
      treasury.address,
      USDC.address,
    ]);
  }
  log(`DEV_GLCR_REBATE_TREASURY deployed at ${devGlcrRebateTreasury.address}`);
  log("----------------------------------------------------");
};

export default snowCrystals;
snowCrystals.tags = ["all", "snowCrystals"];
