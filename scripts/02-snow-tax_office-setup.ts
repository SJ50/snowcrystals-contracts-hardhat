import { ethers, network, getNamedAccounts } from "hardhat";
import {
  IERC20,
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

  const USDC: IERC20 = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20",
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
  console.log("setting $SNOW static tax rate to 25%...");

  const setMainTokenStaticTaxRateTransactionResponse =
    await TAXOFFICE.setMainTokenStaticTaxRate(2500);
  await setMainTokenStaticTaxRateTransactionResponse.wait(1);
  console.log(`(tx: ${setMainTokenStaticTaxRateTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding BoardRoom as BOTH from tax to make claiming $SNOW taxfree..."
  );

  const setMainTokenWhitelistTypeBoardRoomTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      BOARDROOM.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeBoardRoomTransactionResponse.wait(1);

  console.log(
    `(tx: ${setMainTokenWhitelistTypeBoardRoomTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding Usdc-Snow-LP as SENDER only from tax to make buying $SNOW taxfree..."
  );

  const setMainTokenWhitelistTypeSnowLPTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      USDC_SNOW_LP_ADDRESS,
      1 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeSnowLPTransactionResponse.wait(1);

  console.log(
    `(tx: ${setMainTokenWhitelistTypeSnowLPTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding Zap as SENDER only from tax to make $SNOW properly taxed..."
  );

  const setMainTokenWhitelistTypeZapTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      ZAP.address,
      1 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeZapTransactionResponse.wait(1);

  console.log(
    `(tx: ${setMainTokenWhitelistTypeZapTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding TaxOffice as BOTH from tax to make $SNOW tax loop free..."
  );

  const setMainTokenWhitelistTypeTaxOfficeTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      TAXOFFICE.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeTaxOfficeTransactionResponse.wait(1);

  console.log(
    `(tx: ${setMainTokenWhitelistTypeTaxOfficeTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding WrappedRouter as BOTH from tax to making LP tax free..."
  );

  const setMainTokenWhitelistTypeWrappedRouterTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      WRAPPED_ROUTER.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeWrappedRouterTransactionResponse.wait(1);

  console.log(
    `(tx: ${setMainTokenWhitelistTypeWrappedRouterTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DaoSnowRebateTreasury as BOTH from tax to send and claim $SNOW tax free..."
  );

  const setMainTokenWhitelistTypeDaoSnowRebateTreasuryTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      DAO_SNOW_REBATE_TREASURY.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeDaoSnowRebateTreasuryTransactionResponse.wait(
    1
  );

  console.log(
    `(tx: ${setMainTokenWhitelistTypeDaoSnowRebateTreasuryTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DevSnowRebateTreasury as BOTH from tax to send and claim $SNOW tax free..."
  );

  const setMainTokenWhitelistTypeDevSnowRebateTreasuryTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      DEV_SNOW_REBATE_TREASURY.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeDevSnowRebateTreasuryTransactionResponse.wait(
    1
  );

  console.log(
    `(tx: ${setMainTokenWhitelistTypeDevSnowRebateTreasuryTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding Treasury as BOTH from tax to send and claim $SNOW tax free..."
  );

  const setMainTokenWhitelistTypeTreasuryTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      TREASURY.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeTreasuryTransactionResponse.wait(1);

  console.log(
    `(tx: ${setMainTokenWhitelistTypeTreasuryTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

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

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DEV as BOTH from tax to send and claim $SNOW tax free..."
  );

  const setMainTokenWhitelistTypeDevTransactionResponse =
    await TAXOFFICE.setMainTokenWhitelistType(
      DEV,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setMainTokenWhitelistTypeDevTransactionResponse.wait(1);

  console.log(
    `(tx: ${setMainTokenWhitelistTypeDevTransactionResponse.hash})...`
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
