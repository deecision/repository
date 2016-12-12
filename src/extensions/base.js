// @flow

import type { ExtensionType, ViolationType } from '../types';

export default function (): ExtensionType {
    return {
        type: 'base',

        read (data: any, options?: Object): any {
            if (data === undefined && typeof options === 'object' && options.hasOwnProperty('default')) {
                return options.default;
            }

            return data;
        },

        validate (data: any, options?: Object): ViolationType[] {
            if ((data === undefined || data === null) && typeof options === 'object' && options.required) {
                return [ { error: 'not_set' } ];
            }

            return [];
        },
    };
}
