import { pppAuthBaseUrl, questionGatewayBaseUrl } from './constants';
import axios from 'axios';
import { CredentialsProps } from './login/login.types';
import { AssignmentProps } from './available-qs/available-qs.types';

export const authToken = async ({ username, password }: CredentialsProps) => {
    const response = await axios.post(`${pppAuthBaseUrl}/sessions`, {
        username,
        password,
        productid: 0
    });

    return response.data;
};

export const unallocatedQs = async (authToken: string) => {
    const response = await axios.get(`${questionGatewayBaseUrl}/questionSetIds`, {
        headers: {
            AuthToken: authToken
        }
    });

    return response.data;
};

export const assignment = async ({ questionSetId, studentUserProfileId, authToken }: AssignmentProps) => {
    const response = await axios.post(`${questionGatewayBaseUrl}/assignment`, {
        questionSetId,
        studentUserProfileId,
        productid: 1
    }, {
        headers: {
            AuthToken: authToken
        }
    });

    return response.data;
};

export const allocatedQs = async (authToken: string) => {
    const response = await axios.get(`${questionGatewayBaseUrl}/assignments`, {
        headers: {
            AuthToken: authToken
        }
    });

    return response.data;
};

export const questDetails = async (id: string, authToken: string) => {
    const response = await axios.get(`${questionGatewayBaseUrl}/questDetails/${id}`, {
        headers: {
            AuthToken: authToken
        }
    });

    return response.data;
};