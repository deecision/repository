import ObjectType from '../object';

test('validates null, undefined or object data', () => {
    const type = ObjectType();
    expect(type.validate(null)).toEqual([]);
    expect(type.validate(undefined)).toEqual([]);
    expect(type.validate({})).toEqual([]);
});

test('read & normalize return data when no "proto" option', () => {
    const type = ObjectType();
    const data = { a: 1, b: 2 };
    expect(type.read(data)).toBe(data);
    expect(type.normalize(data)).toBe(data);
});

test('invalidates non null, undefined or array data', () => {
    const type = ObjectType();
    expect(type.validate(12)).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate(true)).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate([])).toEqual([ { error: 'wrong_type' } ]);
});

test('handles "props" option for reading', () => {
    const read = jest.fn();
    read.mockReturnValue('read value');

    const factory = { create: jest.fn() };
    factory.create.mockReturnValue({ read });

    const type = ObjectType(factory);
    const data = { a: 1, b: 2, c: 3 };
    const result = type.read(data, { props: { a: 'type', b: 'type' } });

    expect(read.mock.calls.length).toBe(2);
    expect(read.mock.calls[ 0 ][ 0 ]).toBe(1);
    expect(read.mock.calls[ 1 ][ 0 ]).toBe(2);
    expect(result).toEqual({ a: 'read value', b: 'read value', c: 3 });
    expect(data).toEqual({ a: 1, b: 2, c: 3 });
});

test('handles "props" option for validation', () => {
    const validate = jest.fn();
    validate.mockReturnValue([ { error: 'violation' } ]);

    const factory = { create: jest.fn() };
    factory.create.mockReturnValue({ validate });

    const type = ObjectType(factory);
    const data = { a: 1, b: 2, c: 3 };
    const violations = type.validate(data, { props: { a: 'type', b: 'type' } });

    expect(validate.mock.calls.length).toBe(2);
    expect(validate.mock.calls[ 0 ][ 0 ]).toBe(1);
    expect(validate.mock.calls[ 1 ][ 0 ]).toBe(2);
    expect(violations).toEqual([ { path: [ 'a' ], error: 'violation' }, { path: [ 'b' ], error: 'violation' } ]);
    expect(data).toEqual({ a: 1, b: 2, c: 3 });
});

test('handles "props" option for normalization', () => {
    const normalize = jest.fn();
    normalize.mockReturnValue('normalized value');

    const factory = { create: jest.fn() };
    factory.create.mockReturnValue({ normalize });

    const type = ObjectType(factory);
    const data = { a: 1, b: 2, c: 3 };
    const result = type.normalize(data, { props: { a: 'type', b: 'type' } });

    expect(normalize.mock.calls.length).toBe(2);
    expect(normalize.mock.calls[ 0 ][ 0 ]).toBe(1);
    expect(normalize.mock.calls[ 1 ][ 0 ]).toBe(2);
    expect(result).toEqual({ a: 'normalized value', b: 'normalized value', c: 3 });
    expect(data).toEqual({ a: 1, b: 2, c: 3 });
});
