import { emptyData, normalize, type Data } from './logic';
import { parseBackup, serializeData, validateData } from './backup';

export const STORAGE_KEY = 'cham-cong-ca-nhan:v1';
export const UNDO_KEY = 'cham-cong-ca-nhan:before-import:v1';
export const CORRUPT_PREFIX = 'cham-cong-ca-nhan:corrupt:';
export const MEMORY_WARNING = 'Dữ liệu sẽ mất khi đóng trang, hãy xuất file sao lưu';
export type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export type StoredState = { data: Data; undo: Data | null; canPersist: boolean; notice: string; corruptRaw: string | null; corruptUndoRaw: string | null };

export function memoryState(): StoredState {
  return { data: emptyData(), undo: null, canPersist: false, notice: `Trình duyệt không cho lưu trữ. ${MEMORY_WARNING}`, corruptRaw: null, corruptUndoRaw: null };
}

// Read-only initialization: StrictMode may call this twice without any writes.
export function readStored(storage: StoragePort): StoredState {
  let raw: string | null;
  try { raw = storage.getItem(STORAGE_KEY); } catch { return memoryState(); }
  const state: StoredState = { data: emptyData(), undo: null, canPersist: true, notice: '', corruptRaw: null, corruptUndoRaw: null };
  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw);
      // Retain the supported legacy migration; file imports always require v1.
      state.data = parsed?.schemaVersion === undefined || parsed?.schemaVersion === 0 ? validateData(normalize(parsed)) : parseBackup(raw);
    } catch (error) {
      state.corruptRaw = raw;
      state.canPersist = false;
      state.notice = `Không nhận dữ liệu đã lưu: ${error instanceof Error ? error.message : 'Dữ liệu không hợp lệ.'}`;
    }
  }
  let undo: string | null = null;
  try {
    undo = storage.getItem(UNDO_KEY);
    if (undo !== null) state.undo = parseBackup(undo);
  } catch (error) {
    state.corruptUndoRaw = undo;
    state.notice += ` Không nhận bản hoàn tác: ${error instanceof Error ? error.message : 'Dữ liệu không hợp lệ.'}`;
  }
  return state;
}

// Copy and verify before replacing the original key. Never overwrite a prior archive.
export function quarantineStored(storage: StoragePort, raw: string, now = Date.now(), sourceKey = STORAGE_KEY): string {
  let index = 0;
  let key: string;
  do { key = `${CORRUPT_PREFIX}${now}-${index++}`; } while (storage.getItem(key) !== null);
  storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) throw new Error('Không xác minh được bản sao dữ liệu hỏng.');
  // A second tab might have repaired the main key while this page initialized.
  if (storage.getItem(sourceKey) !== raw) throw new Error('Dữ liệu lưu đã thay đổi ở trang khác. Hãy tải lại trang.');
  if (sourceKey === STORAGE_KEY) storage.setItem(sourceKey, serializeData(emptyData()));
  else storage.removeItem(sourceKey);
  return key;
}

export function writeStored(storage: StoragePort, data: Data) {
  storage.setItem(STORAGE_KEY, serializeData(data));
}
export function writeImport(storage: StoragePort, previous: Data, incoming: Data) {
  const incomingText = serializeData(incoming);
  const oldText = serializeData(previous);
  storage.setItem(UNDO_KEY, oldText);
  if (storage.getItem(UNDO_KEY) !== oldText) throw new Error('Không xác minh được bản sao trước khi nhập.');
  storage.setItem(STORAGE_KEY, incomingText);
}
export function writeUndo(storage: StoragePort, data: Data) {
  writeStored(storage, data);
  storage.removeItem(UNDO_KEY);
}
