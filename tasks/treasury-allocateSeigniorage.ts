// import { ethers, getNamedAccounts } from "hardhat";
import { task } from "hardhat/config";
import { Treasury } from "../typechain-types";

export default task(
  "allocateSeigniorage",
  "allocates seigniorage to boardroom"
).setAction(async (_taskArgs, hre) => {
  const { getNamedAccounts, run } = hre;
  const { deployer } = await getNamedAccounts();

  const TREASURY: Treasury = await hre.ethers.getContract("Treasury", deployer);

  console.log();
  console.log("----------------------------------------------------");
  console.log("allocating seigniorage...");

  const allocateSeigniorageTransactionResponse =
    await TREASURY.allocateSeigniorage();
  allocateSeigniorageTransactionResponse.wait(1);

  console.log(`(tx: ${allocateSeigniorageTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");
});

// export default task(
//   "block-number",
//   "Prints the current block number"
// ).setAction(async (_taskArgs, hre) => {
//   await hre.ethers.provider.getBlockNumber().then((blockNumber: number) => {
//     console.log(`Current block number: ${blockNumber}`);
//   });
// });
