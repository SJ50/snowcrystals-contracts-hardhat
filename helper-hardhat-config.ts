export interface networkConfigItem {
  dao?: string;
  dev?: string;
  bandDatafeedRef?: string;
  router?: string;
  factory?: string;
  wcro?: string;
  usdc?: string;
  wbtc?: string;
  weth?: string;
  dai?: string;
  usdt?: string;
  blockConfirmations?: number;
  ethUsdPriceFeed?: string;
  contractVerfication?: boolean;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {
    dao: "0xeDc5E564811b96Ec8ca2336895C66b3B88F9ef66",
    dev: "0x8680492A2587F3Eb03ca0468F9695A6D21742CfC",
    bandDatafeedRef: "0xDA7a001b254CD22e46d3eAB04d937489c93174C3",
    router: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
    wcro: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    usdc: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    weth: "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    wbtc: "0x062E66477Faf219F25D27dCED647BF57C3107d52",
    dai: "0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
    usdt: "0x66e428c3f67a68878562e79A0234c1F83c208770",
  },
  hardhat: {
    dao: "0xeDc5E564811b96Ec8ca2336895C66b3B88F9ef66",
    dev: "0x8680492A2587F3Eb03ca0468F9695A6D21742CfC",
    bandDatafeedRef: "0xDA7a001b254CD22e46d3eAB04d937489c93174C3",
    router: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
    wcro: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    usdc: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    weth: "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    wbtc: "0x062E66477Faf219F25D27dCED647BF57C3107d52",
    dai: "0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
    usdt: "0x66e428c3f67a68878562e79A0234c1F83c208770",
  },
  kovan: {
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    blockConfirmations: 6,
  },
  cronosTestnet: {
    dao: "0xeDc5E564811b96Ec8ca2336895C66b3B88F9ef66",
    dev: "0x8680492A2587F3Eb03ca0468F9695A6D21742CfC",
    bandDatafeedRef: "0xD0b2234eB9431e850a814bCdcBCB18C1093F986B",
    router: "0xc4e4DdB7a71fCF9Bb7356461Ca75124aA9910653",
    blockConfirmations: 6,
    contractVerfication: true,
  },
  cronos: {
    dao: "0xeDc5E564811b96Ec8ca2336895C66b3B88F9ef66",
    dev: "0x8680492A2587F3Eb03ca0468F9695A6D21742CfC",
    bandDatafeedRef: "0xDA7a001b254CD22e46d3eAB04d937489c93174C3",
    router: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
    wcro: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    usdc: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    weth: "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    wbtc: "0x062E66477Faf219F25D27dCED647BF57C3107d52",
    dai: "0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
    usdt: "0x66e428c3f67a68878562e79A0234c1F83c208770",
    blockConfirmations: 6,
    contractVerfication: true,
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const mocksDeploymentChains = ["localhost", "cronosTestnet"];
export const deploymentChains = ["cronos", "cronosTestnet"];
