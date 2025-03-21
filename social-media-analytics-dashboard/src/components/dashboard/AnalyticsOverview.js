import React from 'react';
import { Card, CardHeader, CardBody, Typography, Loader, ProgressBar } from '@progress/kendo-react-all';
import { useAnalytics } from '../../hooks/useAnalytics';

const AnalyticsOverview = () => {
    const { data, loading, error } = useAnalytics();

    if (loading) {
        return (
            <div className="loader-container">
                <Loader type="spinner" />
            </div>
        );
    }

    if (error) {
        return <Typography variant="h6" style={{ color: 'red' }}>Error loading data</Typography>;
    }

    return (
        <Card>
            <CardHeader title="Analytics Overview" />
            <CardBody>
                <Typography variant="h5">Key Metrics</Typography>
                <div>
                    <Typography variant="body1">Followers: {data.followers}</Typography>
                    <ProgressBar value={data.engagementRate} />
                    <Typography variant="body1">Engagement Rate: {data.engagementRate}%</Typography>
                </div>
                <div>
                    <Typography variant="body1">Posts This Month: {data.postsThisMonth}</Typography>
                </div>
            </CardBody>
        </Card>
    );
};

export default AnalyticsOverview;