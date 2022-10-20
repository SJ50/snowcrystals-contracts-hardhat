import { ethers, run, network } from "hardhat";

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = ethers.utils.parseEther("1");

  // const Lock = await ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );

  // We get the contract to deploy
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();

  if (
    (network.config.chainId === 338 && process.env.CRONOSCAN_TESTNET_API_KEY) ||
    (network.config.chainId === 25 && process.env.CRONOSCAN_API_KEY)
  ) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  console.log("Simple Storage deployed to:", simpleStorage.address);

  // Get the current value
  let currentValue = await simpleStorage.retrieve();
  console.log(`Current value: ${currentValue}`);

  // Update the value
  console.log("Updating contract...");
  let transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(); // returns transaction receipt
  currentValue = await simpleStorage.retrieve();
  console.log(`Current value: ${currentValue}`);
}

const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying Contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(error);
    }
  }
};
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
