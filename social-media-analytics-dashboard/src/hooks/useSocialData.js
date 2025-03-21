import { useState, useEffect } from 'react';
import { fetchSocialMediaData } from '../services/apiService';

const useSocialData = () => {
    const [socialData, setSocialData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const data = await fetchSocialMediaData();
                setSocialData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    return { socialData, loading, error };
};

export default useSocialData;