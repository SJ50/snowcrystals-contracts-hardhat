import { ethers, getNamedAccounts, network } from "hardhat";
import {
  GlcrRewardPool,
  Snow,
  Glcr,
  SBond,
  IERC20Token,
} from "../typechain-types";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";
import addLiqudity from "../utils/addLiquidity";

async function main() {
  const { deployer } = await getNamedAccounts();

  const GLCR_REWARDPOOL: GlcrRewardPool = await ethers.getContract(
    "GlcrRewardPool",
    deployer
  );
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const SBOND: SBond = await ethers.getContract("SBond", deployer);
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdt!,
        deployer
      );
  const USDC_SNOW_LP_ADDRESS: string = await addLiqudity(
    USDC,
    SNOW,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("0.01") // 1 SNOW = 100 USDC
  );
  const USDC_GLCR_LP_ADDRESS: string = await addLiqudity(
    USDC,
    GLCR,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("0.0001") // 1 GLCR = 10000 USDC
  );

  console.log(`
----------------------------------------------------`);
  console.log("adding $SBOND to GlcrRewardPool...");
  const addSbondTransactionResponse = await GLCR_REWARDPOOL.add(
    0,
    SBOND.address,
    false,
    0
  );
  await addSbondTransactionResponse.wait(1);
  console.log(`(tx: ${addSbondTransactionResponse.hash})...`);
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
