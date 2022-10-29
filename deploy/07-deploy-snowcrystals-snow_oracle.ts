import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IERC20Token } from "../typechain-types";
import verify from "../utils/verify";
import addLiqudity from "../utils/addLiquidity";
import utcSnowCrystalsStartTimeEpoch from "../utils/startTime";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsSnowOracle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const currentTimestampInSeconds = Math.round(Date.now() / 1000); // local timezone
  const oraclePeriod = 6 * 60 * 60; // 6 hours in seconds
  const oracleStartTime = Number(
    await utcSnowCrystalsStartTimeEpoch(network.name)
  );

  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );
  const SNOW: Snow = await ethers.getContract("Snow", deployer);

  const UsdcSnowLpAddress: string = await addLiqudity(
    USDC,
    SNOW,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("0.01") // 1 SNOW = 100 USDC
  );
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying SNOW_ORACLE and waiting for confirmations...");
  const snowOracle = await deploy("SnowOracle", {
    from: deployer,
    args: [UsdcSnowLpAddress, oraclePeriod, oracleStartTime, SNOW.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  if (
    networkConfig[network.name].contractVerfication &&
    process.env.CRONOSCAN_TESTNET_API_KEY
  ) {
    log(
      `hh verify --network ${network.name} --contract contracts/SnowOracle.sol:SnowOracle ${snowOracle.address} ${UsdcSnowLpAddress} ${oraclePeriod} ${oracleStartTime} ${SNOW.address}`
    );
    await verify(
      snowOracle.address,
      [UsdcSnowLpAddress, oraclePeriod, oracleStartTime, SNOW.address],
      "SnowOracle"
    );
  }
  log(`SNOW_ORACLE deployed at ${snowOracle.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsSnowOracle;
snowCrystalsSnowOracle.tags = ["all", "snowcrystals", "snowOracle"];
