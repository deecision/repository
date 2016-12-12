// @flow

import type { ExtensionType, ViolationType } from '../types';

export default function (): ExtensionType {
    return {
        type: 'number',
        parents: [ 'base' ],

        validate (data: any, options?: Object): ViolationType[] {
            if (data === undefined || data === null) {
                return [];
            }

            if (typeof data !== 'number') {
                return [ { error: 'wrong_type' } ];
            }

            if (! options) {
                return [];
            }

            const violations = [];

            if (Array.isArray(options.range)) {
                if (data < (options.range.length > 0 ? options.range[ 0 ] : 0)) {
                    violations.push({ error: 'too_small' });
                }

                if (data > (options.range.length > 1 ? options.range[ 1 ] : Infinity)) {
                    violations.push({ error: 'too_big' });
                }
            }

            return violations;
        },
    };
}
