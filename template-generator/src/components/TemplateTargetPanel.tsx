import type { Dispatch, SetStateAction } from 'react';
import type { ModeSelection, OutputState, TemplateState } from '../types';

interface Props {
  columns: string[];
  template: TemplateState;
  onTemplatePathChange: (p: string) => void;
  onValidate: () => void;
  output: OutputState;
  setOutput: Dispatch<SetStateAction<OutputState>>;
  mode: ModeSelection;
  setMode: (m: ModeSelection) => void;
}

// Tokens the template-x block fills at runtime; not expected to come from data.
const BLOCK_FILLED = new Set(['type', 'quantity', 'heading_placeholder', 'prompt-text']);

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none';

export default function TemplateTargetPanel({
  columns,
  template,
  onTemplatePathChange,
  onValidate,
  output,
  setOutput,
  mode,
  setMode,
}: Props) {
  const v = template.validation;

  return (
    <section className="flex flex-col gap-5">
      {/* Template */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-800">Template document (DA path or URL)</label>
        <div className="flex gap-2">
          <input
            className={inputCls}
            placeholder="/adobecom/da-express-milo/es/express/colors/default"
            value={template.path}
            onChange={(e) => onTemplatePathChange(e.target.value)}
          />
          <button
            type="button"
            onClick={onValidate}
            disabled={!template.path.trim() || template.loading}
            className="whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40"
          >
            {template.loading ? 'Loading…' : 'Validate'}
          </button>
        </div>
        {template.error && <p className="text-sm text-red-600">{template.error}</p>}
        {v && (
          <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-sm">
              Status:{' '}
              <span
                className={
                  v.status === 'ready' ? 'font-medium text-green-700'
                  : v.status === 'warning' ? 'font-medium text-amber-700'
                  : 'font-medium text-red-700'
                }
              >
                {v.status}
              </span>
              {v.issues.length > 0 && <span className="text-gray-500"> — {v.issues.join('; ')}</span>}
            </p>
            <p className="text-xs text-gray-500">
              {v.placeholders.length} placeholder tokens · green = matching data column, amber = no data column
            </p>
            <div className="flex flex-wrap gap-1.5">
              {v.placeholders.map((p) => {
                const covered = columns.includes(p);
                const blockFilled = BLOCK_FILLED.has(p);
                const cls = blockFilled
                  ? 'bg-gray-100 text-gray-500 border-gray-200'
                  : covered
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200';
                return (
                  <span key={p} className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${cls}`}>
                    {p}{blockFilled ? ' (block)' : covered ? '' : ' ⚠'}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Output location */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-800">Output location</span>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={output.source === 'column'}
              onChange={() => setOutput((o) => ({ ...o, source: 'column' }))}
            />
            From a path column
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={output.source === 'dir'}
              onChange={() => setOutput((o) => ({ ...o, source: 'dir' }))}
            />
            Fixed directory + slug column
          </label>
        </div>
        {output.source === 'column' ? (
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Path column
              <select
                className={inputCls}
                value={output.pathColumn}
                onChange={(e) => setOutput((o) => ({ ...o, pathColumn: e.target.value }))}
              >
                <option value="">— select —</option>
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Org/repo prefix
              <input
                className={inputCls}
                value={output.prefix}
                onChange={(e) => setOutput((o) => ({ ...o, prefix: e.target.value }))}
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Output directory (DA path)
              <input
                className={inputCls}
                placeholder="/adobecom/da-express-milo/drafts/colors-migration"
                value={output.outputDir}
                onChange={(e) => setOutput((o) => ({ ...o, outputDir: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Slug column
              <select
                className={inputCls}
                value={output.slugColumn}
                onChange={(e) => setOutput((o) => ({ ...o, slugColumn: e.target.value }))}
              >
                <option value="">— select —</option>
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Render mode */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-800">Render mode</span>
        <div className="flex flex-col gap-1.5 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={mode === 'bake'} onChange={() => setMode('bake')} />
            <span><b>Bake</b> — substitute values into the doc (self-contained, no runtime script)</span>
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={mode === 'metadata'} onChange={() => setMode('metadata')} />
            <span><b>Metadata</b> — attach a metadata block + <code>sheet-powered=Y</code> (content-replace fills at render)</span>
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={mode === 'both'} onChange={() => setMode('both')} />
            <span><b>Both</b> — write one doc per mode into <code>/baked/</code> and <code>/meta/</code> subfolders to compare</span>
          </label>
        </div>
      </div>
    </section>
  );
}
