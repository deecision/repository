import NumberType from '../number';

test('validates null, undefined or number data', () => {
    const type = NumberType();
    expect(type.validate(null)).toEqual([]);
    expect(type.validate(undefined)).toEqual([]);
    expect(type.validate(0)).toEqual([]);
    expect(type.validate(12.5)).toEqual([]);
});

test('invalidates non null, undefined or number data', () => {
    const type = NumberType();
    expect(type.validate('test')).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate(true)).toEqual([ { error: 'wrong_type' } ]);
    expect(type.validate({})).toEqual([ { error: 'wrong_type' } ]);
});

test('handles "range" option as array', () => {
    const type = NumberType();
    expect(type.validate(0, { range: [ 1 ] })).toEqual([ { error: 'too_small' } ]);
    expect(type.validate(10, { range: [ 0, 9 ] })).toEqual([ { error: 'too_big' } ]);
    expect(type.validate(10, { range: [ 0, 10 ] })).toEqual([]);
});
