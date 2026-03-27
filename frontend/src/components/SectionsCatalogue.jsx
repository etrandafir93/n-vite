import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './SectionsCatalogue.css'

const FREE_COUNT = 4
const EXTRA_PRICE_EUR = 5

export default function SectionsCatalogue() {
  const { t } = useTranslation()
  const items = t('sections.items', { returnObjects: true })
  const [selected, setSelected] = useState(() => new Set([0, 1, 2, 3]))

  useEffect(() => {
    setSelected(prev => {
      const maxIndex = items.length - 1
      const valid = [...prev].filter(i => i <= maxIndex)
      return new Set(valid)
    })
  }, [items.length])

  const selectedCount = selected.size
  const extraCount = Math.max(0, selectedCount - FREE_COUNT)
  const extraPrice = extraCount * EXTRA_PRICE_EUR

  const selectionLabel = useMemo(
    () => `${selectedCount}/${FREE_COUNT}`,
    [selectedCount],
  )

  const toggleItem = (idx) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  return (
    <section className="sections-catalogue" id="sections">
      <div className="container">
        <div className="sections-catalogue__header">
          <span className="section-label">{t('sections.label')}</span>
          <h2 className="sections-catalogue__title">{t('sections.title')}</h2>
          <p className="sections-catalogue__subtitle">
            {t('sections.subtitle', { freeCount: FREE_COUNT })}
          </p>
        </div>

        <div className="sections-catalogue__summary" role="status" aria-live="polite">
          <div className="sections-catalogue__metric">
            <span>{t('sections.selected')}</span>
            <strong>{selectionLabel}</strong>
          </div>
          <div className="sections-catalogue__metric">
            <span>{t('sections.extra_cost')}</span>
            <strong>{extraCount > 0 ? `+${extraPrice} EUR` : t('sections.extra_cost_none')}</strong>
          </div>
        </div>

        <div className="sections-catalogue__grid">
          {items.map((item, idx) => (
            <button
              type="button"
              className={`section-chip ${selected.has(idx) ? 'section-chip--selected' : ''}`}
              key={item}
              onClick={() => toggleItem(idx)}
              aria-pressed={selected.has(idx)}
            >
              <span className="section-chip__name">{item}</span>
              <span className={`section-chip__price ${selected.has(idx) ? 'section-chip__price--active' : ''}`}>
                {selected.has(idx) ? t('sections.selected_badge') : t('sections.select_badge')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
