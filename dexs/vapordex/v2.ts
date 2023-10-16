import { Chain } from "@defillama/sdk/build/general";
import { CHAIN } from "../../helpers/chains";
import { getGraphDimensions } from "../../helpers/getUniSubgraph";

const endpointsV3 = {
  [CHAIN.AVAX]:
    "https://subgraphs.sushi.com/subgraphs/name/sushi-v3/v3-arbitrum-nova",
};

const v3Graphs = getGraphDimensions({
  graphUrls: endpointsV3,
  totalVolume: {
    factory: "factories",
    field: "totalVolumeUSD",
  },
  dailyVolume: {
    factory: "uniswapDayData",
    field: "volumeUSD",
  },
  feesPercent: {
    type: "fees",
    ProtocolRevenue: 0,
    HoldersRevenue: 0,
    UserFees: 100, // User fees are 100% of collected fees
    SupplySideRevenue: 100, // 100% of fees are going to LPs
    Revenue: 0, // Set revenue to 0 as protocol fee is not set for all pools for now
  },
});

const startTimeV3: { [key: string]: number } = {
  [CHAIN.AVAX]: 1680566400,
};

const v3 = Object.keys(endpointsV3).reduce(
  (acc, chain) => ({
    ...acc,
    [chain]: {
      fetch: v3Graphs(chain as Chain),
      start: async () => startTimeV3[chain],
      meta: {
        methodology: {
          Fees: "Each pool charge between 0.01% to 1% fee",
          UserFees: "Users pay between 0.01% to 1% fee",
          Revenue: "0 to 1/4 of the fee goes to treasury",
          HoldersRevenue: "None",
          ProtocolRevenue: "Treasury receives a share of the fees",
          SupplySideRevenue:
            "Liquidity providers get most of the fees of all trades in their pools",
        },
      },
    },
  }),
  {}
);

export default v3;
