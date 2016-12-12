import Registry from '../registry';

test('throws an error when resolving unregistered type', () => {
    const registry = Registry();
    expect(() => registry.resolve('unregistered')).toThrow();
});

test('throws an error when registering invalid extension', () => {
    const registry = Registry();
    expect(() => registry.register({})).toThrow();
});

test('resolves a single type', () => {
    const registry = Registry();
    registry.register({ type: 'a' });

    expect(registry.resolve('a')).toEqual([
        { type: 'a' },
    ]);
});

test('resolves a type with its parents', () => {
    const registry = Registry();
    registry.register({ type: 'a' });
    registry.register({ type: 'b' });
    registry.register({ type: 'c', parents: [ 'a' ] });
    registry.register({ type: 'd', parents: [ 'a', 'b' ] });

    expect(registry.resolve('c')).toEqual([
        { type: 'a' },
        { type: 'c', parents: [ 'a' ] },
    ]);

    expect(registry.resolve('d')).toEqual([
        { type: 'a' },
        { type: 'b' },
        { type: 'd', parents: [ 'a', 'b' ] },
    ]);
});

test('resolves a type with its parent\'s parents', () => {
    const registry = Registry();
    registry.register({ type: 'a' });
    registry.register({ type: 'b', parents: [ 'a' ] });
    registry.register({ type: 'c', parents: [ 'b' ] });
    registry.register({ type: 'd', parents: [ 'b', 'c' ] });

    expect(registry.resolve('c')).toEqual([
        { type: 'a' },
        { type: 'b', parents: [ 'a' ] },
        { type: 'c', parents: [ 'b' ] },
    ]);

    expect(registry.resolve('d')).toEqual([
        { type: 'a' },
        { type: 'b', parents: [ 'a' ] },
        // { type: 'a' },
        // { type: 'b', parents: [ 'a' ] },
        { type: 'c', parents: [ 'b' ] },
        { type: 'd', parents: [ 'b', 'c' ] },
    ]);
});

test('resolves a type with its extensions', () => {
    const registry = Registry();
    registry.register({ type: 'a' });
    registry.register({ type: 'b' });
    registry.register({ type: 'c', targets: [ 'a', 'b' ] });
    registry.register({ type: 'd', targets: [ 'b' ] });

    expect(registry.resolve('a')).toEqual([
        { type: 'a' },
        { type: 'c', targets: [ 'a', 'b' ] },
    ]);

    expect(registry.resolve('b')).toEqual([
        { type: 'b' },
        { type: 'c', targets: [ 'a', 'b' ] },
        { type: 'd', targets: [ 'b' ] },
    ]);
});


test('resolves a type with its extension\'s extensions', () => {
    const registry = Registry();
    registry.register({ type: 'a' });
    registry.register({ type: 'b', targets: [ 'a' ] });
    registry.register({ type: 'c', targets: [ 'b' ] });
    registry.register({ type: 'd', targets: [ 'a', 'b' ] });

    expect(registry.resolve('a')).toEqual([
        { type: 'a' },
        { type: 'b', targets: [ 'a' ] },
        { type: 'c', targets: [ 'b' ] },
        { type: 'd', targets: [ 'a', 'b' ] },
        // { type: 'd', targets: [ 'a', 'b' ] },
    ]);
});

test('resolves a type with un-typed extensions', () => {
    const registry = Registry();
    registry.register({ type: 'a' });
    registry.register({ targets: [ 'a' ] });

    expect(registry.resolve('a')).toEqual([
        { type: 'a' },
        { targets: [ 'a' ] },
    ]);
});

test('resolves an extension with its parents', () => {
    const registry = Registry();
    registry.register({ type: 'a' });

    expect(registry.resolve({ parents: 'a' })).toEqual([
        { type: 'a' },
        { parents: 'a' },
    ]);
});
