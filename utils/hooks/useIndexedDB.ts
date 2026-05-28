"use client"
import { useState, useEffect, useCallback } from "react";

type DataBase = IDBDatabase | null;

const useIndexedDB = <T>(databaseName: string, storeName: string, version: number, primaryKeyFieldName: string) => {

    const [isReady, setIsReady] = useState(false);
    const [database, setDatabase] = useState<DataBase>(null);
    const [error, setError] = useState<Error | null>(() => {
        if (typeof window !== "undefined" && !window.indexedDB) return new Error("DBnotSupported");
        return null;
    });

    useEffect(() => {
        if (error) return;

        const openRequest = indexedDB.open(databaseName, version);
        let auxDatabase: DataBase = null;

        openRequest.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: primaryKeyFieldName });
            }
        };

        openRequest.onsuccess = (event) => {
            auxDatabase = (event.target as IDBOpenDBRequest).result;
            setDatabase(auxDatabase);
            setIsReady(true);
        };

        openRequest.onerror = () => {
            setError(openRequest.error ?? new Error("databaseError"));
            setIsReady(false);
        };

        return () => {
            if (auxDatabase) {
                auxDatabase.close();
            }
        };
    }, [error, databaseName, storeName, version, primaryKeyFieldName]);

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