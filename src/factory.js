// @flow

import type { ExtensionType, FactoryType, RegistryType, ResolverType } from './types';

export default function (registry: RegistryType): FactoryType {
    return {
        create (type: string | ExtensionType, options?: Object): ResolverType {
            const readers = [];
            const validators = [];
            const normalizers = [];

            registry.resolve(type).forEach((extension) => {
                const extensionRead = extension.read;
                if (extensionRead) readers.push(data => extensionRead(data, options));

                const extensionValidate = extension.validate;
                if (extensionValidate) validators.push(data => extensionValidate(data, options));

                const extensionNormalize = extension.normalize;
                if (extensionNormalize) normalizers.push(data => extensionNormalize(data, options));
            });

            const read = (data: any) => {
                let result = data;

                readers.forEach((localRead) => {
                    result = localRead(result);
                });

                return result;
            };

            const validate = (data: any) => {
                let violations = [];

                validators.forEach((localValidate) => {
                    violations = violations.concat(localValidate(data));
                });

                return violations;
            };

            const normalize = (data: any) => {
                let result = data;

                normalizers.forEach((localNormalize) => {
                    result = localNormalize(result);
                });

                return result;
            };

            const resolve = (data: any) => {
                const result = read(data);
                const violations = validate(result);

                if (violations.length) {
                    throw violations;
                }

                return normalize(data);
            };

            return { read, validate, normalize, resolve };
        },
    };
}
