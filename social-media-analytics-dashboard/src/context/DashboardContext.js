import React, { createContext, useState, useEffect } from 'react';
import { fetchSocialMediaData } from '../services/apiService';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [socialData, setSocialData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSocialMediaData();
                setSocialData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <DashboardContext.Provider value={{ socialData, loading, error }}>
            {children}
        </DashboardContext.Provider>
    );
};