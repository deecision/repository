// @flow

import type { ExtensionType } from '../types';

export default function (): ExtensionType {
    return {
        type: 'boolean',
        parents: [ 'base' ],

        normalize (data: any): any {
            return ! ! data;
        },
    };
}
