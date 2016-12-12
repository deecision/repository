// @flow

import type { ExtensionType, RegistryType } from './types';

export default function (): RegistryType {
    const types = {};
    const extensions = {};

    const register = (extension: ExtensionType): void => {
        if (! extension.type && (! extension.targets || ! extension.targets.length)) {
            throw new Error(
                'Registered invalid extension, an extension must defined a type or a non empty list of targets.',
            );
        }

        if (extension.type) {
            types[ extension.type ] = extension;
        }

        if (extension.targets && extension.targets.length) {
            extension.targets.forEach((target) => {
                if (! extensions.hasOwnProperty(target)) {
                    extensions[ target ] = [];
                }

                extensions[ target ].push(extension);
            });
        }
    };

    const resolve = (type: string | ExtensionType): ExtensionType[] => {
        if (typeof type === 'string' && ! types.hasOwnProperty(type)) {
            throw new Error(`Tried to resolve non registered type "${type}".`);
        }

        const root = typeof type === 'string' ? types[ type ] : type;

        let stack = [];

        if (root.parents) {
            root.parents.forEach((parent) => {
                stack = stack.concat(resolve(parent));
            });
        }

        stack.push(root);

        if (root.type && extensions[ root.type ]) {
            extensions[ root.type ].forEach((extension) => {
                stack = stack.concat(resolve(extension));
            });
        }

        const results = [];

        stack.forEach((extension) => {
            if (! results.includes(extension)) {
                results.push(extension);
            }
        });

        return results;
    };

    return { register, resolve };
}
