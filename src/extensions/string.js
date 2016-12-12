// @flow

import type { ExtensionType, ViolationType } from '../types';

export default function (): ExtensionType {
    return {
        type: 'string',
        parents: [ 'base' ],

        validate (data: any, options?: Object): ViolationType[] {
            if (data === undefined || data === null) {
                return [];
            }

            if (typeof data !== 'string') {
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

            if (typeof options.pattern === 'object' && ! options.pattern.test(data)) {
                violations.push({ error: 'wrong_format' });
            }

            return violations;
        },
    };
}
