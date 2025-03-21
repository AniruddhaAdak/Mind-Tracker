import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@progress/kendo-react-layout';

const Header = () => {
    return (
        <AppBar>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Social Media Analytics Dashboard
                </Typography>
                <Button primary={true}>Login</Button>
                <Button>Sign Up</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;