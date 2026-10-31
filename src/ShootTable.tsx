import { useEffect, useId, useRef, useState } from 'react';
import { monthSummary, type Days, type Rates } from './logic';
import { buildShootTsv, displayDate, formatKm, monthShootRows } from './shooting';
import SafeMoney from './SafeMoney';

type Props = { days: Days; year: number; month: number; rates: Rates; onSelect: (key: string) => void };

export default function ShootTable({ days, year, month, rates, onSelect }: Props) {
  const rows = monthShootRows(days, year, month, rates);
  const summary = monthSummary(days, year, month, rates);
  const [message, setMessage] = useState('');
  const [manual, setManual] = useState<{ text: string } | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const manualId = useId();
  useEffect(() => {
    if (manual) { textarea.current?.focus(); textarea.current?.select(); }
  }, [manual]);

  async function copy() {
    let text: string;
    try { text = buildShootTsv(days, year, month, rates); } catch (error) {
      setManual(null); setMessage(error instanceof Error ? error.message : 'Không thể sao chép tiền không hợp lệ.'); return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setManual(null);
      setMessage('Đã sao chép bảng. Bạn có thể dán vào Excel.');
    } catch {
      setManual({ text });
      setMessage('Trình duyệt không cho sao chép tự động, hãy sao chép thủ công');
    }
  }

  return <section className="panel shoot-table-panel" aria-labelledby="shoot-table-title">
    <div className="shoot-table-heading"><div><p className="eyebrow">TỔNG HỢP PHÍ HỖ TRỢ</p><h2 id="shoot-table-title">Bảng đi quay tháng {month + 1}</h2></div><button type="button" className="copy-table" onClick={copy}>Sao chép bảng</button></div>
    <p className="copy-message" aria-live="polite" aria-atomic="true">{message}</p>
    {manual && <div className="manual-copy"><label htmlFor={manualId}>Nội dung bảng để sao chép thủ công</label><textarea id={manualId} ref={textarea} value={manual.text} readOnly rows={6} spellCheck={false} /><p>Nhấn Ctrl+C / ⌘C, hoặc dùng menu Sao chép trên điện thoại.</p></div>}
    {rows.length === 0 ? <div className="table-empty"><span className="placeholder-symbol" aria-hidden="true">Q</span><p>Chưa có lần đi quay nào trong tháng này. Chọn một ngày trên lịch rồi bấm “+ Thêm lần đi quay”.</p></div> : <>
      <p className="table-hint" id="shoot-table-hint">Chạm vào ngày để chỉnh sửa. Vuốt ngang trong bảng để xem đủ các cột.</p>
      <div className="shoot-table-scroll" role="region" aria-label="Bảng tổng hợp đi quay, có thể cuộn ngang" aria-describedby="shoot-table-hint" tabIndex={0}>
        <table className="shoot-table"><caption className="sr-only">Các lần đi quay tháng {month + 1}/{year}</caption>
          <thead><tr><th scope="col">Ngày</th><th scope="col">Vị trí</th><th scope="col" className="table-number">Km</th><th scope="col" className="table-number">Phí (₫)</th></tr></thead>
          <tbody>{rows.map(row => <tr key={`${row.key}-${row.index}`}><td><button type="button" className="table-date" aria-label={`Chấm công ngày ${displayDate(row.key)}`} onClick={() => onSelect(row.key)}>{displayDate(row.key)}</button></td><td className={`table-place${row.place ? '' : ' missing-value'}`}>{row.place || 'Chưa nhập'}</td><td className="numeric table-number">{row.km === null ? '—' : formatKm(row.km)}</td><td className="numeric table-number table-fee"><SafeMoney value={row.fee} /></td></tr>)}</tbody>
          <tfoot><tr><th scope="row" colSpan={2}>Tổng</th><td className="numeric table-number">{formatKm(summary.km)}</td><td className="numeric table-number"><SafeMoney value={summary.fees} /></td></tr></tfoot>
        </table>
      </div>
    </>}
  </section>;
}
