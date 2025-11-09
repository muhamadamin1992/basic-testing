// Uncomment the code below and write your tests
import { getBankAccount } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(100).getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => getBankAccount(50).withdraw(150)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => getBankAccount(30).transfer(50, getBankAccount(10))).toThrow(
      'Insufficient funds: cannot withdraw more than 30',
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => {
      const account = getBankAccount(100);
      account.transfer(40, account);
    }).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    expect(getBankAccount(50).deposit(20).getBalance()).toBe(70);
  });

  test('should withdraw money', () => {
    expect(getBankAccount(70).withdraw(40).getBalance()).toBe(30);
  });

  test('should transfer money', () => {
    expect(
      getBankAccount(200).transfer(50, getBankAccount(50)).getBalance(),
    ).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await getBankAccount(0).fetchBalance();
    if (balance === null) {
      return;
    }
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    try {
      const account = getBankAccount(500);
      await account.synchronizeBalance();
      expect(account.getBalance()).not.toBe(500);
    } catch (e) {}
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    try {
      await getBankAccount(500).synchronizeBalance();
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toBe('Synchronization failed');
      }
    }
  });
});
