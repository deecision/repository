// @flow

import type { ExtensionType, FactoryType, ViolationType } from '../types';

import Create from '../utils/create';

export default function (factory: FactoryType): ExtensionType {
    const create = Create(factory);

    return {
        type: 'object',
        parents: [ 'base' ],

        read (data: any, options?: Object): any {
            if (typeof data === 'object' && options && typeof options.props === 'object') {
                const changes = {};

                Object.keys(options.props).forEach((prop) => {
                    const resolver = create(options.props[ prop ]);
                    changes[ prop ] = resolver.read(data[ prop ]);
                });

                return Object.assign({}, data, changes);
            }

            return data;
        },

        validate (data: any, options?: Object): ViolationType[] {
            if (data === undefined || data === null) {
                return [];
            }

            if (typeof data !== 'object' || Array.isArray(data)) {
                return [ { error: 'wrong_type' } ];
            }

            if (! options) {
                return [];
            }

            const violations = [];

            if (typeof options.props === 'object') {
                Object.keys(options.props).forEach((prop) => {
                    const resolver = create(options.props[ prop ]);
                    resolver.validate(data[ prop ]).forEach((violation) => {
                        violations.push({
                            path: ([ prop ]).concat(violation.path || []),
                            error: violation.error,
                        });
                    });
                });
            }

            return violations;
        },

        normalize (data: any, options?: Object): any {
            if (typeof data === 'object' && options && typeof options.props === 'object') {
                const changes = {};

                Object.keys(options.props).forEach((prop) => {
                    const resolver = create(options.props[ prop ]);
                    changes[ prop ] = resolver.normalize(data[ prop ]);
                });

                return Object.assign({}, data, changes);
            }

            return data;
        },
    };
}
