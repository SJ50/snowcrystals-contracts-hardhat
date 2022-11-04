import { task, HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { setGlobalFlags, item, whoami } from "@1password/op-js";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
// import "@nomiclabs/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@cronos-labs/hardhat-cronoscan";
import "hardhat-deploy";
import "./tasks/blocknumber";
import "./tasks/treasury-allocateSeigniorage";

setGlobalFlags({
  account: "my.1password.com",
});
const CRONOSCAN_API_KEY: string = process.env.CRONOSCAN_API_KEY!;
const CRONOSCAN_TESTNET_API_KEY: string =
  process.env.CRONOSCAN_TESTNET_API_KEY!;
const DEPLOYER: string =
  item
    .get("Metamask")
    .fields?.filter(
      (i) => i.type === `CONCEALED` && i.label === `Deployer`
    ) /*op://Private/Metamask/Section_6B38E8BA26DF4E418F522F734847C50C/Deployer*/
    ?.map((e) => e.value)
    ?.toString() || "";
const COINMARKETCAP_API_KEY: string = process.env.COINMARKETCAP_API_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: "https://evm.cronos.org",
      },
    },
    cronos: {
      url: "https://evm.cronos.org",
      accounts: [DEPLOYER],
      chainId: 25,
    },
    cronosTestnet: {
      url: "https://evm-t3.cronos.org",
      accounts: [DEPLOYER],
      chainId: 338,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    dao: {
      default: 1,
    },
    dev: {
      default: 2,
    },
  },
  etherscan: {
    apiKey: {
      cronosTestnet: <string>process.env["CRONOSCAN_TESTNET_API_KEY"],
      cronos: CRONOSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: "CRO",
    gasPriceApi: `https://api.cronoscan.com/api?module=proxy&action=eth_gasPrice&apikey=${CRONOSCAN_API_KEY}`,
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  paths: {
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
  },
};

export default config;
