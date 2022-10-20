export interface networkConfigItem {
  dao?: string;
  dev?: string;
  bandDatafeed?: string;
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
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  kovan: {
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    blockConfirmations: 6,
  },
  cronosTestnet: {
    dao: "0xeDc5E564811b96Ec8ca2336895C66b3B88F9ef66",
    dev: "0x8680492A2587F3Eb03ca0468F9695A6D21742CfC",
    bandDatafeed: "0xD0b2234eB9431e850a814bCdcBCB18C1093F986B",
    router: "0xc4e4DdB7a71fCF9Bb7356461Ca75124aA9910653",
    wcro: "0x9c3C2124B5bcE1688D5F4C707e910F5E2fA6B056",
    usdc: "0x39D8fa99c9964D456b9fbD5e059e63442F314121",
    wbtc: "0x111b84073280db412dE86b2252045e83604BA383",
    weth: "0x4fB822330853F3442e50714bEB49576740DCa6e0",
    dai: "0xe269eFacB96992DDaCda8C17ACc1411Cc22D484A",
    usdt: "0x3BE41FcDDC7914fbEf3635001b58e5571F7ddbb1",
    blockConfirmations: 6,
  },
  cronos: {
    dao: "0xeDc5E564811b96Ec8ca2336895C66b3B88F9ef66",
    dev: "0x8680492A2587F3Eb03ca0468F9695A6D21742CfC",
    bandDatafeed: "0xDA7a001b254CD22e46d3eAB04d937489c93174C3",
    router: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
    wcro: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    usdc: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    weth: "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    wbtc: "0x062E66477Faf219F25D27dCED647BF57C3107d52",
    dai: "0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
    usdt: "0x66e428c3f67a68878562e79A0234c1F83c208770",
    blockConfirmations: 6,
  },
};

export const developmentChains = ["hardhat", "localhost"];
