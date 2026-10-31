import { describe, expect, it } from 'vitest';
import { emptyData } from './logic';
import { parseBackup, serializeData } from './backup';
import { CORRUPT_PREFIX, MEMORY_WARNING, STORAGE_KEY, UNDO_KEY, quarantineStored, readStored, writeImport, writeUndo, type StoragePort } from './storage';

function fakeStorage() {
  const items = new Map<string, string>(); const writes: string[] = [];
  const storage: StoragePort = { getItem: key => items.get(key) ?? null, setItem: (key, value) => { writes.push(key); items.set(key, value); }, removeItem: key => { items.delete(key); } };
  return { storage, items, writes };
}
describe('lưu trữ và phục hồi', () => {
  it('đọc bình thường không ghi, dữ liệu và hoàn tác sống qua tải lại', () => {
    const { storage, items, writes } = fakeStorage(); const old = emptyData(); const incoming = { ...emptyData(), rates: { ...old.rates, seo: 90000 } };
    items.set(STORAGE_KEY, serializeData(old));
    expect(readStored(storage).data).toEqual(old); expect(writes).toEqual([]);
    writeImport(storage, old, incoming);
    expect(writes).toEqual([UNDO_KEY, STORAGE_KEY]);
    expect(readStored(storage).data).toEqual(incoming); expect(readStored(storage).undo).toEqual(old);
    writeUndo(storage, old); expect(readStored(storage).data).toEqual(old); expect(items.has(UNDO_KEY)).toBe(false);
  });
  it.each(['{broken', JSON.stringify({ schemaVersion: 9 })])('sao lưu bản gốc %s trước khi khởi tạo mới', raw => {
    const { storage, items, writes } = fakeStorage(); items.set(STORAGE_KEY, raw);
    const state = readStored(storage); expect(state.corruptRaw).toBe(raw); expect(items.get(STORAGE_KEY)).toBe(raw); expect(writes).toEqual([]);
    const key = quarantineStored(storage, raw, 123);
    expect(key.startsWith(CORRUPT_PREFIX)).toBe(true); expect(items.get(key)).toBe(raw);
    expect(parseBackup(items.get(STORAGE_KEY)!)).toEqual(emptyData()); expect(writes).toEqual([key, STORAGE_KEY]);
  });
  it('không ghi đè bản sao hỏng trước đó', () => { const { storage, items } = fakeStorage(); items.set(STORAGE_KEY, 'bad'); items.set(`${CORRUPT_PREFIX}123-0`, 'prior'); const key = quarantineStored(storage, 'bad', 123); expect(key).toBe(`${CORRUPT_PREFIX}123-1`); expect(items.get(`${CORRUPT_PREFIX}123-0`)).toBe('prior'); });
  it('không đụng khóa chính nếu không sao lưu được dữ liệu hỏng', () => { const { storage, items } = fakeStorage(); items.set(STORAGE_KEY, 'bad'); storage.setItem = () => { throw new Error('Quota'); }; expect(() => quarantineStored(storage, 'bad')).toThrow(); expect(items.get(STORAGE_KEY)).toBe('bad'); });
  it('không thay khóa chính nếu bản sao trước nhập không lưu được', () => { const { storage, items } = fakeStorage(); const original = serializeData(emptyData()); items.set(STORAGE_KEY, original); storage.setItem = () => { throw new Error('Quota'); }; expect(() => writeImport(storage, emptyData(), emptyData())).toThrow(); expect(items.get(STORAGE_KEY)).toBe(original); });
  it('nếu ghi dữ liệu nhập thất bại thì bản sao cũ đã an toàn', () => { const { storage, items } = fakeStorage(); const data = emptyData(); const initial = serializeData(data); items.set(STORAGE_KEY, initial); const set = storage.setItem; storage.setItem = (key, value) => { if (key === STORAGE_KEY) throw new Error('Quota'); set(key, value); }; expect(() => writeImport(storage, data, { ...data, rates: { ...data.rates, seo: 90000 } })).toThrow(); expect(items.get(STORAGE_KEY)).toBe(initial); expect(parseBackup(items.get(UNDO_KEY)!)).toEqual(data); });
  it('lưu trữ bị chặn vẫn trả dữ liệu trống và cảnh báo xuất file', () => { const { storage } = fakeStorage(); storage.getItem = () => { throw new Error('Blocked'); }; const state = readStored(storage); expect(state.data).toEqual(emptyData()); expect(state.canPersist).toBe(false); expect(state.notice).toContain(MEMORY_WARNING); });
  it('không ghi đè dữ liệu mà tab khác vừa sửa', () => { const { storage, items } = fakeStorage(); items.set(STORAGE_KEY, serializeData(emptyData())); expect(() => quarantineStored(storage, 'old broken text', 123)).toThrow('trang khác'); expect(parseBackup(items.get(STORAGE_KEY)!)).toEqual(emptyData()); });
});
