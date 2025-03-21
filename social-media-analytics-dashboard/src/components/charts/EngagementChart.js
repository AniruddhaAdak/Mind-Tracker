import React from 'react';
import { Chart, Series, ArgumentAxis, ValueAxis, Title } from '@progress/kendo-react-charts';

const EngagementChart = ({ data = {} }) => {
    // Safely extract values with fallbacks to empty arrays
    const likes = data?.likes || [];
    const comments = data?.comments || [];
    const shares = data?.shares || [];
    
    // Check if we have any data to display
    const hasData = likes.length > 0 || comments.length > 0 || shares.length > 0;
    
    if (!hasData) {
        return <div className="chart-placeholder">No engagement data available</div>;
    }
    
    return (
        <div>
            <Chart>
                <Title text="Engagement Metrics" />
                <ArgumentAxis />
                <ValueAxis />
                <Series type="line" data={likes} name="Likes" />
                <Series type="line" data={comments} name="Comments" />
                <Series type="line" data={shares} name="Shares" />
            </Chart>
        </div>
    );
};

export default EngagementChart;
