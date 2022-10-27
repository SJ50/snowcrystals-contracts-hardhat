import { ethers, getNamedAccounts } from "hardhat";
import { Boardroom, Snow, Glcr, Treasury } from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();

  const BOARDROOM: Boardroom = await ethers.getContract("Boardroom", deployer);
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  console.log(`
----------------------------------------------------`);
  console.log("Initializing Boardroom...");

  const initializinTransactionResponse = await BOARDROOM.initialize(
    SNOW.address,
    GLCR.address,
    TREASURY.address
  );
  initializinTransactionResponse.wait(1);
  console.log(`(tx: ${initializinTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("set Treasury as Boardroom operator...");

  const setOperatorTransactionResponse = await BOARDROOM.setOperator(
    TREASURY.address
  );
  setOperatorTransactionResponse.wait(1);

  console.log(`(tx: ${setOperatorTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("Manually Approve and Deposit 1 $GLCR from DAO..");
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
