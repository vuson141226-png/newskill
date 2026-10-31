import { useRef, useState } from 'react';
import type { Data } from './logic';
import { backupFilename, backupPreview, parseBackup, serializeData } from './backup';
import { displayDate } from './shooting';
import type { OperationResult } from './useAttendance';

export default function BackupPanel({ data, canUndo, onImport, onUndo }: { data: Data; canUndo: boolean; onImport: (data: Data) => OperationResult; onUndo: () => OperationResult }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const importButton = useRef<HTMLButtonElement>(null);
  const readId = useRef(0);
  const [pending, setPending] = useState<{ data: Data; name: string } | null>(null);
  const [message, setMessage] = useState('');
  const [reading, setReading] = useState(false);

  function returnFocus() {
    requestAnimationFrame(() => importButton.current?.focus());
  }

  function exportFile() {
    try {
      const blob = new Blob([serializeData(data)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = backupFilename(); document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Đã tạo file sao lưu. Hãy giữ file ở nơi an toàn để chuyển thiết bị hoặc khôi phục.');
    } catch { setMessage('Không thể tạo file sao lưu. Hãy thử lại trên trình duyệt hỗ trợ tải file.'); }
  }

  async function readFile(file?: File) {
    if (!file) return;
    const request = ++readId.current;
    setPending(null); setReading(true); setMessage('Đang kiểm tra file…');
    try {
      if (!file.name.toLowerCase().endsWith('.json')) throw new Error('Hãy chọn file có đuôi .json.');
      const incoming = parseBackup(await file.text());
      if (request !== readId.current) return;
      setPending({ data: incoming, name: file.name });
      setMessage('File hợp lệ. Kiểm tra bản xem trước rồi xác nhận nếu muốn thay thế dữ liệu.');
      requestAnimationFrame(() => confirmButton.current?.focus());
    } catch (error) {
      if (request === readId.current) setMessage(`Không nhập được: ${error instanceof Error ? error.message : 'Không đọc được file.'} Dữ liệu hiện tại không thay đổi.`);
    } finally {
      if (request === readId.current) setReading(false);
    }
  }

  const preview = pending ? backupPreview(pending.data) : null;
  return <section className="panel backup-panel" aria-labelledby="backup-title"><div className="section-heading"><div><p className="eyebrow">GIỮ DỮ LIỆU CỦA BẠN</p><h2 id="backup-title">Sao lưu</h2></div></div>
    <div className="backup-actions"><div><button type="button" className="primary-action" onClick={exportFile}>Xuất dữ liệu</button><p>Tải file JSON chứa mức tiền và toàn bộ ngày chấm công.</p></div><div><button type="button" ref={importButton} className="secondary-action" aria-controls="backup-file" onClick={() => fileInput.current?.click()}>Nhập dữ liệu</button><p>Chọn file JSON và xem trước trước khi thay thế dữ liệu.</p></div></div>
    <input ref={fileInput} id="backup-file" type="file" accept=".json,application/json" className="sr-only" tabIndex={-1} aria-label="Chọn file JSON để nhập dữ liệu" onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void readFile(file); }} />
    <p className="operation-message" aria-live="polite" aria-atomic="true">{message}</p>
    {reading && <p className="settings-description">Vui lòng chờ đọc xong file trước khi xác nhận.</p>}
    {pending && preview && <div className="import-preview"><h3>Bản xem trước: {pending.name}</h3><p>{preview.days} ngày, {preview.shoots} lần đi quay{preview.first && preview.last ? `, từ ngày ${displayDate(preview.first)} đến ngày ${displayDate(preview.last)}` : ' · Không có ngày chấm công'}.</p><p>Thay toàn bộ ngày và mức tiền. Dữ liệu hiện tại sẽ được giữ làm bản hoàn tác trước khi thay.</p><div className="confirm-actions"><button type="button" ref={confirmButton} className="primary-action" onClick={() => { const result = onImport(pending.data); setMessage(result.message); if (result.ok) { setPending(null); returnFocus(); } }}>Thay thế toàn bộ dữ liệu hiện tại</button><button type="button" className="secondary-action" onClick={() => { setPending(null); setMessage('Đã hủy nhập. Dữ liệu hiện tại không thay đổi.'); returnFocus(); }}>Hủy nhập</button></div></div>}
    {canUndo && <div className="undo-import"><button type="button" className="secondary-action" onClick={() => { const result = onUndo(); setMessage(result.message); if (result.ok) { setPending(null); returnFocus(); } }}>Hoàn tác lần nhập gần nhất</button><p>Khôi phục toàn bộ dữ liệu trước lần nhập, kể cả mức tiền; các sửa đổi sau lần nhập đó cũng được thay thế.</p></div>}
  </section>;
}
