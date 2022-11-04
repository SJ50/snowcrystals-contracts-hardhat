import { ethers, getNamedAccounts, network } from "hardhat";
import { SnowGenesisRewardPool, IERC20Token } from "../typechain-types";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

async function main() {
  const { deployer } = await getNamedAccounts();

  const SNOW_GENESIS_REWARDPOOL: SnowGenesisRewardPool =
    await ethers.getContract("SnowGenesisRewardPool", deployer);
  const WBTC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock WBTC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].wbtc!,
        deployer
      );
  const WCRO: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock WCRO", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].wcro!,
        deployer
      );
  const WETH: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock WETH", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].weth!,
        deployer
      );
  const DAI: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock Dai", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].dai!,
        deployer
      );
  const USDT: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDT", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdt!,
        deployer
      );

  console.log(`
----------------------------------------------------`);
  console.log("adding DAI to genesispool...");
  const addDaiTransactionResponse = await SNOW_GENESIS_REWARDPOOL.add(
    2400,
    DAI.address,
    false,
    0
  );
  await addDaiTransactionResponse.wait(1);
  console.log(`(tx: ${addDaiTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
