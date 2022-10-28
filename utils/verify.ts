import { run } from "hardhat";

const verify = async (
  contractAddress: string,
  args: any[],
  contractName?: string
) => {
  console.log("");
  console.log("----------------------------------------------------");
  console.log("Verifying contract...");
  try {
    if (contractName === undefined) {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      });
    } else {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
        contract: `contracts/${contractName}.sol:${contractName}`,
      });
    }
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
  console.log("----------------------------------------------------");
};

export default verify;
