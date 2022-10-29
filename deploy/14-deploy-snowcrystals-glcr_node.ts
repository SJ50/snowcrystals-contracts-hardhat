import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { IERC20Token, Glcr } from "../typechain-types";
import verify from "../utils/verify";
import { glcrStartTime } from "../utils/startTime";
import addLiqudity from "../utils/addLiquidity";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsGlcrNode: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const ONE_DAYS_IN_SECS = 24 * 60 * 60;

  const nodeStartTime =
    (await glcrStartTime(network.name)) + 9 * ONE_DAYS_IN_SECS;

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
    ethers.utils.parseEther("0.0001") // 1 GLCR = 10000 USDC
  );
  if (
    Date.parse(networkConfig[network.name].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    throw new Error("check dappStartTime in helper-hardhat-config");
  }
  log(`
----------------------------------------------------`);
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
    log(
      `hh verify --network ${network.name} --contract contracts/SnowNode.sol:SnowNode ${glcrNode.address} ${nodeStartTime} ${UsdcGlcrLpAddress}`
    );
    await verify(
      glcrNode.address,
      [nodeStartTime, UsdcGlcrLpAddress],
      "GlcrNode"
    );
  }
  log(`GLCR_NODE deployed at ${glcrNode.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsGlcrNode;
snowCrystalsGlcrNode.tags = ["all", "snowcrystals", "glcrNode"];
