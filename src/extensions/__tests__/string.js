import StringType from '../string';

test('validates null, undefined or string data', () => {
    const type = StringType();
    expect(type.validate(null)).toEqual([]);
    expect(type.validate(undefined)).toEqual([]);
    expect(type.validate('')).toEqual([]);
    expect(type.validate('hello world')).toEqual([]);
});

test('invalidates non null, undefined or string data', () => {
    const type = StringType();
    expect(type.validate(12)).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate(true)).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate({})).toEqual([ { error: 'wrong_type' } ]);
});

test('handles "length" option as number', () => {
    const type = StringType();
    expect(type.validate('test', { length: 4 })).toEqual([]);
    expect(type.validate('test', { length: 5 })).toEqual([ { error: 'wrong_length' } ]);
});

test('handles "length" option as array', () => {
    const type = StringType();
    expect(type.validate('test', { length: [ 5 ] })).toEqual([ { error: 'too_short' } ]);
    expect(type.validate('test', { length: [ 0, 3 ] })).toEqual([ { error: 'too_long' } ]);
    expect(type.validate('test', { length: [ 4, 4 ] })).toEqual([]);
});

test('handles "pattern" option as regexp', () => {
    const type = StringType();
    expect(type.validate('test', { pattern: /\w+@\w+/ })).toEqual([ { error: 'wrong_format' } ]);
    expect(type.validate('test@localhost', { pattern: /\w+@\w+/ })).toEqual([]);
});
