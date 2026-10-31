import { useEffect, useRef, useState } from 'react';
import { DEFAULT_RATES, emptyDay, type Data, type Day, type Rates, type Session, type Shoot } from './logic';
import { latestPlaceKm, parseKm } from './shooting';
import { parseRate, validateData } from './backup';
import { MEMORY_WARNING, UNDO_KEY, memoryState, quarantineStored, readStored, writeImport, writeStored, writeUndo, type StoredState } from './storage';
import { assertKm, assertShootCount, RATE_LIMIT_MESSAGE } from './limits';

export type OperationResult = { ok: boolean; message: string };
export type ShootKmResult = { shoot: Shoot | null; message: string };
const idsFor = (data: Data, revision: number) => Object.fromEntries(Object.entries(data.days).map(([key, day]) => [key, day.shoots.map((_, index) => `saved-${revision}-${key}-${index}`)]));

function load(): StoredState {
  try { return readStored(window.localStorage); } catch { return memoryState(); }
}

// The only data-writing entry point. No writes on mount, render or keystrokes.
export function useAttendance() {
  const [snapshot, setSnapshot] = useState(() => {
    const loaded = load();
    return { ...loaded, shootIds: idsFor(loaded.data, 0), revision: 0, dataNotice: '' };
  });
  const current = useRef(snapshot);
  const nextId = useRef(0);
  const initialized = useRef(false);

  function publish(next: typeof snapshot) {
    current.current = next;
    setSnapshot(next);
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const previous = current.current;
    if (previous.corruptRaw === null && previous.corruptUndoRaw === null) return;
    let next = previous;
    if (previous.corruptRaw !== null) {
      try {
        const key = quarantineStored(window.localStorage, previous.corruptRaw);
        next = { ...next, corruptRaw: null, canPersist: true, notice: `${previous.notice} Bản gốc đã được giữ nguyên tại khóa sao lưu ${key}. Đã khởi tạo dữ liệu mới.` };
      } catch {
        next = { ...next, canPersist: false, notice: `${previous.notice} Không thể hoàn tất sao lưu; khóa gốc vẫn được giữ nguyên. ${MEMORY_WARNING}` };
      }
    }
    if (previous.corruptUndoRaw !== null) {
      try {
        const key = quarantineStored(window.localStorage, previous.corruptUndoRaw, Date.now(), UNDO_KEY);
        next = { ...next, corruptUndoRaw: null, notice: `${next.notice} Bản hoàn tác không hợp lệ đã được giữ nguyên tại khóa sao lưu ${key}.` };
      } catch {
        next = { ...next, canPersist: false, notice: `${next.notice} Khóa hoàn tác gốc vẫn được giữ nguyên. ${MEMORY_WARNING}` };
      }
    }
    publish(next);
  }, []);

  function reject(error: unknown): false {
    publish({ ...current.current, dataNotice: error instanceof Error ? error.message : 'Dữ liệu không hợp lệ; đã giữ dữ liệu trước đó.' });
    return false;
  }

  function persist(next: typeof snapshot, write: () => void): boolean {
    // Validate before disk writes AND memory updates; a storage error must not bypass limits.
    try { validateData(next.data); } catch (error) { return reject(error); }
    if (current.current.canPersist) {
      try { write(); } catch {
        next = { ...next, canPersist: false, notice: `Không thể lưu vào trình duyệt. ${MEMORY_WARNING}` };
      }
    }
    publish({ ...next, dataNotice: '' });
    return true;
  }

  function commitDay(key: string, nextDay: Day, ids = current.current.shootIds[key] ?? []) {
    const previous = current.current;
    const days = { ...previous.data.days };
    const shootIds = { ...previous.shootIds, [key]: ids };
    if (nextDay.am || nextDay.pm || nextDay.shoots.length) days[key] = nextDay;
    else { delete days[key]; delete shootIds[key]; }
    const data = { ...previous.data, days };
    return persist({ ...previous, data, shootIds }, () => writeStored(window.localStorage, data));
  }

  function setSession(key: string, slot: 'am' | 'pm', session: Session) {
    const day = current.current.data.days[key] ?? emptyDay();
    if (day[slot] !== session) commitDay(key, { ...day, [slot]: session });
  }

  function addShoot(key: string): string | null {
    const day = current.current.data.days[key] ?? emptyDay();
    try { assertShootCount(day.shoots.length + 1, `days.${key}.shoots`); } catch (error) { reject(error); return null; }
    const id = `new-${++nextId.current}`;
    return commitDay(key, { ...day, shoots: [...day.shoots, { place: '', km: null }] }, [...(current.current.shootIds[key] ?? []), id]) ? id : null;
  }

  function updateShoot(key: string, id: string, patch: Partial<Shoot>): Shoot | null {
    const day = current.current.data.days[key];
    const index = current.current.shootIds[key]?.indexOf(id) ?? -1;
    if (!day || index < 0) return null;
    const before = day.shoots[index];
    const updated = { ...before, ...patch };
    try { assertKm(updated.km, `days.${key}.shoots[${index}].km`); } catch (error) { reject(error); return before; }
    if (patch.place !== undefined) {
      updated.place = patch.place.trim();
      if (updated.km === null) updated.km = latestPlaceKm(current.current.data.days, updated.place, { key, index });
    }
    if (updated.place !== before.place || updated.km !== before.km) {
      if (!commitDay(key, { ...day, shoots: day.shoots.map((shoot, i) => i === index ? updated : shoot) })) return before;
    }
    return updated;
  }

  function setShootKm(key: string, id: string, text: string): ShootKmResult {
    try { return { shoot: updateShoot(key, id, { km: parseKm(text) }), message: '' }; } catch (error) {
      reject(error);
      const index = current.current.shootIds[key]?.indexOf(id) ?? -1;
      return { shoot: index < 0 ? null : current.current.data.days[key]?.shoots[index] ?? null, message: current.current.dataNotice };
    }
  }

  function removeShoot(key: string, id: string) {
    const day = current.current.data.days[key];
    const ids = current.current.shootIds[key] ?? [];
    const index = ids.indexOf(id);
    if (!day || index < 0) return;
    commitDay(key, { ...day, shoots: day.shoots.filter((_, i) => i !== index) }, ids.filter(value => value !== id));
  }

  function setRate(key: keyof Rates, text: string): OperationResult {
    const value = parseRate(text);
    if (value === null) return { ok: false, message: `${RATE_LIMIT_MESSAGE} Đã giữ mức trước đó.` };
    const previous = current.current;
    if (previous.data.rates[key] !== value) {
      const data = { ...previous.data, rates: { ...previous.data.rates, [key]: value } };
      if (!persist({ ...previous, data }, () => writeStored(window.localStorage, data))) return { ok: false, message: current.current.dataNotice };
    }
    return { ok: true, message: `Đã cập nhật mức tiền.${current.current.canPersist ? '' : ' Thay đổi chỉ lưu trong bộ nhớ.'}` };
  }

  function resetRates(): OperationResult {
    const previous = current.current;
    const data = { ...previous.data, rates: { ...DEFAULT_RATES } };
    if (!persist({ ...previous, data }, () => writeStored(window.localStorage, data))) return { ok: false, message: current.current.dataNotice };
    return { ok: true, message: 'Đã khôi phục 5 mức tiền mặc định.' };
  }

  function importData(input: Data): OperationResult {
    let data: Data;
    try { data = validateData(input); } catch (error) { return { ok: false, message: error instanceof Error ? error.message : 'File nhập không hợp lệ.' }; }
    const previous = current.current;
    const revision = previous.revision + 1;
    if (!persist({ ...previous, data, undo: previous.data, revision, shootIds: idsFor(data, revision) }, () => writeImport(window.localStorage, previous.data, data))) return { ok: false, message: current.current.dataNotice };
    return { ok: true, message: `Đã thay thế dữ liệu. Có thể hoàn tác lần nhập gần nhất.${current.current.canPersist ? '' : ' Dữ liệu nhập và bản hoàn tác chỉ được giữ trong bộ nhớ của phiên này.'}` };
  }

  function undoImport(): OperationResult {
    const previous = current.current;
    if (!previous.undo) return { ok: false, message: 'Chưa có lần nhập nào để hoàn tác.' };
    const data = previous.undo;
    const revision = previous.revision + 1;
    if (!persist({ ...previous, data, undo: null, revision, shootIds: idsFor(data, revision) }, () => writeUndo(window.localStorage, data))) return { ok: false, message: current.current.dataNotice };
    return { ok: true, message: `Đã khôi phục toàn bộ dữ liệu trước lần nhập gần nhất.${current.current.canPersist ? '' : ' Bản khôi phục chỉ lưu trong bộ nhớ.'}` };
  }

  return { data: snapshot.data, storageNotice: snapshot.notice, dataNotice: snapshot.dataNotice, shootIds: snapshot.shootIds, revision: snapshot.revision, canUndo: snapshot.undo !== null, setSession, addShoot, updateShoot, setShootKm, removeShoot, setRate, resetRates, importData, undoImport };
}
