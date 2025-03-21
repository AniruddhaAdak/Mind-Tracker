import { useState, useEffect } from 'react';
import { fetchAnalyticsData } from '../services/analyticsService';

const useAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAnalyticsData = async () => {
            try {
                setLoading(true);
                const data = await fetchAnalyticsData();
                setAnalyticsData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getAnalyticsData();
    }, []);

    return { analyticsData, loading, error };
};

export default useAnalytics;