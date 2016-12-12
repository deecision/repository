import Resolver from '../index';

test('creates a valid normalizer', () => {
    const resolver = Resolver.create('object', { props: {
        email: { type: 'string', required: true, pattern: /\w+@\w+/ },
        password: { type: 'string', required: true, length: [ 8, Infinity ] },
        remember: { type: 'boolean' },
    } });

    expect(resolver.resolve({ email: 'user@example.com', password: 'hello world', remember: '1' }))
        .toEqual({ email: 'user@example.com', password: 'hello world', remember: true });

    try {
        resolver.resolve({ email: 'invalid', password: 'hello' });
        expect(true).toBe(false);
    } catch (violations) {
        expect(violations).toEqual([
            { path: [ 'email' ], error: 'wrong_format' },
            { path: [ 'password' ], error: 'too_short' },
        ]);
    }
});

test('registers a custom type', () => {
    Resolver.register({
        type: 'test',
        normalize: () => 'output',
    });

    const resolver = Resolver.create('test');
    expect(resolver.resolve('input')).toBe('output');
});
