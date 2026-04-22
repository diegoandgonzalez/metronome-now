import { useSession } from 'next-auth/react';
import { GoogleDriveFileList, FileToCreate } from '@/utils/types';
import useSnackbarContext from '@/components/snackbar/useSnackbarContext';
import { useTranslations } from 'next-intl';

const DRIVE_API = 'https://www.googleapis.com/drive/v3'; // TODO
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';  // TODO


const useDriveAppData = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    const {
        handleOpen: handleOpenSnackbar,
    } = useSnackbarContext();

    const t = useTranslations();

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const runAndHandleError = async <T>(fn: () => Promise<T>): Promise<T | null> => {
        try {
            const result = await fn();
            return result;
        } catch (err) {
            handleOpenSnackbar(t('errorOcurred'));
            console.error(err instanceof Error ? err : new Error(String(err)));
            return null;
        }
    }

    const listFiles = async () => {
        return runAndHandleError(async () => {
            const res = await fetch(`${DRIVE_API}/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)`, { headers });
            const data = await res.json();
            return data.files as GoogleDriveFileList;
        });
    }

    const readAllFiles = async () => {
        return runAndHandleError(async () => {
            const files = await listFiles();
            if (!files?.length) return [];

            const results = await Promise.all(
                files.map(async (file) => {
                    const res = await fetch(`${DRIVE_API}/files/${file.id}?alt=media`, { headers });
                    const text = await res.text();
                    let content;
                    try {
                        content = JSON.parse(text);
                    } catch {
                        content = text;
                    }

                    return { ...file, content };
                })
            );

            return results;
        });
    };

    const writeFile = async (newFile: FileToCreate) => {
        const { name, content } = newFile;
        const body = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;

        return runAndHandleError(async () => {
            const blob = new Blob([body], { type: 'text/plain' });
            const files = await listFiles();
            const isOverwrite = files?.find((file) => file.name === name);

            if (isOverwrite) {
                await fetch(`${UPLOAD_API}/files/${isOverwrite.id}?uploadType=media`, {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${token}` },
                    body: blob,
                });
                return;
            }

            const meta = JSON.stringify({ name: name, parents: ['appDataFolder'] });
            const form = new FormData();
            form.append('metadata', new Blob([meta], { type: 'application/json' }));
            form.append('file', blob);
            await fetch(`${UPLOAD_API}/files?uploadType=multipart`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });
        });
    }

    const deleteFile = async (name: string) => {
        return runAndHandleError(async () => {
            const files = await listFiles();
            const file = files?.find((f) => f.name === name);
            if (!file) return;
            await fetch(`${DRIVE_API}/files/${file.id}`, { method: 'DELETE', headers });
        });
    }

    return {
        isReady: Boolean(token),
        readAllFiles,
        writeFile,
        deleteFile,
    };
}

export default useDriveAppData;