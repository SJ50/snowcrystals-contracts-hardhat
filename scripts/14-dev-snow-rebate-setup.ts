import { ethers, getNamedAccounts, network } from "hardhat";
import {
  DevSnowRebateTreasury,
  IERC20Token,
  UsdcOracle,
} from "../typechain-types";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

async function main() {
  const { deployer } = await getNamedAccounts();

  const DEV_SNOW_REBATE_TREASURY: DevSnowRebateTreasury =
    await ethers.getContract("DevSnowRebateTreasury", deployer);
  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );
  const USDC_ORACLE: UsdcOracle = await ethers.getContract(
    "UsdcOracle",
    deployer
  );

  console.log(`
----------------------------------------------------`);
  console.log("setting $USDC as asset in DevSnowRebateTreasury...");
  const setAssetTransactionResponse = await DEV_SNOW_REBATE_TREASURY.setAsset(
    USDC.address,
    true,
    1100000,
    USDC_ORACLE.address,
    false,
    "0x0000000000000000000000000000000000000000"
  );
  await setAssetTransactionResponse.wait(1);
  console.log(`(tx: ${setAssetTransactionResponse.hash})...`);
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
