import React from 'react';
import { Loader } from '@progress/kendo-react-indicators';
import { Typography } from '@progress/kendo-react-common';

const LoadingState = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Loader type="infinite-spinner" />
            <Typography style={{ marginTop: '20px' }} category="h6">
                Loading, please wait...
            </Typography>
        </div>
    );
};

export default LoadingState;