import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { mocksDeploymentChains } from "../helper-hardhat-config";

const deployMocks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // If we are on a local development network, we need to deploy mocks!
  if (mocksDeploymentChains.includes(network.name)) {
    log(`
----------------------------------------------------`);
    log("Local network detected! Deploying mocks...");
    await deploy("Mock USDC", {
      contract: "MockUsdc",
      from: deployer,
      log: true,
    });
    await deploy("Mock WBTC", {
      contract: "MockWbtc",
      from: deployer,
      log: true,
    });
    await deploy("Mock WCRO", {
      contract: "MockWcro",
      from: deployer,
      log: true,
    });
    await deploy("Mock Dai", {
      contract: "MockDai",
      from: deployer,
      log: true,
    });
    await deploy("Mock WETH", {
      contract: "MockWeth",
      from: deployer,
      log: true,
    });
    await deploy("Mock USDT", {
      contract: "MockUsdt",
      from: deployer,
      log: true,
    });
    log("Mocks Deployed!");
    log("----------------------------------------------------");
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    );
    log(
      "Please run `yarn hardhat console` to interact with the deployed smart contracts!"
    );
    log("----------------------------------------------------");
  }
};
export default deployMocks;
deployMocks.tags = ["all", "mocks"];
