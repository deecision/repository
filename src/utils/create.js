// @flow

import type { FactoryType, ResolverType } from '../types';

export default function (factory: FactoryType): Function {
    return function create (type: string | Object): ResolverType {
        if (typeof type === 'string') {
            return factory.create(type);
        }

        if (typeof type === 'object') {
            const typeName = type.type;

            if (! typeName) {
                throw new Error('Tried to create a resolver without type.');
            }

            const options = Object.assign({}, type);
            delete options.type;

            return factory.create(typeName, options);
        }

        throw new Error('Tried to create a resolver with invalid type.');
    };
}
