import { ethers, getNamedAccounts } from "hardhat";
import { SBond, Treasury } from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();

  const SBOND: SBond = await ethers.getContract("SBond", deployer);
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  console.log(`
----------------------------------------------------`);
  console.log("setting TREASURY as $SBOND operator...");
  const transferOperatorTransactionResponse = await SBOND.transferOperator(
    TREASURY.address
  );
  await transferOperatorTransactionResponse.wait(1);
  console.log(`(tx: ${transferOperatorTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("renounce ownership of $SBOND...");
  const renounceOwnershipTransactionResponse = await SBOND.renounceOwnership();
  await renounceOwnershipTransactionResponse.wait(1);
  console.log(`(tx: ${renounceOwnershipTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  // console.log(
  //   ethers.utils.formatUnits(
  //     await SBOND.balanceOf(deployer),
  //     await SBOND.decimals()
  //   )
  // );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
