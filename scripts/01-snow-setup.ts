import { ethers, run, network, getNamedAccounts } from "hardhat";
import {
  Snow,
  TaxOfficeV3,
  SnowGenesisRewardPool,
  Treasury,
} from "../typechain-types";
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

  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const TAXOFFICE: TaxOfficeV3 = await ethers.getContract(
    "TaxOfficeV3",
    deployer
  );
  const SNOW_GENESIS_REWARDPOOL: SnowGenesisRewardPool =
    await ethers.getContract("SnowGenesisRewardPool", deployer);
  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  console.log(`
----------------------------------------------------`);
  console.log("setting taxoffice for $SNOW...");
  const setTaxOfficeTransactionResponse = await SNOW.setTaxOffice(
    TAXOFFICE.address
  );
  await setTaxOfficeTransactionResponse.wait(1);
  console.log(`(tx: ${setTaxOfficeTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("funding $SNOW genesispool...");
  const distributeRewardTransactionResponse = await SNOW.distributeReward(
    SNOW_GENESIS_REWARDPOOL.address,
    DAO
  );
  await distributeRewardTransactionResponse.wait(1);
  console.log(`(tx: ${distributeRewardTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("setting TREASURY as $SNOW operator...");
  const transferOperatorTransactionResponse = await SNOW.transferOperator(
    TREASURY.address
  );
  await transferOperatorTransactionResponse.wait(1);
  console.log(`(tx: ${transferOperatorTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("renounce ownership of $SNOW...");
  const renounceOwnershipTransactionResponse = await SNOW.renounceOwnership();
  await renounceOwnershipTransactionResponse.wait(1);
  console.log(`(tx: ${renounceOwnershipTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");
  // console.log(
  //   ethers.utils.formatUnits(
  //     await SNOW.balanceOf(deployer),
  //     await SNOW.decimals()
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
