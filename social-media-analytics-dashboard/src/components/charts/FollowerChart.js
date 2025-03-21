import React from 'react';
import { Chart, Series, ArgumentAxis, ValueAxis, Title } from '@progress/kendo-react-charts';
import { useSocialData } from '../../hooks/useSocialData';

const FollowerChart = () => {
    const { followerData } = useSocialData();

    return (
        <div>
            <Chart>
                <Title text="Follower Growth Over Time" />
                <ArgumentAxis>
                    <ValueAxis />
                </ArgumentAxis>
                <Series type="line" data={followerData} />
            </Chart>
        </div>
    );
};

export default FollowerChart;