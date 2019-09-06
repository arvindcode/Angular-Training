import { Test1 } from './test1';

describe('Test1', () => {
  let ts = new Test1()
  it('should create an instance', () => {
    expect(new Test1()).toBeTruthy();
  });
  it('add two number', () => {

    expect(ts.add(2,2)).toBe(4, "Should be equal");
  });
});
