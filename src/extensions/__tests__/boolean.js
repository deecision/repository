import BooleanType from '../boolean';

test('normalizes any data to a boolean', () => {
    const type = BooleanType();
    expect(type.normalize(12)).toBe(true);
    expect(type.normalize(0)).toBe(false);
    expect(type.normalize(undefined)).toBe(false);
    expect(type.normalize(null)).toBe(false);
    expect(type.normalize('test')).toBe(true);
});
