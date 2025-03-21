import React from 'react';
import { Grid, GridCell } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import { Typography } from '@progress/kendo-react-common';
import AnalyticsOverview from './AnalyticsOverview';
import EngagementMetrics from './EngagementMetrics';
import FollowerGrowth from './FollowerGrowth';
import RecentPosts from './RecentPosts';

const Dashboard = () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate data fetching
        const fetchData = async () => {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard">
            {loading ? (
                <Loader />
            ) : (
                <Grid>
                    <GridCell colSpan={2}>
                        <Typography variant="h4">Social Media Analytics Dashboard</Typography>
                    </GridCell>
                    <GridCell colSpan={2}>
                        <AnalyticsOverview />
                    </GridCell>
                    <GridCell colSpan={2}>
                        <EngagementMetrics />
                    </GridCell>
                    <GridCell colSpan={2}>
                        <FollowerGrowth />
                    </GridCell>
                    <GridCell colSpan={2}>
                        <RecentPosts />
                    </GridCell>
                    <GridCell>
                        <Button primary>Refresh Data</Button>
                    </GridCell>
                </Grid>
            )}
        </div>
    );
};

export default Dashboard;