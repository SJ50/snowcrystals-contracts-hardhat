import { network } from "hardhat";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

const currentTimestampInSeconds = Math.round(Date.now() / 1000); // local timezone
const utcSnowCrystalsStartTimeEpoch = async (networkName: string) => {
  let utcSnowCrystalsStartTimeEpoch: number;
  if (developmentChains.includes(networkName)) {
    utcSnowCrystalsStartTimeEpoch = currentTimestampInSeconds + 30 * 60;
  } else {
    utcSnowCrystalsStartTimeEpoch = Math.round(
      Date.parse(networkConfig[network.name].dappStartTime!) / 1000
    ); // UTC; ISO8601-compliant; "Z" at the end means UTC
  }
  return utcSnowCrystalsStartTimeEpoch;
};

export default utcSnowCrystalsStartTimeEpoch;
