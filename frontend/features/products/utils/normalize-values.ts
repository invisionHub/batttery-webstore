export const normalizeValue = (
    value: string | undefined | null
) => (value ?? '').trim().toLowerCase();