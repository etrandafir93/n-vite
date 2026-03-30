import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './SectionsCatalogue.css'

const FREE_COUNT = 4
const EXTRA_PRICE_EUR = 5

const PRESETS = {
  starter: [0, 1, 2, 3],
  story: [0, 1, 2, 4, 5, 6, 12, 14],
  full: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
}

export default function SectionsCatalogue() {
  const { t } = useTranslation()
  const items = t('sections.items', { returnObjects: true })
  const [selected, setSelected] = useState(() => new Set(PRESETS.starter))

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
  const freeSlotsLeft = Math.max(0, FREE_COUNT - selectedCount)
  const selectedOrder = [...selected].sort((a, b) => a - b)

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

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey] || []
    const valid = preset.filter(i => i < items.length)
    setSelected(new Set(valid))
  }

  const getChipMeta = (idx) => {
    const rank = selectedOrder.indexOf(idx)
    const isSelected = rank >= 0
    const isPaid = isSelected && rank >= FREE_COUNT
    return { isSelected, isPaid }
  }

  return (
    <section className="sections-catalogue" id="sections">
      <span id="pricing" className="sections-catalogue__anchor" aria-hidden="true" />
      <div className="container">
        <div className="sections-catalogue__header">
          <span className="section-label">{t('sections.label')}</span>
          <h2 className="sections-catalogue__title">{t('sections.title')}</h2>
          <p className="sections-catalogue__subtitle">
            {t('sections.subtitle', { freeCount: FREE_COUNT })}
          </p>
          <p className="sections-catalogue__teaser">{t('sections.teaser')}</p>
        </div>

        <div className="sections-catalogue__presets">
          <button type="button" onClick={() => applyPreset('starter')}>{t('sections.presets.starter')}</button>
          <button type="button" onClick={() => applyPreset('story')}>{t('sections.presets.story')}</button>
          <button type="button" onClick={() => applyPreset('full')}>{t('sections.presets.full')}</button>
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
          <div className="sections-catalogue__summary-line">
            {extraCount === 0
              ? t('sections.summary_free', { freeSlotsLeft })
              : t('sections.summary_paid', { extraCount, extraPrice })}
          </div>
        </div>

        <div className="sections-catalogue__grid">
          {items.map((item, idx) => {
            const chip = getChipMeta(idx)
            return (
              <button
                type="button"
                className={`section-chip ${chip.isSelected ? 'section-chip--selected' : ''} ${chip.isPaid ? 'section-chip--paid' : ''}`}
                key={item}
                onClick={() => toggleItem(idx)}
                aria-pressed={chip.isSelected}
              >
                <span className="section-chip__name">{item}</span>
                <span
                  className={`section-chip__price ${chip.isSelected ? 'section-chip__price--active' : ''} ${chip.isPaid ? 'section-chip__price--paid' : ''}`}
                >
                  {!chip.isSelected && t('sections.select_badge')}
                  {chip.isSelected && !chip.isPaid && t('sections.selected_badge')}
                  {chip.isSelected && chip.isPaid && `+${EXTRA_PRICE_EUR} EUR`}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
