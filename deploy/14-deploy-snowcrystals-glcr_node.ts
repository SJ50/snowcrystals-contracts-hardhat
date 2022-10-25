import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { IUsdc, Glcr } from "../typechain-types";
import verify from "../utils/verify";
import utcSnowCrystalsStartTimeEpoch from "../utils/startTime";
import addLiqudity from "../utils/addLiquidity";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsGlcrNode: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const ONE_DAYS_IN_SECS = 24 * 60 * 60;
  let glcrStartTime;
  if (network.name == "cronosTestnet") {
    glcrStartTime =
      Number(await utcSnowCrystalsStartTimeEpoch(network.name)) +
      ONE_DAYS_IN_SECS;
  } else {
    glcrStartTime = Number(await utcSnowCrystalsStartTimeEpoch(network.name));
  }
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

  const UsdcGlcrLpAddress: string = await addLiqudity(
    USDC,
    GLCR,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );

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
};

export default snowCrystalsGlcrNode;
snowCrystalsGlcrNode.tags = ["all", "snowcrystals", "glcrNode"];
