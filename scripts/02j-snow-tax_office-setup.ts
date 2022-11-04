import { ethers, network, getNamedAccounts } from "hardhat";
import {
  IERC20Token,
  Snow,
  TaxOfficeV3,
  Boardroom,
  Zap,
  WrappedRouter,
  SnowRebateTreasury,
  DevSnowRebateTreasury,
  Treasury,
} from "../typechain-types";
import {
  networkConfig,
  developmentChains,
  mocksDeploymentChains,
} from "../helper-hardhat-config";
import addLiqudity from "../utils/addLiquidity";

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

  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );

  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const TAXOFFICE: TaxOfficeV3 = await ethers.getContract(
    "TaxOfficeV3",
    deployer
  );
  const BOARDROOM: Boardroom = await ethers.getContract("Boardroom", deployer);
  const USDC_SNOW_LP_ADDRESS: string = await addLiqudity(
    USDC,
    SNOW,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );
  const ZAP: Zap = await ethers.getContract("Zap", deployer);
  const WRAPPED_ROUTER: WrappedRouter = await ethers.getContract(
    "WrappedRouter",
    deployer
  );
  const DAO_SNOW_REBATE_TREASURY: SnowRebateTreasury = await ethers.getContract(
    "SnowRebateTreasury",
    deployer
  );
  const DEV_SNOW_REBATE_TREASURY: DevSnowRebateTreasury =
    await ethers.getContract("DevSnowRebateTreasury", deployer);

  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DAO as BOTH from tax to send and claim $SNOW tax free..."
  );
  const setMainTokenWhitelistTypeDaoTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      DAO,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeDaoTransactionResponse.wait(1);
  console.log(
    `(tx: ${setMainTokenWhitelistTypeDaoTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  return "success";
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
