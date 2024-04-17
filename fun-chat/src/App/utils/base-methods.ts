export function IsUndefinedType<T>(value: T): asserts value is NonNullable<T> {
    if (typeof value === 'undefined') {
        throw Error('Element is undefined');
    }
}

export function isNull<T>(value: T): asserts value is NonNullable<T> {
    if (value === null) {
        throw Error('Element is null');
    }
}
