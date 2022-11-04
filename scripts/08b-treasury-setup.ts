import { ethers, run, network, getNamedAccounts } from "hardhat";
import {
  Treasury,
  Snow,
  SBond,
  Glcr,
  SeigniorageOracle,
  Boardroom,
  SnowGenesisRewardPool,
} from "../typechain-types";
import dappStartTime from "../utils/startTime";
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
  const SEIGNIORAGE_ORACLE: SeigniorageOracle = await ethers.getContract(
    "SeigniorageOracle",
    deployer
  );
  const BOARDROOM: Boardroom = await ethers.getContract("Boardroom", deployer);
  const ONE_HOUR_IN_SECS = 1 * 60 * 60;
  const TREASURY_START_TIME =
    Number(await dappStartTime(network.name)) + (24 + 18) * ONE_HOUR_IN_SECS;

  const SNOW_GENESIS_REWARDPOOL: SnowGenesisRewardPool =
    await ethers.getContract("SnowGenesisRewardPool", deployer);

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
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
