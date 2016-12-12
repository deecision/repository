import BaseType from '../base';

test('reads any data to itself', () => {
    const type = BaseType();
    expect(type.read(12)).toBe(12);
    expect(type.read(undefined)).toBe(undefined);
    expect(type.read(null)).toBe(null);
});

test('validates any data', () => {
    const type = BaseType();
    expect(type.validate(12)).toEqual([]);
    expect(type.validate(undefined)).toEqual([]);
    expect(type.validate(null)).toEqual([]);
});

test('handles "default" option as boolean', () => {
    const type = BaseType();
    expect(type.read(12, { default: 'a' })).toBe(12);
    expect(type.read(null, { default: 'a' })).toBe(null);
    expect(type.read(undefined, { default: 'a' })).toBe('a');
});

test('handles "required" option as boolean', () => {
    const type = BaseType();
    expect(type.validate(12, { required: true })).toEqual([]);
    expect(type.validate(null, { required: true })).toEqual([ { error: 'not_set' } ]);
    expect(type.validate(undefined, { required: true })).toEqual([ { error: 'not_set' } ]);
});
