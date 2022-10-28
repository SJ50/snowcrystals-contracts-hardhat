import { ethers, getNamedAccounts, network } from "hardhat";
import { Zap, Snow, Glcr } from "../typechain-types";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";
import addLiqudity from "../utils/addLiquidity";

async function main() {
  const { deployer } = await getNamedAccounts();

  const ZAP: Zap = await ethers.getContract("Zap", deployer);
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);

  console.log(`
----------------------------------------------------`);
  console.log("setting $SNOW as taxed in ZAP..");

  const setIsFeeOnTransferSnowTransactionResponse =
    await ZAP.setIsFeeOnTransfer(SNOW.address);
  await setIsFeeOnTransferSnowTransactionResponse.wait(1);

  console.log(`(tx: ${setIsFeeOnTransferSnowTransactionResponse.hash})...`);
  console.log("----------------------------------------------------");

  console.log(`
----------------------------------------------------`);
  console.log("setting $GLCR as taxed in ZAP..");

  const setIsFeeOnTransferGlcrTransactionResponse =
    await ZAP.setIsFeeOnTransfer(GLCR.address);
  await setIsFeeOnTransferGlcrTransactionResponse.wait(1);

  console.log(`(tx: ${setIsFeeOnTransferGlcrTransactionResponse.hash})...`);
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
