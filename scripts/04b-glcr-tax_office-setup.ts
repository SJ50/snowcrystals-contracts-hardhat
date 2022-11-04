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
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
