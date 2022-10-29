// import { ethers, getNamedAccounts } from "hardhat";

import { run } from "hardhat";

async function main() {
  console.log(`
runngin 01-snow-setup.ts...`);
  try {
    await run("run", { script: "scripts/01-snow-setup.ts" });
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }

  console.log(`
runngin 02-snow-tax_office-setup.ts...`);
  await run("run", { script: "scripts/02-snow-tax_office-setup.ts" });

  console.log(`
runngin 03-glcr-setup.tss...`);
  await run("run", { script: "scripts/03-glcr-setup.ts" });

  console.log(`
runngin 04-glcr-tax_office-setup.ts...`);
  await run("run", { script: "scripts/04-glcr-tax_office-setup.ts" });

  console.log(`
runngin 05-sbond-setup.ts...`);
  await run("run", { script: "scripts/05-sbond-setup.ts" });

  console.log(`
runngin 06-boardroom-setup.ts...`);
  await run("run", { script: "scripts/06-boardroom-setup.ts" });

  console.log(`
runngin 07-all-oracle-setup.ts...`);
  await run("run", { script: "scripts/07-all-oracle-setup.ts" });

  console.log(`
runngin 08-treasury-setup.ts...`);
  await run("run", { script: "scripts/08-treasury-setup.ts" });

  console.log(`
runngin 09-genesispool-setup.ts...`);
  await run("run", { script: "scripts/09-genesispool-setup.ts" });

  console.log(`
runngin 10-glcr-rewardpool-setup.ts...`);
  await run("run", { script: "scripts/10-glcr-rewardpool-setup.ts" });

  console.log(`
runngin 11-zap-setup.ts...`);
  await run("run", { script: "scripts/11-zap-setup.ts" });

  console.log(`
runngin 12-dao-snow-rebate-setup.ts...`);
  await run("run", { script: "scripts/12-dao-snow-rebate-setup.ts" });

  console.log(`
runngin 13-dao-glcr-rebate-setup.ts...`);
  await run("run", { script: "scripts/13-dao-glcr-rebate-setup.ts" });

  console.log(`
runngin 14-dev-snow-rebate-setup.ts...`);
  await run("run", { script: "scripts/14-dev-snow-rebate-setup.ts" });

  console.log(`
runngin 15-dev-glcr-rebate-setup.ts...`);
  await run("run", { script: "scripts/15-dev-glcr-rebate-setup.ts" });
}
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
// export default task(
//   "block-number",
//   "Prints the current block number"
// ).setAction(async (_taskArgs, hre) => {
//   await hre.ethers.provider.getBlockNumber().then((blockNumber: number) => {
//     console.log("\n",`Current block number: ${blockNumber}`);
//   });
// });
