import { ethers, run, network, getNamedAccounts } from "hardhat";
import {
  Treasury,
  Snow,
  SBond,
  Glcr,
  Oracle,
  Boardroom,
  TaxOfficeV3,
  SnowGenesisRewardPool,
} from "../typechain-types";
import { glcrStartTime } from "../utils/startTime";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

async function main() {
  const { deployer, dao, dev } = await getNamedAccounts();
  const DAO: string =
    developmentChains.includes(network.name) ||
    networkConfig[network.name].dao === undefined
      ? dao
      : networkConfig[network.name].dao!;

  let DEV: string =
    developmentChains.includes(network.name) ||
    networkConfig[network.name].dev === undefined
      ? dev
      : networkConfig[network.name].dev!;

  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const SBOND: SBond = await ethers.getContract("SBond", deployer);
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const ORACLE: Oracle = await ethers.getContract("Oracle", deployer);
  const BOARDROOM: Boardroom = await ethers.getContract("Boardroom", deployer);
  const ONE_DAYS_IN_SECS = 24 * 60 * 60;
  const ONE_HOUR_IN_SECS = 1 * 60 * 60;
  const TREASURY_START_TIME =
    (await glcrStartTime(network.name)) +
    ONE_DAYS_IN_SECS +
    18 * ONE_HOUR_IN_SECS;
  const TAXOFFICE: TaxOfficeV3 = await ethers.getContract(
    "TaxOfficeV3",
    deployer
  );
  const SNOW_GENESIS_REWARDPOOL: SnowGenesisRewardPool =
    await ethers.getContract("SnowGenesisRewardPool", deployer);

  console.log(`
----------------------------------------------------`);
  console.log("initializing Treasury...");
  const initializeTransactionResponse = await TREASURY.initialize(
    SNOW.address,
    SBOND.address,
    GLCR.address,
    ORACLE.address,
    BOARDROOM.address,
    TREASURY_START_TIME,
    TAXOFFICE.address,
    [SNOW_GENESIS_REWARDPOOL.address]
  );
  await initializeTransactionResponse.wait(1);
  console.log(`(tx: ${initializeTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("set Funding to DAO and DEV..");
  const setExtraFundsTransactionResponse = await TREASURY.setExtraFunds(
    DAO,
    3000,
    DEV,
    800
  );
  await setExtraFundsTransactionResponse.wait(1);
  console.log(`(tx: ${setExtraFundsTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("setting TREASURY as $SNOW operator...");
  const setMintingFactorForPayingDebtTransactionResponse =
    await TREASURY.setMintingFactorForPayingDebt(15000);
  await setMintingFactorForPayingDebtTransactionResponse.wait(1);
  console.log(
    `(tx: ${setMintingFactorForPayingDebtTransactionResponse.hash})...`
  );
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
