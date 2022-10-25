import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IUsdc } from "../typechain-types";
import verify from "../utils/verify";
import { glcrStartTime } from "../utils/startTime";
import addLiqudity from "../utils/addLiquidity";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsSnowNode: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const ONE_DAYS_IN_SECS = 24 * 60 * 60;
  const nodeStartTime =
    (await glcrStartTime(network.name)) + 9 * ONE_DAYS_IN_SECS;

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

  const UsdcSnowLpAddress: string = await addLiqudity(
    USDC,
    SNOW,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );

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
};

export default snowCrystalsSnowNode;
snowCrystalsSnowNode.tags = ["all", "snowcrystals", "snowNode"];
