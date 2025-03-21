import React from 'react';
import { Toolbar, Button } from '@progress/kendo-react-buttons';
import { List } from '@progress/kendo-react-list';
import { Badge } from '@progress/kendo-react-indicators';
import { Tooltip } from '@progress/kendo-react-tooltip';

const Sidebar = () => {
    const menuItems = [
        { text: 'Dashboard', icon: 'dashboard', badge: 3 },
        { text: 'Analytics Overview', icon: 'analytics', badge: 5 },
        { text: 'Engagement Metrics', icon: 'engagement', badge: 2 },
        { text: 'Follower Growth', icon: 'growth', badge: 4 },
        { text: 'Recent Posts', icon: 'posts', badge: 1 },
    ];

    return (
        <div className="sidebar">
            <Toolbar>
                <h2>Social Media Analytics</h2>
            </Toolbar>
            <List>
                {menuItems.map((item, index) => (
                    <Tooltip key={index} content={`${item.text} (${item.badge})`}>
                        <Button icon={item.icon}>
                            {item.text}
                            <Badge>{item.badge}</Badge>
                        </Button>
                    </Tooltip>
                ))}
            </List>
        </div>
    );
};

export default Sidebar;