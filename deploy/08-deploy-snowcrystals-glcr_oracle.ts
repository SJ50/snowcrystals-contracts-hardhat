import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { IERC20Token, Glcr } from "../typechain-types";
import verify from "../utils/verify";
import addLiqudity from "../utils/addLiquidity";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsGlcrOracle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const currentTimestampInSeconds = Math.round(Date.now() / 1000); // local timezone
  const oraclePeriod = 6 * 60 * 60;
  const oracleStartTime = currentTimestampInSeconds + 600;

  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);

  const UsdcGlcrLpAddress: string = await addLiqudity(
    USDC,
    GLCR,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
  log("Deploying GLCR_ORACLE and waiting for confirmations...");
  const glcrOracle = await deploy("GlcrOracle", {
    from: deployer,
    args: [UsdcGlcrLpAddress, oraclePeriod, oracleStartTime, GLCR.address],
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
      GLCR.address,
    ]);
  }
  log(`GLCR_ORACLE deployed at ${glcrOracle.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsGlcrOracle;
snowCrystalsGlcrOracle.tags = ["all", "snowcrystals", "glcrOracle"];
