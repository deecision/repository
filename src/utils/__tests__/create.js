import Create from '../create';

test('throws an error when type not string or object', () => {
    const create = Create({});
    expect(() => create(12)).toThrow();
});

test('throws an error when type object has no type', () => {
    const create = Create({});
    expect(() => create({})).toThrow();
});

test('creates a type from a string', () => {
    const factory = { create: jest.fn() };
    const create = Create(factory);
    create('a');

    expect(factory.create.mock.calls.length).toBe(1);
    expect(factory.create.mock.calls[ 0 ][ 0 ]).toBe('a');
    expect(factory.create.mock.calls[ 0 ][ 1 ]).toBe(undefined);
});

test('creates a type from an object', () => {
    const factory = { create: jest.fn() };
    const create = Create(factory);
    create({ type: 'a', option1: 'b', option2: 'c' });

    expect(factory.create.mock.calls.length).toBe(1);
    expect(factory.create.mock.calls[ 0 ][ 0 ]).toBe('a');
    expect(factory.create.mock.calls[ 0 ][ 1 ]).toEqual({ option1: 'b', option2: 'c' });
});
