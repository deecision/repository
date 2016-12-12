// @flow

import type { ExtensionType, IndexType, ResolverType } from './types';

import Registry from './registry';
import Factory from './factory';

import ArrayExtension from './extensions/array';
import BaseExtension from './extensions/base';
import BooleanExtension from './extensions/boolean';
import NumberExtension from './extensions/number';
import ObjectExtension from './extensions/object';
import StringExtension from './extensions/string';

const registry = Registry();
const factory = Factory(registry);

registry.register(ArrayExtension(factory));
registry.register(BaseExtension());
registry.register(BooleanExtension());
registry.register(NumberExtension());
registry.register(ObjectExtension(factory));
registry.register(StringExtension());

const index: IndexType = {
    register (extension: ExtensionType): IndexType {
        registry.register(extension);
        return this;
    },

    create (type: string | ExtensionType, options?: Object): ResolverType {
        return factory.create(type, options);
    },
};

export default index;
