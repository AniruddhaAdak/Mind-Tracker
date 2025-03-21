import React from 'react';
import { Chart, Series, ArgumentAxis, ValueAxis, Title } from '@progress/kendo-react-charts';
import { Loader } from '@progress/kendo-react-indicators';
import { Typography } from '@progress/kendo-react-common';
import useSocialData from '../../hooks/useSocialData';

const FollowerGrowth = () => {
    const { data, loading } = useSocialData();

    if (loading) {
        return <Loader />;
    }

    const chartData = data.map(item => ({
        date: item.date,
        followers: item.followers
    }));

    return (
        <div>
            <Typography variant="h6">Follower Growth Over Time</Typography>
            <Chart>
                <Title text="Follower Growth" />
                <ArgumentAxis>
                    <ValueAxis />
                </ArgumentAxis>
                <Series type="line" data={chartData} field="followers" categoryField="date" />
            </Chart>
        </div>
    );
};

export default FollowerGrowth;