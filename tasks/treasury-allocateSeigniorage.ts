import { ethers, getNamedAccounts } from "hardhat";
import { Treasury } from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();

  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  console.log();
  console.log("----------------------------------------------------");
  console.log("allocating seigniorage...");

  const allocateSeigniorageTransactionResponse =
    await TREASURY.allocateSeigniorage();
  allocateSeigniorageTransactionResponse.wait(1);

  console.log(`(tx: ${allocateSeigniorageTransactionResponse.hash})...`);
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
