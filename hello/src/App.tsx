import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="tool">
      <p className="eyebrow">pdp-document-generator · tool 2</p>
      <h1>Hello 👋</h1>
      <p>
        This is a second, independent Vite&nbsp;+&nbsp;React app living in the same
        repository as the Document Generator, served side&#8209;by&#8209;side via AEM
        Edge Delivery and embedded in DA.
      </p>
      <button onClick={() => setCount((c) => c + 1)}>
        clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
      <p className="note">
        If this counter increments, JavaScript is executing correctly inside the DA iframe.
      </p>
    </main>
  )
}
