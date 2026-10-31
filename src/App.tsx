import { useState } from 'react';
import { dateKey, daySummary, emptyDay, initialMonth, monthSummary, shiftMonth, weekSummary, type Day, type Days, type Rates, type Session, type Summary } from './logic';
import { useAttendance } from './useAttendance';
import { placeSuggestions } from './shooting';
import ShootEditor from './ShootEditor';
import ShootTable from './ShootTable';
import RateSettings from './RateSettings';
import BackupPanel from './BackupPanel';
import SafeMoney from './SafeMoney';

const jobName = (session: Session) => session === 'seo' ? 'SEO' : session === 'mkt' ? 'Marketing' : 'Nghỉ';
const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 9 });
const fullDate = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });
const shortDate = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });

function MonthTotal({ summary, rates }: { summary: Summary; rates: Rates }) {
  return <section className="month-total" aria-labelledby="salary-title">
    <div className="total-heading"><h2 id="salary-title">LƯƠNG DỰ KIẾN</h2><span className="period-tag">Theo tháng dương lịch</span></div>
    <p className="grand-total numeric" aria-live="polite" aria-atomic="true"><SafeMoney value={summary.total} /></p>
    <p className="activity">{summary.workingDays} ngày có làm <span aria-hidden="true">·</span> {summary.am} buổi sáng <span aria-hidden="true">·</span> {summary.pm} buổi chiều</p>
    {summary.workingDays === 0 && <p className="empty-hint">Chưa có dữ liệu tháng này. Chạm vào một ngày trên lịch để bắt đầu chấm công.</p>}
    <div className="salary-breakdown">
      {(['seo', 'mkt'] as const).map(job => <div className="breakdown-row" key={job}>
        <div className="breakdown-description"><span className={`job-dot ${job}`} aria-hidden="true" /><div><h3>{jobName(job)}</h3><p>{summary[job].count} buổi ({summary[job].am} sáng, {summary[job].pm} chiều) × <span className="numeric"><SafeMoney value={rates[job]} /></span></p></div></div>
        <span className="numeric breakdown-money"><SafeMoney value={summary[job].amount} /></span>
      </div>)}
      <div className="breakdown-row">
        <div className="breakdown-description"><span className="job-dot shoot" aria-hidden="true" /><div><h3>Phí đi quay</h3><p>{summary.shootCount} lần <span aria-hidden="true">·</span> {number.format(summary.km)} km</p></div></div>
        <span className="numeric breakdown-money"><SafeMoney value={summary.fees} /></span>
      </div>
    </div>
    <p className="total-note">Tổng trước các khoản trừ nếu có. Chưa trừ thuế hay bảo hiểm.</p>
  </section>;
}

function SessionBar({ value }: { value: Session }) {
  return <span aria-hidden="true" className={`session-bar ${value ?? 'off'}`}>{value === 'seo' ? 'SEO' : value === 'mkt' ? 'MKT' : '\u00a0'}</span>;
}

function Calendar({ year, month, days, rates, selected, today, onSelect }: {
  year: number; month: number; days: Days; rates: Rates; selected: string; today: string; onSelect: (key: string) => void;
}) {
  const weeks = weekSummary(days, year, month, rates);
  return <section className="panel calendar-panel" aria-labelledby="calendar-title">
    <div className="section-heading"><div><p className="eyebrow">TỪNG NGÀY, TỪNG BUỔI</p><h2 id="calendar-title">Lịch chấm công</h2></div><a className="editor-link" href="#day-editor">Chấm công <svg aria-hidden="true" focusable="false" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 13 13 3M3 3h10v10" /></svg></a></div>
    <div className="weekday-row" aria-hidden="true">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, index) => <span className={index > 4 ? 'weekend' : ''} key={label}>{label}</span>)}</div>
    <div className="calendar-weeks" aria-label={`Lịch tháng ${month + 1}/${year}`}>
      {weeks.map(week => <div className="calendar-week" key={week.number}>
        <div className="week-days">
          {week.keys.map((key, index) => {
            const date = new Date(year, month, week.start + index);
            const day = days[key] ?? emptyDay();
            const isToday = key === today;
            const label = `${fullDate.format(date)}; buổi sáng: ${jobName(day.am)}; buổi chiều: ${jobName(day.pm)}; ${day.shoots.length} lần đi quay${isToday ? '; hôm nay' : ''}`;
            return <button type="button" key={key} className={`calendar-day${key === selected ? ' selected' : ''}${date.getDay() === 0 || date.getDay() === 6 ? ' weekend' : ''}`} style={index === 0 ? { gridColumnStart: (date.getDay() + 6) % 7 + 1 } : undefined} aria-label={label} aria-pressed={key === selected} aria-current={isToday ? 'date' : undefined} onClick={() => onSelect(key)}>
              <span className={`date-number${isToday ? ' today' : ''}`}>{date.getDate()}</span>
              <span className="day-sessions"><SessionBar value={day.am} /><SessionBar value={day.pm} /></span>
              {day.shoots.length > 0 && <span className="shoot-badge" aria-hidden="true">Q {day.shoots.length}</span>}
            </button>;
          })}
        </div>
        <div className={`week-total${week.workingDays === 0 ? ' empty-week' : ''}`}>
          <div className="week-total-heading"><span>Tuần {week.number} <span aria-hidden="true">·</span> {week.start}–{week.end}/{month + 1}</span><strong className="numeric"><SafeMoney value={week.total} /></strong></div>
          <p>{week.seo.count + week.mkt.count} buổi (SEO {week.seo.count}, MKT {week.mkt.count}) <span aria-hidden="true">·</span> phí quay <span className="numeric"><SafeMoney value={week.fees} /></span></p>
        </div>
      </div>)}
    </div>
    <div className="calendar-legend"><span><i className="legend-chip seo" aria-hidden="true" />SEO</span><span><i className="legend-chip mkt" aria-hidden="true" />Marketing</span><span><i className="legend-chip shoot" aria-hidden="true" />Q: lần đi quay</span></div>
    <p className="calendar-help">Ô trên: buổi sáng, ô dưới: buổi chiều. Viền đứt: nghỉ.</p>
    <p className="calendar-help week-note">Tuần tính T2 đến CN; tuần đầu và cuối chỉ tính các ngày nằm trong tháng.</p>
  </section>;
}

function DayEditor({ date, day, rates, onChange, shoots }: { date: Date; day: Day; rates: Rates; onChange: (slot: 'am' | 'pm', session: Session) => void; shoots: React.ReactNode }) {
  const summary = daySummary(day, rates);
  return <section className="panel day-editor" id="day-editor" tabIndex={-1} aria-labelledby="day-title">
    <p className="eyebrow">CHẤM CÔNG THEO BUỔI</p>
    <h2 id="day-title" className="selected-date">{shortDate.format(date)}</h2>
    <div className="day-amount"><span>Tổng trong ngày</span><strong className="numeric" aria-live="polite" aria-atomic="true"><SafeMoney value={summary.total} /></strong></div>
    {(['am', 'pm'] as const).map(slot => {
      const label = slot === 'am' ? 'Buổi sáng' : 'Buổi chiều';
      const amount = daySummary({ ...emptyDay(), [slot]: day[slot] }, rates).total;
      return <fieldset className="session-field" key={slot}>
        <legend><span className="session-symbol" aria-hidden="true">{slot === 'am' ? '☀' : '◐'}</span>{label}</legend>
        <div className="session-options">{([null, 'seo', 'mkt'] as const).map(job => <button type="button" key={job ?? 'off'} className={`session-option ${job ?? 'off'}`} aria-label={`${label}: ${jobName(job)}`} aria-pressed={day[slot] === job} onClick={() => onChange(slot, job)}>{jobName(job)}</button>)}</div>
        <p className="session-result"><span>{jobName(day[slot])}</span><span className="numeric"><SafeMoney value={amount} /></span></p>
      </fieldset>;
    })}
    {shoots}
  </section>;
}

export default function App() {
  const { data, storageNotice, dataNotice, shootIds, revision, canUndo, setSession, addShoot, updateShoot, setShootKm, removeShoot, setRate, resetRates, importData, undoImport } = useAttendance();
  const [view, setView] = useState(() => {
    const now = new Date();
    const opening = initialMonth(now);
    return { ...opening, day: now.getFullYear() === opening.year && now.getMonth() === opening.month ? now.getDate() : 1 };
  });
  const { year, month, day } = view;
  const selectedKey = dateKey(year, month, day);
  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedDay = data.days[selectedKey] ?? emptyDay();
  const summary = monthSummary(data.days, year, month, data.rates);

  function moveMonth(delta: number) {
    setView(previous => ({ ...shiftMonth(previous.year, previous.month, delta), day: 1 }));
  }

  function selectFromTable(key: string) {
    setView(previous => ({ ...previous, day: Number(key.slice(-2)) }));
    requestAnimationFrame(() => {
      const editor = document.getElementById('day-editor');
      editor?.focus({ preventScroll: true });
      editor?.scrollIntoView({ block: 'start' });
    });
  }

  return <>
    <a className="skip-link" href="#day-editor">Đi tới khung chấm công</a>
    <div className="app-shell">
      <header className="app-header"><div className="brand"><span className="brand-icon" aria-hidden="true">✓</span><div><p className="brand-title">Chấm công cá nhân</p><p className="brand-subtitle">Mỗi buổi làm, rõ từng đồng.</p></div></div><span className="personal-label">SEO & Marketing</span></header>
      <main>
        <div className="month-navigation"><div><p className="eyebrow">SỔ LÀM VIỆC CỦA BẠN</p><h1 aria-live="polite" aria-atomic="true">Tháng {month + 1}/{year}</h1></div><div className="month-controls"><button type="button" className="month-arrow" aria-label="Tháng trước" onClick={() => moveMonth(-1)}><span aria-hidden="true">←</span></button><button type="button" className="month-arrow" aria-label="Tháng sau" onClick={() => moveMonth(1)}><span aria-hidden="true">→</span></button></div></div>
        {storageNotice && <p className="storage-notice" role="status">{storageNotice}</p>}
        {dataNotice && <p className="storage-notice data-notice" role="status" aria-live="polite">{dataNotice}</p>}
        <MonthTotal summary={summary} rates={data.rates} />
        <div className="attendance-layout"><Calendar year={year} month={month} days={data.days} rates={data.rates} selected={selectedKey} today={todayKey} onSelect={key => setView(previous => ({ ...previous, day: Number(key.slice(-2)) }))} /><DayEditor key={`${revision}-${selectedKey}`} date={new Date(year, month, day)} day={selectedDay} rates={data.rates} onChange={(slot, session) => setSession(selectedKey, slot, session)} shoots={<ShootEditor shoots={selectedDay.shoots} ids={shootIds[selectedKey] ?? []} rates={data.rates} places={placeSuggestions(data.days)} onAdd={() => addShoot(selectedKey)} onUpdate={(id, patch) => updateShoot(selectedKey, id, patch)} onKmSave={(id, text) => setShootKm(selectedKey, id, text)} onRemove={id => removeShoot(selectedKey, id)} />} /></div>
        <ShootTable key={`${revision}-${year}-${month}`} days={data.days} year={year} month={month} rates={data.rates} onSelect={selectFromTable} />
        <RateSettings key={revision} rates={data.rates} onSave={setRate} onReset={resetRates} />
        <BackupPanel data={data} canUndo={canUndo} onImport={importData} onUndo={undoImport} />
      </main>
      <footer className="app-footer">Chấm công theo buổi <span aria-hidden="true">·</span> Kỳ lương từ ngày 1 đến cuối tháng</footer>
    </div>
  </>;
}
