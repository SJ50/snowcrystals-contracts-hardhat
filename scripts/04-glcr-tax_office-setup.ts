import { ethers, network, getNamedAccounts } from "hardhat";
import {
  IERC20Token,
  Glcr,
  TaxOfficeV3,
  Boardroom,
  Zap,
  WrappedRouter,
  GlcrRebateTreasury,
  DevGlcrRebateTreasury,
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

  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);
  const TAXOFFICE: TaxOfficeV3 = await ethers.getContract(
    "TaxOfficeV3",
    deployer
  );
  const BOARDROOM: Boardroom = await ethers.getContract("Boardroom", deployer);
  const USDC_GLCR_LP_ADDRESS: string = await addLiqudity(
    USDC,
    GLCR,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("0.0001") // 1 GLCR = 10000 USDC
  );
  const ZAP: Zap = await ethers.getContract("Zap", deployer);
  const WRAPPED_ROUTER: WrappedRouter = await ethers.getContract(
    "WrappedRouter",
    deployer
  );
  const DAO_GLCR_REBATE_TREASURY: GlcrRebateTreasury = await ethers.getContract(
    "GlcrRebateTreasury",
    deployer
  );
  const DEV_GLCR_REBATE_TREASURY: DevGlcrRebateTreasury =
    await ethers.getContract("DevGlcrRebateTreasury", deployer);

  const TREASURY: Treasury = await ethers.getContract("Treasury", deployer);

  console.log(`
----------------------------------------------------`);
  console.log("setting $GLCR static tax rate to 25%...");
  const setShareTokenStaticTaxRateTransactionResponse =
    await TAXOFFICE.setShareTokenStaticTaxRate(2500);
  await setShareTokenStaticTaxRateTransactionResponse.wait(1);
  console.log(`(tx: ${setShareTokenStaticTaxRateTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding BoardRoom as BOTH from tax to deposit and withdraw $GLCR taxfree..."
  );
  const setShareTokenWhitelistTypeBoardRoomTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      BOARDROOM.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeBoardRoomTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeBoardRoomTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding Usdc-Glcr-LP as SENDER only from tax to make buying $GLCR taxfree..."
  );
  const setShareTokenWhitelistTypeGlcrLPTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      USDC_GLCR_LP_ADDRESS,
      1 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeGlcrLPTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeGlcrLPTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding Zap as SENDER only from tax to make $GLCR properly taxed..."
  );
  const setShareTokenWhitelistTypeZapTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      ZAP.address,
      1 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeZapTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeZapTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding TaxOffice as BOTH from tax to make $GLCR tax loop free..."
  );
  const setShareTokenWhitelistTypeTaxOfficeTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      TAXOFFICE.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeTaxOfficeTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeTaxOfficeTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding WrappedRouter as BOTH from tax to making LP tax free..."
  );
  const setShareTokenWhitelistTypeWrappedRouterTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      WRAPPED_ROUTER.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeWrappedRouterTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeWrappedRouterTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DaoGlcrRebateTreasury as BOTH from tax to send and claim $GLCR tax free..."
  );
  const setShareTokenWhitelistTypeDaoGlcrRebateTreasuryTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      DAO_GLCR_REBATE_TREASURY.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeDaoGlcrRebateTreasuryTransactionResponse.wait(
    1
  );
  console.log(
    `(tx: ${setShareTokenWhitelistTypeDaoGlcrRebateTreasuryTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DevGlcrRebateTreasury as BOTH from tax to send and claim $GLCR tax free..."
  );
  const setShareTokenWhitelistTypeDevGlcrRebateTreasuryTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      DEV_GLCR_REBATE_TREASURY.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeDevGlcrRebateTreasuryTransactionResponse.wait(
    1
  );
  console.log(
    `(tx: ${setShareTokenWhitelistTypeDevGlcrRebateTreasuryTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding Treasury as BOTH from tax to send and claim $GLCR tax free..."
  );
  const setShareTokenWhitelistTypeTreasuryTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      TREASURY.address,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeTreasuryTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeTreasuryTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DAO as BOTH from tax to send and claim $GLCR tax free..."
  );
  const setShareTokenWhitelistTypeDaoTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      DAO,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeDaoTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeDaoTransactionResponse.hash})...`
  );
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log(
    "excluding DEV as BOTH from tax to send and claim $GLCR tax free..."
  );
  const setShareTokenWhitelistTypeDevTransactionResponse =
    await TAXOFFICE.setShareTokenWhitelistType(
      DEV,
      3 //  0 = NONE, 1 = SENDER, 2 = RECIPIENT, 3 = BOTH
    );
  await setShareTokenWhitelistTypeDevTransactionResponse.wait(1);
  console.log(
    `(tx: ${setShareTokenWhitelistTypeDevTransactionResponse.hash})...`
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
