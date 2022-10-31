import { networkConfig, developmentChains } from "../helper-hardhat-config";

const currentTimestampInSeconds = Math.round(Date.now() / 1000); // local timezone
const utcSnowCrystalsStartTimeEpoch = async (networkName: string) => {
  if (networkConfig[networkName].dappStartTime === undefined) {
    return currentTimestampInSeconds + 30 * 60;
  } else if (
    Date.parse(networkConfig[networkName].dappStartTime!) / 1000 <
    Math.round(Date.now() / 1000)
  ) {
    console.error("check dappStartTime in helper-hardhat-config");
  } else {
    return Math.round(
      Date.parse(networkConfig[networkName].dappStartTime!) / 1000
    ); // UTC; ISO8601-compliant; "Z" at the end means UTC
  }
};

export const dappStartTime = async (networkName: string) => {
  const ONE_DAYS_IN_SECS = 24 * 60 * 60;
  if (networkName == "cronosTestnet") {
    return (
      Number(await utcSnowCrystalsStartTimeEpoch(networkName)) +
      ONE_DAYS_IN_SECS
    );
  } else {
    return Number(await utcSnowCrystalsStartTimeEpoch(networkName));
  }
};

export default utcSnowCrystalsStartTimeEpoch;
