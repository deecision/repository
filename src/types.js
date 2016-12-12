// @flow

export type ViolationType = {
    path?: (string | number)[],
    error: string,
};

export type ResolverType = {
    read: (data: any) => any,
    validate: (data: any) => ViolationType[],
    normalize: (data: any) => any,
    resolve: (data: any) => any,
};

export type ExtensionType = {
    type?: string,
    parents?: string[],
    targets?: string[],
    read?: (data: any, options?: Object) => any,
    validate?: (data: any, options?: Object) => ViolationType[],
    normalize?: (data: any, options?: Object) => any,
};

export type FactoryType = {
    create: (type: string | ExtensionType, options?: Object) => ResolverType,
};

export type IndexType = {
    register: (extension: ExtensionType) => IndexType,
    create: (type: string | ExtensionType, options?: Object) => ResolverType,
};

export type RegistryType = {
    register: (extension: ExtensionType) => void,
    resolve: (type: string | ExtensionType) => ExtensionType[],
};
