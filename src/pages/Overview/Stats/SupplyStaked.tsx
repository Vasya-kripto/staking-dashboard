// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { Pie } from 'library/StatBoxList/Pie';
import { APIContextInterface } from 'types/api';
import { NetworkMetricsContextInterface } from 'types';
import { StakingContextInterface } from 'types/staking';
import { toFixedIfNecessary } from 'Utils';

export const SupplyStakedStatBox = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { metrics }: any =
    useNetworkMetrics() as NetworkMetricsContextInterface;
  const { totalIssuance } = metrics;
  const { staking } = useStaking() as StakingContextInterface;

  const { lastTotalStake } = staking;

  // total supply as percent
  let supplyAsPercent = 0;
  if (totalIssuance.gt(new BN(0))) {
    supplyAsPercent = lastTotalStake
      .div(totalIssuance.div(new BN(100)))
      .toNumber();
  }

  // base values
  const lastTotalStakeBase = lastTotalStake.div(new BN(10 ** units));
  const totalIssuanceBase = totalIssuance.div(new BN(10 ** units));

  const params = {
    label: 'Supply Staked',
    stat: {
      value: lastTotalStakeBase.toNumber(),
      unit: network.unit,
    },
    graph: {
      value1: lastTotalStakeBase.toNumber(),
      value2: totalIssuanceBase.sub(lastTotalStakeBase).toNumber(),
    },

    tooltip: `${toFixedIfNecessary(supplyAsPercent, 2)}%`,
    assistant: {
      page: 'overview',
      key: 'Supply Staked',
    },
  };

  return <Pie {...params} />;
};

export default SupplyStakedStatBox;
