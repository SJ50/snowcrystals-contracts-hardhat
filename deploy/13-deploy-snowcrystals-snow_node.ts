import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IERC20Token } from "../typechain-types";
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
    log(
      `hh verify --network ${network.name} --contract contracts/SnowNode.sol:SnowNode ${snowNode.address} ${nodeStartTime} ${UsdcSnowLpAddress}`
    );
    await verify(
      snowNode.address,
      [nodeStartTime, UsdcSnowLpAddress],
      "SnowNode"
    );
  }
  log(`SNOW_NODE deployed at ${snowNode.address}`);
  log("----------------------------------------------------");
};

export default snowCrystalsSnowNode;
snowCrystalsSnowNode.tags = ["all", "snowcrystals", "snow_node"];
