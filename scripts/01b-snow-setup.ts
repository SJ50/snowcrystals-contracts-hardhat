import { ethers, network, getNamedAccounts } from "hardhat";
import {
  Snow,
  TaxOfficeV3,
  SnowGenesisRewardPool,
  Treasury,
} from "../typechain-types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

async function main() {
  const { deployer, dao } = await getNamedAccounts();
  const DAO: string =
    developmentChains.includes(network.name) ||
    networkConfig[network.name].dao === undefined
      ? dao
      : networkConfig[network.name].dao!;

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
  console.log("funding $SNOW genesispool...");
  const distributeRewardTransactionResponse = await SNOW.distributeReward(
    SNOW_GENESIS_REWARDPOOL.address,
    DAO
  );
  await distributeRewardTransactionResponse.wait(1);
  console.log(`(tx: ${distributeRewardTransactionResponse.hash})...`);
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
