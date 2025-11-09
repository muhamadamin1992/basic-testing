// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spy = jest.spyOn(globalThis, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(spy).toHaveBeenCalledWith(callback, timeout);
    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spy = jest.spyOn(globalThis, 'setInterval');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByInterval(callback, timeout);

    expect(spy).toHaveBeenCalledWith(callback, timeout);
    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByInterval(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spy = jest.spyOn(jest.requireActual('path'), 'join');
    await readFileAsynchronously('test.txt');
    expect(spy).toHaveBeenCalledWith(expect.any(String), 'test.txt');
    spy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    expect(await readFileAsynchronously('non-existent-file.txt')).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const existSyncMock = jest
      .spyOn(jest.requireActual('fs'), 'existsSync')
      .mockReturnValue(true);
    const readFileMock = jest
      .spyOn(jest.requireActual('fs/promises'), 'readFile')
      .mockResolvedValue(Buffer.from('File content'));

    expect(await readFileAsynchronously('existing-file.txt')).toBe(
      'File content',
    );

    existSyncMock.mockRestore();
    readFileMock.mockRestore();
    // Write your test here
  });
});
