import { ethers, getNamedAccounts } from "hardhat";
import {
  Glcr,
  TaxOfficeV3,
  GlcrRewardPool,
  Treasury,
} from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();

  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const TAXOFFICE: TaxOfficeV3 = await ethers.getContract(
    "TaxOfficeV3",
    deployer
  );
  const GLCR_REWARDPOOL: GlcrRewardPool = await ethers.getContract(
    "GlcrRewardPool",
    deployer
  );
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  console.log(`
----------------------------------------------------`);
  console.log("setting TREASURY as $GLCR operator...");
  const transferOperatorTransactionResponse = await GLCR.transferOperator(
    TREASURY.address
  );
  await transferOperatorTransactionResponse.wait(1);
  console.log(`(tx: ${transferOperatorTransactionResponse.hash})...`);
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
