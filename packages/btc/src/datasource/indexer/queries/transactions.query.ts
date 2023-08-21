import {
  GetBitcoinTransactionsDocument,
  Scalars,
  OptBlockRange,
} from '@xdefi-tech/chains-graphql';
import { gqlClient } from '@xdefi-tech/chains-core';

export const getTransaction = (
  address: Scalars['String'],
  blockRange: OptBlockRange
) => {
  return gqlClient.query({
    query: GetBitcoinTransactionsDocument,
    variables: {
      address,
      blockRange,
      dateRange: {
        from: null,
        to: null,
      },
      pageNumber: 1,
      pageSize: 1000,
    },
  });
};
