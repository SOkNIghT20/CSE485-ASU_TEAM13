const Client = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');
const { connectToSFTP, downloadFiles, closeConnection, uploadFiles } = require('./connect-sftp.js'); // Replace with actual module filename

jest.mock('ssh2-sftp-client');

let mockSftp;

beforeEach(() => {
    mockSftp = {
        connect: jest.fn().mockResolvedValue(),
        fastGet: jest.fn().mockResolvedValue(),
        fastPut: jest.fn().mockResolvedValue(),
        list: jest.fn().mockResolvedValue([{ name: 'testFile.txt' }]),
        mkdir: jest.fn().mockResolvedValue(),
        end: jest.fn().mockResolvedValue()
    };
    Client.mockImplementation(() => mockSftp);
});

describe('SFTP Client Tests', () => {
    test('connectToSFTP should connect successfully', async () => {
        const result = await connectToSFTP();
        expect(mockSftp.connect).toHaveBeenCalled();
    });

    test('downloadFiles should download a file successfully', async () => {
        const result = await downloadFiles('bob', 'testFile.txt');
        expect(mockSftp.fastGet).toHaveBeenCalledWith(
            expect.stringContaining('bob/testFile.txt'),
            expect.stringContaining('/tmp/testFile.txt')
        );
        expect(result).toBe('200');
    });

    test('downloadFiles should return 404 on failure', async () => {
        mockSftp.fastGet.mockRejectedValue(new Error('Download failed'));
        const result = await downloadFiles('bob', 'testFile.txt');
        expect(result).toBe('404');
    });

    test('uploadFiles should upload a file successfully', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        const result = await uploadFiles('bob', './testFile.txt');
        expect(mockSftp.mkdir).toHaveBeenCalled();
        expect(mockSftp.fastPut).toHaveBeenCalledWith(
            expect.stringContaining('testFile.txt'),
            expect.stringContaining('/mnt/9b90f2ca-dd8c-46d9-8348-46c21a5eda95/media-transfer-temp/bob/testFile.txt')
        );
        expect(result).toBe('200');
    });

    test('uploadFiles should return 404 if file does not exist', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        const result = await uploadFiles('bob', './nonexistent.txt');
        expect(result).toBe('404');
    });

    test('closeConnection should close the SFTP connection', async () => {
        await closeConnection();
        expect(mockSftp.end).toHaveBeenCalled();
    });
});
