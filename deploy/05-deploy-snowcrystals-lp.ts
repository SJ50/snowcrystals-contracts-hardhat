import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Snow, IERC20Token, Glcr } from "../typechain-types";
import addLiqudity from "../utils/addLiquidity";
import { networkConfig, mocksDeploymentChains } from "../helper-hardhat-config";

const snowCrystalsLP: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, network, ethers } = hre;
  const { deployer } = await getNamedAccounts();

  console.log();
  console.log("----------------------------------------------------");
  console.log("Remote/fork chain detected! Deploying liquidity...");

  const USDC: IERC20Token = mocksDeploymentChains.includes(network.name)
    ? await ethers.getContract("Mock USDC", deployer)
    : await ethers.getContractAt(
        "IERC20Token",
        networkConfig[network.name].usdc!,
        deployer
      );
  const SNOW: Snow = await ethers.getContract("Snow", deployer);
  const GLCR: Glcr = await ethers.getContract("Glcr", deployer);

  const UsdcSnowLpAddress: string = await addLiqudity(
    USDC,
    SNOW,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );
  console.log(
    `Liquidity Pair of $${await USDC.symbol()}-$${await SNOW.symbol()} deployed at ${UsdcSnowLpAddress}`
  );
  console.log("----------------------------------------------------");
  const UsdcGlcrLpAddress: string = await addLiqudity(
    USDC,
    GLCR,
    ethers.BigNumber.from(1 * 10 ** 6),
    ethers.utils.parseEther("1")
  );
  console.log(
    `Liquidity Pair of $${await USDC.symbol()}-$${await GLCR.symbol()} deployed at ${UsdcGlcrLpAddress}`
  );

  console.log("----------------------------------------------------");
};

export default snowCrystalsLP;
snowCrystalsLP.tags = ["all", "snowcrystals", "lp"];
