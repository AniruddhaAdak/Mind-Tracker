import axios from 'axios';

const API_BASE_URL = 'https://api.socialmedia.com'; // Replace with actual API endpoint

export const fetchAnalyticsData = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/analytics/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw error;
    }
};

export const processEngagementMetrics = (data) => {
    return {
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0,
    };
};

export const processFollowerGrowth = (data) => {
    return data.map(entry => ({
        date: entry.date,
        followers: entry.followers || 0,
    }));
};

export const comparePlatforms = (data) => {
    const comparison = {};
    data.forEach(platform => {
        comparison[platform.name] = {
            followers: platform.followers || 0,
            engagement: platform.engagement || 0,
        };
    });
    return comparison;
};