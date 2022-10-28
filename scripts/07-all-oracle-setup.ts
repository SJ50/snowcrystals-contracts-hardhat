import { ethers, getNamedAccounts } from "hardhat";
import {
  Oracle,
  SnowOracle,
  GlcrOracle,
  Treasury,
  TaxOfficeV3,
} from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();

  const ORACLE: Oracle = await ethers.getContract("Oracle", deployer);
  const SNOW_ORACLE: SnowOracle = await ethers.getContract(
    "SnowOracle",
    deployer
  );
  const GLCR_ORACLE: GlcrOracle = await ethers.getContract(
    "GlcrOracle",
    deployer
  );
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);
  const TAXOFFICE: TaxOfficeV3 = await ethers.getContract(
    "TaxOfficeV3",
    deployer
  );

  console.log(`
----------------------------------------------------`);
  console.log("updating Treasury Oracle...");
  const updateOracleTransactionResponse = await ORACLE.update();
  await updateOracleTransactionResponse.wait(1);
  console.log(`(tx: ${updateOracleTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("setting Treasury as Oracle operator...");
  const transferOperatorOracleTransactionResponse =
    await ORACLE.transferOperator(TREASURY.address);
  await transferOperatorOracleTransactionResponse.wait(1);
  console.log(`(tx: ${transferOperatorOracleTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("updating SnowOracle...");
  const updateSnowOracleTransactionResponse = await SNOW_ORACLE.update();
  await updateSnowOracleTransactionResponse.wait(1);
  console.log(`(tx: ${updateSnowOracleTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("setting TaxOffice as SnowOracle operator...");
  const transferOperatorSnowOracleTransactionResponse =
    await SNOW_ORACLE.transferOperator(TAXOFFICE.address);
  await transferOperatorSnowOracleTransactionResponse.wait(1);
  console.log(`(tx: ${transferOperatorSnowOracleTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("updating GlcrOracle...");
  const updateGlcrOracleTransactionResponse = await GLCR_ORACLE.update();
  await updateGlcrOracleTransactionResponse.wait(1);
  console.log(`(tx: ${updateGlcrOracleTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("setting TaxOffice as GlcrOracle operator...");
  const transferOperatorGlcrOracleTransactionResponse =
    await GLCR_ORACLE.transferOperator(TAXOFFICE.address);
  await transferOperatorGlcrOracleTransactionResponse.wait(1);
  console.log(`(tx: ${transferOperatorGlcrOracleTransactionResponse.hash})...`);
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
