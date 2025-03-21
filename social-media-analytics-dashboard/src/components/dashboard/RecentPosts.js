import React from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Loader } from '@progress/kendo-react-indicators';
import { useSocialData } from '../../hooks/useSocialData';

const RecentPosts = () => {
    const { data, loading } = useSocialData();

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="recent-posts">
            <h2>Recent Posts</h2>
            <Grid data={data} style={{ height: '400px' }}>
                <GridColumn field="title" title="Post Title" />
                <GridColumn field="date" title="Date" />
                <GridColumn field="likes" title="Likes" />
                <GridColumn field="comments" title="Comments" />
                <GridColumn field="shares" title="Shares" />
            </Grid>
        </div>
    );
};

export default RecentPosts;