import { useEffect, useRef, useState } from 'react';
import { type Rates } from './logic';
import type { OperationResult } from './useAttendance';

const labels: Record<keyof Rates, string> = {
  seo: 'SEO (₫/buổi)', mkt: 'Marketing (₫/buổi)', fee1: 'Phí quay 5–10 km (₫/lần)', fee2: 'Phí quay trên 10 đến dưới 20 km (₫/lần)', fee3: 'Phí quay từ 20 km (₫/lần)',
};
function RateField({ name, value, onSave, onResult }: { name: keyof Rates; value: number; onSave: (name: keyof Rates, text: string) => OperationResult; onResult: (message: string) => void }) {
  const [text, setText] = useState(String(value));
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setText(String(value)); setInvalid(false); }, [value]);
  return <div className="input-field rate-field"><label htmlFor={`rate-${name}`}>{labels[name]}</label><input id={`rate-${name}`} type="text" inputMode="numeric" autoComplete="off" value={text} aria-invalid={invalid} aria-describedby="rates-message" onChange={event => { setText(event.target.value); setInvalid(false); }} onBlur={() => {
    const result = onSave(name, text);
    setInvalid(!result.ok);
    // Parent updates accepted values; invalid input returns to the previous value.
    setText(result.ok ? String(Number(text.trim())) : String(value));
    onResult(result.message);
  }} /></div>;
}
export default function RateSettings({ rates, onSave, onReset }: { rates: Rates; onSave: (name: keyof Rates, text: string) => OperationResult; onReset: () => OperationResult }) {
  const [message, setMessage] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const resetButton = useRef<HTMLButtonElement>(null);
  return <details className="panel rate-settings"><summary>Mức lương và phí hỗ trợ</summary><div className="settings-content">
    <p className="settings-description">Mức mới áp dụng cho tất cả ngày đã chấm, kể cả các tháng trước. Rời ô để lưu và tính lại.</p>
    <div className="rate-fields">{(Object.keys(labels) as (keyof Rates)[]).map(name => <RateField key={name} name={name} value={rates[name]} onSave={onSave} onResult={setMessage} />)}</div>
    <p className="settings-note">Đúng 10 km tính theo mức 5–10 km. Dưới 5 km không có phí.</p>
    <p id="rates-message" className="operation-message" aria-live="polite" aria-atomic="true">{message}</p>
    {confirmReset ? <div className="inline-confirm"><p>Khôi phục cả 5 mức tiền về mặc định? Dữ liệu chấm công vẫn được giữ nguyên.</p><div className="confirm-actions"><button type="button" className="primary-action" autoFocus onClick={() => { const result = onReset(); setMessage(result.message); setConfirmReset(false); requestAnimationFrame(() => resetButton.current?.focus()); }}>Khôi phục</button><button type="button" className="secondary-action" onClick={() => { setConfirmReset(false); requestAnimationFrame(() => resetButton.current?.focus()); }}>Giữ mức hiện tại</button></div></div> : <button type="button" ref={resetButton} className="secondary-action" onClick={() => setConfirmReset(true)}>Khôi phục mức mặc định</button>}
  </div></details>;
}
