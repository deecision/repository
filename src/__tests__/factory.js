import Factory from '../factory';

test('created resolver read method calls all resolved types read method', () => {
    const data = {};
    const options = { option1: 'a', option2: 'b' };

    const aRead = jest.fn();
    const bRead = jest.fn();

    aRead.mockReturnValue(data);
    bRead.mockReturnValue(data);

    const registry = { resolve: () => [ { read: aRead }, {}, { read: bRead } ] };
    const factory = Factory(registry);
    const result = factory.create('type', options).read(data);

    [ aRead, bRead ].forEach((method) => {
        expect(method.mock.calls.length).toBe(1);
        expect(method.mock.calls[ 0 ][ 0 ]).toBe(data);
        expect(method.mock.calls[ 0 ][ 1 ]).toBe(options);
    });

    expect(result).toBe(data);
});

test('created resolver validate method calls all resolved types validate method', () => {
    const data = {};
    const options = { option1: 'a', option2: 'b' };

    const aValidate = jest.fn();
    const bValidate = jest.fn();

    aValidate.mockReturnValue([ { type: 'aViolation' } ]);
    bValidate.mockReturnValue([ { type: 'bViolation' } ]);

    const registry = { resolve: () => [ { validate: aValidate }, {}, { validate: bValidate } ] };
    const factory = Factory(registry);
    const violations = factory.create('type', options).validate(data);

    [ aValidate, bValidate ].forEach((method) => {
        expect(method.mock.calls.length).toBe(1);
        expect(method.mock.calls[ 0 ][ 0 ]).toBe(data);
        expect(method.mock.calls[ 0 ][ 1 ]).toBe(options);
    });

    expect(violations).toEqual([ { type: 'aViolation' }, { type: 'bViolation' } ]);
});

test('created resolver normalize method calls all resolved types normalize method', () => {
    const data = {};
    const options = { option1: 'a', option2: 'b' };

    const aNormalize = jest.fn();
    const bNormalize = jest.fn();

    aNormalize.mockReturnValue(data);
    bNormalize.mockReturnValue(data);

    const registry = { resolve: () => [ { normalize: aNormalize }, {}, { normalize: bNormalize } ] };
    const factory = Factory(registry);
    const result = factory.create('type', options).normalize(data);

    [ aNormalize, bNormalize ].forEach((method) => {
        expect(method.mock.calls.length).toBe(1);
        expect(method.mock.calls[ 0 ][ 0 ]).toBe(data);
        expect(method.mock.calls[ 0 ][ 1 ]).toBe(options);
    });

    expect(result).toBe(data);
});

test('created resolver resolve method calls all resolved types read + validate + normalize method', () => {
    const data = {};
    const options = { option1: 'a', option2: 'b' };

    const aType = { read: jest.fn(), validate: jest.fn() };
    const bType = { read: jest.fn(), normalize: jest.fn() };
    const cType = { validate: jest.fn(), normalize: jest.fn() };

    aType.read.mockReturnValue(data);
    aType.validate.mockReturnValue([]);
    bType.read.mockReturnValue(data);
    bType.normalize.mockReturnValue(data);
    cType.validate.mockReturnValue([]);
    cType.normalize.mockReturnValue(data);

    const registry = { resolve: () => [ aType, bType, cType ] };
    const factory = Factory(registry);
    const result = factory.create('type', options).resolve(data);

    [ aType.read, aType.validate, bType.read, bType.normalize, cType.validate, cType.normalize ].forEach((method) => {
        expect(method.mock.calls.length).toBe(1);
        expect(method.mock.calls[ 0 ][ 0 ]).toBe(data);
        expect(method.mock.calls[ 0 ][ 1 ]).toBe(options);
    });

    expect(result).toBe(data);
});

test('created resolver resolve method throws violations if any', () => {
    const data = {};
    const options = { option1: 'a', option2: 'b' };

    const aType = { read: jest.fn(), validate: jest.fn() };
    const bType = { read: jest.fn(), normalize: jest.fn() };
    const cType = { validate: jest.fn(), normalize: jest.fn() };

    aType.read.mockReturnValue(data);
    aType.validate.mockReturnValue([ { type: 'aViolation' } ]);
    bType.read.mockReturnValue(data);
    bType.normalize.mockReturnValue(data);
    cType.validate.mockReturnValue([ { type: 'cViolation' } ]);
    cType.normalize.mockReturnValue(data);

    const registry = { resolve: () => [ aType, bType, cType ] };
    const factory = Factory(registry);

    try {
        factory.create('type', options).resolve(data);
        expect(true).toBe(false);
    } catch (violations) {
        expect(violations).toEqual([ { type: 'aViolation' }, { type: 'cViolation' } ]);
    }

    [ aType.read, aType.validate, bType.read, cType.validate ].forEach((method) => {
        expect(method.mock.calls.length).toBe(1);
        expect(method.mock.calls[ 0 ][ 0 ]).toBe(data);
        expect(method.mock.calls[ 0 ][ 1 ]).toBe(options);
    });

    [ bType.normalize, cType.normalize ].forEach((method) => {
        expect(method.mock.calls.length).toBe(0);
    });
});
