import ArrayType from '../array';

test('validates null, undefined or array data', () => {
    const type = ArrayType();
    expect(type.validate(null)).toEqual([]);
    expect(type.validate(undefined)).toEqual([]);
    expect(type.validate([])).toEqual([]);
});

test('read & normalize return data when no "proto" option', () => {
    const type = ArrayType();
    const data = [ 1, 2, 3 ];
    expect(type.read(data)).toBe(data);
    expect(type.normalize(data)).toBe(data);
});

test('invalidates non null, undefined or array data', () => {
    const type = ArrayType();
    expect(type.validate(12)).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate(true)).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate({})).toEqual([ { error: 'wrong_type' } ]);
});

test('handles "length" option as number', () => {
    const type = ArrayType();
    expect(type.validate([ 1, 2, 3 ], { length: 3 })).toEqual([]);
    expect(type.validate([ 1, 2, 3 ], { length: 4 })).toEqual([ { error: 'wrong_length' } ]);
});

test('handles "length" option as array', () => {
    const type = ArrayType();
    expect(type.validate([ 1, 2, 3 ], { length: [ 5 ] })).toEqual([ { error: 'too_short' } ]);
    expect(type.validate([ 1, 2, 3 ], { length: [ 0, 2 ] })).toEqual([ { error: 'too_long' } ]);
    expect(type.validate([ 1, 2, 3 ], { length: [ 3, 4 ] })).toEqual([]);
});

test('handles "proto" option for reading', () => {
    const read = jest.fn();
    read.mockReturnValue('read value');

    const factory = { create: jest.fn() };
    factory.create.mockReturnValue({ read });

    const type = ArrayType(factory);
    const data = [ 1, 2, 3 ];
    const result = type.read(data, { proto: 'type' });

    expect(read.mock.calls.length).toBe(3);
    data.forEach((value, index) => expect(read.mock.calls[ index ][ 0 ]).toEqual(value));
    expect(result).toEqual([ 'read value', 'read value', 'read value' ]);
    expect(data).toEqual([ 1, 2, 3 ]);
});

test('handles "proto" option for validation', () => {
    const validate = jest.fn();
    validate.mockReturnValue([ { error: 'violation' } ]);

    const factory = { create: jest.fn() };
    factory.create.mockReturnValue({ validate });

    const type = ArrayType(factory);
    const data = [ 1, 2, 3 ];
    const violations = type.validate(data, { proto: 'type' });

    expect(validate.mock.calls.length).toBe(3);
    data.forEach((value, index) => expect(validate.mock.calls[ index ][ 0 ]).toEqual(value));
    expect(violations).toEqual([
        { path: [ 0 ], error: 'violation' },
        { path: [ 1 ], error: 'violation' },
        { path: [ 2 ], error: 'violation' },
    ]);
    expect(data).toEqual([ 1, 2, 3 ]);
});

test('handles "proto" option for normalization', () => {
    const normalize = jest.fn();
    normalize.mockReturnValue('normalized value');

    const factory = { create: jest.fn() };
    factory.create.mockReturnValue({ normalize });

    const type = ArrayType(factory);
    const data = [ 1, 2, 3 ];
    const result = type.normalize(data, { proto: 'type' });

    expect(normalize.mock.calls.length).toBe(3);
    data.forEach((value, index) => expect(normalize.mock.calls[ index ][ 0 ]).toEqual(value));
    expect(result).toEqual([ 'normalized value', 'normalized value', 'normalized value' ]);
    expect(data).toEqual([ 1, 2, 3 ]);
});
