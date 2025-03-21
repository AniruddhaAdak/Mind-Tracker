import React from 'react';
import { Typography } from '@progress/kendo-react-common';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f1f1f1' }}>
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} Social Media Analytics Dashboard. All rights reserved.
            </Typography>
        </footer>
    );
};

export default Footer;