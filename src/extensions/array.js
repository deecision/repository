// @flow

import type { ExtensionType, FactoryType, ViolationType } from '../types';

import Create from '../utils/create';

export default function (factory: FactoryType): ExtensionType {
    const create = Create(factory);

    return {
        type: 'array',
        parents: [ 'base' ],

        read (data: any, options?: Object): any {
            if (Array.isArray(data) && options && options.proto) {
                const prototype = create(options.proto);

                // input data must no be modified
                return data.map(value => prototype.read(value));
            }

            return data;
        },

        validate (data: any, options?: Object): ViolationType[] {
            if (data === undefined || data === null) {
                return [];
            }

            if (! Array.isArray(data)) {
                return [ { error: 'wrong_type' } ];
            }

            if (! options) {
                return [];
            }

            const violations = [];

            if (typeof options.length === 'number' && options.length !== data.length) {
                violations.push({ error: 'wrong_length' });
            }

            if (Array.isArray(options.length)) {
                if (data.length < (options.length.length > 0 ? options.length[ 0 ] : 0)) {
                    violations.push({ error: 'too_short' });
                }

                if (data.length > (options.length.length > 1 ? options.length[ 1 ] : Infinity)) {
                    violations.push({ error: 'too_long' });
                }
            }

            if (options.proto) {
                const prototype = create(options.proto);

                data.forEach((value, index) => {
                    prototype.validate(value).forEach((violation) => {
                        violations.push({
                            path: [ index ].concat(violation.path || []),
                            error: violation.error,
                        });
                    });
                });
            }

            return violations;
        },

        normalize (data: any, options?: Object): any {
            if (Array.isArray(data) && options && options.proto) {
                const prototype = create(options.proto);

                // input data must no be modified
                return data.map(value => prototype.normalize(value));
            }

            return data;
        },
    };
}
