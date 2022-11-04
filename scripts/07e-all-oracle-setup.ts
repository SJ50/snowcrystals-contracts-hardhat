import { ethers, getNamedAccounts } from "hardhat";
import {
  SeigniorageOracle,
  SnowOracle,
  GlcrOracle,
  Treasury,
  TaxOfficeV3,
} from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();

  const SEIGNIORAGE_ORACLE: SeigniorageOracle = await ethers.getContract(
    "SeigniorageOracle",
    deployer
  );
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
  console.log("updating GlcrOracle...");
  const updateGlcrOracleTransactionResponse = await GLCR_ORACLE.update();
  await updateGlcrOracleTransactionResponse.wait(1);
  console.log(`(tx: ${updateGlcrOracleTransactionResponse.hash})...`);
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
