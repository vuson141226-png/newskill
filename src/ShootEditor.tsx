import { useRef, useState } from 'react';
import { shootFee, type Rates, type Shoot } from './logic';
import { formatKm } from './shooting';
import { SHOOT_LIMIT_MESSAGE } from './limits';
import SafeMoney from './SafeMoney';
import type { ShootKmResult } from './useAttendance';

type ShootRowProps = {
  id: string; shoot: Shoot; rates: Rates; autoFocus: boolean; number: number;
  onUpdate: (patch: Partial<Shoot>) => Shoot | null; onKmSave: (text: string) => ShootKmResult; onRemove: () => void;
};

function ShootRow({ id, shoot, rates, autoFocus, number, onUpdate, onKmSave, onRemove }: ShootRowProps) {
  // Only draft text changes while typing; stable row keys preserve the DOM and caret.
  const [placeText, setPlaceText] = useState(shoot.place);
  const [kmText, setKmText] = useState(shoot.km === null ? '' : formatKm(shoot.km));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [kmMessage, setKmMessage] = useState('');
  const deleteButton = useRef<HTMLButtonElement>(null);
  const placeId = `place-${id}`;
  const kmId = `km-${id}`;
  const feeId = `fee-${id}`;

  function savePlace() {
    const updated = onUpdate({ place: placeText });
    if (updated) {
      setPlaceText(updated.place);
      setKmText(updated.km === null ? '' : formatKm(updated.km));
    }
  }
  function saveKm() {
    const result = onKmSave(kmText);
    const updated = result.shoot ?? shoot;
    setKmText(updated.km === null ? '' : formatKm(updated.km));
    setKmMessage(result.message);
  }

  return <fieldset className="shoot-row">
    <legend>Lần {number}</legend>
    <div className="shoot-inputs">
      <div className="input-field"><label htmlFor={placeId}>Vị trí quay</label><input id={placeId} type="text" list="shoot-place-suggestions" autoComplete="off" autoFocus={autoFocus} placeholder="Ví dụ: Hồ Tây" value={placeText} onChange={event => setPlaceText(event.target.value)} onBlur={savePlace} /></div>
      <div className="input-field"><label htmlFor={kmId}>Khoảng cách (km)</label><input id={kmId} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} placeholder="Ví dụ: 8,5" aria-describedby={`${feeId} error-${id}`} value={kmText} onChange={event => { setKmText(event.target.value); setKmMessage(''); }} onBlur={saveKm} /><p id={`error-${id}`} className="operation-message">{kmMessage}</p></div>
    </div>
    <p className="shoot-fee" id={feeId} aria-live="polite">{shoot.km === null ? 'Nhập số km để tính phí' : shoot.km < 5 ? 'Dưới 5 km, không có phí hỗ trợ' : <>Phí hỗ trợ <span className="numeric"><SafeMoney value={shootFee(shoot.km, rates)} /></span></>}</p>
    {confirmDelete ? <div className="delete-confirm"><p>Xóa lần đi quay này?</p><div><button type="button" className="delete-action" autoFocus aria-label={`Xác nhận xóa lần đi quay ${number}`} onClick={onRemove}>Xóa</button><button type="button" className="keep-action" onClick={() => { setConfirmDelete(false); requestAnimationFrame(() => deleteButton.current?.focus()); }}>Giữ lại</button></div></div> : <button type="button" ref={deleteButton} className="delete-shoot" aria-label={`Xóa lần này: lần đi quay ${number}`} onClick={() => setConfirmDelete(true)}>Xóa lần này</button>}
  </fieldset>;
}

type Props = {
  shoots: Shoot[]; ids: string[]; rates: Rates; places: string[];
  onAdd: () => string | null; onUpdate: (id: string, patch: Partial<Shoot>) => Shoot | null; onKmSave: (id: string, text: string) => ShootKmResult; onRemove: (id: string) => void;
};
export default function ShootEditor({ shoots, ids, rates, places, onAdd, onUpdate, onKmSave, onRemove }: Props) {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [addMessage, setAddMessage] = useState('');

  function remove(id: string) {
    const index = ids.indexOf(id);
    const next = ids[index + 1] ?? ids[index - 1];
    onRemove(id);
    setAddMessage('');
    requestAnimationFrame(() => document.getElementById(next ? `place-${next}` : 'add-shoot')?.focus());
  }

  return <section className="shoot-editor" aria-labelledby="shoot-editor-title">
    <div className="shoot-heading"><span className="placeholder-symbol" aria-hidden="true">Q</span><h3 id="shoot-editor-title">Đi quay</h3></div>
    <datalist id="shoot-place-suggestions">{places.map(place => <option value={place} key={place} />)}</datalist>
    {shoots.length === 0 && <p className="shoot-empty">Thêm từng lần đi quay để tính phí hỗ trợ cho ngày này.</p>}
    <div className="shoot-list">{shoots.map((shoot, index) => <ShootRow key={ids[index]} id={ids[index]} shoot={shoot} rates={rates} number={index + 1} autoFocus={focusId === ids[index]} onUpdate={patch => onUpdate(ids[index], patch)} onKmSave={text => onKmSave(ids[index], text)} onRemove={() => remove(ids[index])} />)}</div>
    <button type="button" id="add-shoot" className="add-shoot" aria-describedby="add-shoot-message" onClick={() => { const id = onAdd(); setFocusId(id); setAddMessage(id ? '' : SHOOT_LIMIT_MESSAGE); }}>+ Thêm lần đi quay</button>
    <p id="add-shoot-message" className="operation-message">{addMessage}</p>
    <p className="shoot-rules">Mốc km cố định: dưới 5 km: không hỗ trợ; 5–10 km (gồm 10): <span className="numeric"><SafeMoney value={rates.fee1} /></span>; trên 10 đến dưới 20 km: <span className="numeric"><SafeMoney value={rates.fee2} /></span>; từ 20 km: <span className="numeric"><SafeMoney value={rates.fee3} /></span>.</p>
  </section>;
}
