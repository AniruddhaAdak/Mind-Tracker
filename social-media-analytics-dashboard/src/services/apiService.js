import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchSocialMediaData = async (platform) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/${platform}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching social media data:', error);
        throw error;
    }
};

export const fetchRecentPosts = async (platform) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts/${platform}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        throw error;
    }
};

export const fetchEngagementMetrics = async (platform) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/engagement/${platform}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching engagement metrics:', error);
        throw error;
    }
};