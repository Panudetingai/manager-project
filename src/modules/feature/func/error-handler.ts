export function errorHandler(error: unknown) {
    if (error === null) {
        return "An unknown error occurred.";
    }

    if (typeof error === 'string') {
        return error;
    }


    if (error instanceof Error) {
        return error.message;
    }

    return JSON.stringify(error);
}