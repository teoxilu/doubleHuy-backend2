
require('dotenv').config();
const axios = require('axios');

const GHN_API_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

const ghnApi = axios.create({
    baseURL: GHN_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Token': process.env.GHN_API_KEY
    }
});

const createGHNOrder = async (orderData) => {
    try {
        const response = await ghnApi.post('/shipping-order/create', orderData, {
            headers: {
                'ShopId': process.env.GHN_SHOP_ID
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.response.data);
        throw error;
    }
};

const getGHNOrderStatus = async (orderCode) => {
    try {
        const response = await ghnApi.get(`/shipping-order/track`, {
            params: {
                order_code: orderCode
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error tracking order:', error.response.data);
        throw error;
    }
};

const getAddress = async (addressId) => {
    try {
        const response = await ghnApi.get(`/master-data/address`, {
            params: {
                id: addressId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting address:', error.response.data);
        throw error;
    }
};

module.exports = { createGHNOrder, getGHNOrderStatus, getAddress };
