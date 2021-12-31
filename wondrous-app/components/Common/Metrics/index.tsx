import React from 'react'
import { Orange200, Purple600, Purple700 } from '../../../theme/colors'
import { TaskMenuIcon } from '../../Icons/taskMenu'
import { CircleBarMetric, SimpleMetric } from './block'
import {
	FullMetricBlock,
	MetricsMenu,
	MetricsPanelWrapper,
	MetricsPannelInner,
} from './styles'

const MetricsPanel = (props) => {
	return (
		<MetricsPanelWrapper>
			<MetricsPannelInner>
				<SimpleMetric
					value={2}
					total={4}
					name={'task remaining'}
					color={Orange200}
				/>
				<SimpleMetric
					value={13}
					total={16}
					name={'awaiting approval'}
					color={Purple600}
				/>
				<SimpleMetric
					value={42}
					total={300}
					name={'membership requests'}
					color={Purple700}
				/>
				<FullMetricBlock>
					<CircleBarMetric />
				</FullMetricBlock>
			</MetricsPannelInner>
			<MetricsMenu>
				<TaskMenuIcon />
			</MetricsMenu>
		</MetricsPanelWrapper>
	)
}

export default MetricsPanel
