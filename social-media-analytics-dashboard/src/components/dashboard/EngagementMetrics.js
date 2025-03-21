import React from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Chart, ChartSeries, ChartSeriesItem } from '@progress/kendo-react-charts';
import { Loader } from '@progress/kendo-react-indicators';
import { Typography } from '@progress/kendo-react-common';

const EngagementMetrics = ({ data, loading }) => {
    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <Typography variant="h4">Engagement Metrics</Typography>
            <Chart>
                <ChartSeries>
                    <ChartSeriesItem type="column" data={data.likes} name="Likes" />
                    <ChartSeriesItem type="column" data={data.comments} name="Comments" />
                    <ChartSeriesItem type="column" data={data.shares} name="Shares" />
                </ChartSeries>
            </Chart>
            <Grid data={data.posts}>
                <GridColumn field="post" title="Post" />
                <GridColumn field="likes" title="Likes" />
                <GridColumn field="comments" title="Comments" />
                <GridColumn field="shares" title="Shares" />
            </Grid>
        </div>
    );
};

export default EngagementMetrics;