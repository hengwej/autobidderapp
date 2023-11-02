import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getAllAuctions } from '../src/utils/AuctionAPI';

const mock = new MockAdapter(axios);

describe('getAllAuctions', () => {
    it('fetches successfully data from an API', async () => {
        // Arrange
        //const mockData = [{ /* Add your mock data here */ }];
        mock.onPost('/api/auctions/allAuction').reply(200, mockData);

        // Act
        const response = await getAllAuctions();

        // Assert
        expect(response.status).toEqual(200); // Ensure the status code is as expected
        //expect(response.data).toEqual(mockData); // Ensure the data matches the mock data
    });

    it('handles errors when fetching data from an API', async () => {
        // Arrange
        mock.onPost('/api/auctions/allAuction').reply(500, { error: 'Internal Server Error' });

        // Act & Assert
        await expect(getAllAuctions()).rejects.toThrow('Request failed with status code 500');
    });
});
