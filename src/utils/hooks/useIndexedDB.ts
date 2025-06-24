import { useState, useEffect, useCallback } from "react";

const useIndexedDB = <T>(databaseName: string, storeName: string, version: number, keyPath: string) => {

    const [isReady, setIsReady] = useState(false);
    const [database, setDatabase] = useState<IDBDatabase | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!window.indexedDB) {
            setError(new Error("DBnotSupported"));
            return;
        }

        const openRequest = indexedDB.open(databaseName, version);

        openRequest.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath, autoIncrement: true });
            }
        };

        openRequest.onsuccess = (event) => {
            setDatabase((event.target as IDBOpenDBRequest).result);
            setIsReady(true);
        };
        
        openRequest.onerror = () => {
            setError(openRequest.error ?? new Error("databaseError"));
            setIsReady(false);
        };

        return () => {
            if (database) {
                database.close();
            }
        };
    }, [databaseName, storeName, version, keyPath]);

    const getAllItems = useCallback((): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            if (!database) {
                reject(new Error("databaseError"));
                return;
            }

            const transaction = database.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as T[]);
            request.onerror = () => reject(request.error);
        });
    }, [database, storeName]);

    const addItem = (item: T): Promise<IDBValidKey> => {
        return new Promise((resolve, reject) => {
            if (!database) {
                reject(new Error("databaseError"));
                return;
            }

            const transaction = database.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.add(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const updateItem = (item: T): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!database) {
                reject(new Error("databaseError"));
                return;
            }

            const transaction = database.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.put(item);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    };

    const deleteItem = (id: IDBValidKey): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!database) {
                reject(new Error("databaseError"));
                return;
            }

            const transaction = database.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    };

    return {
        getAllItems,
        addItem,
        updateItem,
        deleteItem,
        error,
        isReady,
    };
}

export default useIndexedDB;