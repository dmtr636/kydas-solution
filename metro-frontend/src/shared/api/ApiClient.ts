import axios from "axios";
import { ApiException, ApiExceptionCode } from "src/shared/api/ApiException.ts";
import {
    defaultExceptionCodeLocalization,
    errorLocalization,
} from "src/shared/locale/errorLocalization.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { ApiResponse } from "src/shared/api/ApiResponse.ts";

export type ExceptionCodeLocalization = Partial<Record<ApiExceptionCode, string>>;

export class ApiClient {
    private readonly exceptionCodeLocalization: ExceptionCodeLocalization;
    private readonly disableSnackbar;

    constructor(params?: {
        exceptionCodeLocalization?: ExceptionCodeLocalization;
        disableSnackbar?: boolean;
    }) {
        this.exceptionCodeLocalization = {
            ...defaultExceptionCodeLocalization,
            ...params?.exceptionCodeLocalization,
        };
        this.disableSnackbar = params?.disableSnackbar ?? false;
    }

    async post<T>(endpoint: string, data?: object | object[]): Promise<ApiResponse<T>> {
        try {
            const response = await axios.post<T>(endpoint, data);
            return {
                data: response.data,
                status: true,
            };
        } catch (error) {
            const errorData = this.handleError(error);
            return {
                error: errorData?.error,
                status: false,
            };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await axios.get<T>(endpoint);
            return {
                data: response.data,
                status: true,
            };
        } catch (error) {
            const errorData = this.handleError(error);
            return {
                error: errorData?.error,
                status: false,
            };
        }
    }

    async put<T>(endpoint: string, data?: object | object[]): Promise<ApiResponse<T>> {
        try {
            const response = await axios.put<T>(endpoint, data);
            return {
                data: response.data,
                status: true,
            };
        } catch (error) {
            const errorData = this.handleError(error);
            return {
                error: errorData?.error,
                status: false,
            };
        }
    }

    async delete(endpoint: string, id: string | number): Promise<ApiResponse<null>> {
        try {
            const response = await axios.delete(endpoint + "/" + id);
            return {
                data: response.data,
                status: true,
            };
        } catch (error) {
            const errorData = this.handleError(error);
            return {
                error: errorData?.error,
                status: false,
            };
        }
    }

    private handleError(error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorData = error.response?.data;
            if (this.isApiException(errorData)) {
                this.handleApiException(errorData);
                return errorData;
            } else {
                if (!this.disableSnackbar) {
                    snackbarStore.showNegativeSnackbar(errorLocalization.requestFailed);
                }
            }
        } else {
            console.error(error);
            if (!this.disableSnackbar) {
                snackbarStore.showNegativeSnackbar(errorLocalization.unknownError);
            }
        }
    }

    private isApiException(data: { error?: { code?: string } }): data is ApiException {
        return !!data?.error?.code;
    }

    private handleApiException(apiException: ApiException) {
        const message =
            this.exceptionCodeLocalization[apiException.error.code] ??
            errorLocalization.unknownError;
        if (!this.disableSnackbar) {
            snackbarStore.showNegativeSnackbar(message);
        }
    }
}
