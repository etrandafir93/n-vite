import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCountdown } from './useCountdown'

const DEFAULT_MENU_OPTIONS = ['Meat', 'Fish', 'Vegetarian']

const THEMES = {
  classic: { layout: 'framed', cards: 'outlined', title: 'lined', kicker: 'Together with their families', badge: 'A timeless celebration', amp: '&', divider: '···', icon: '✦', rsvp: 'Kindly Reply', labels: { families: 'With the Blessings of', events: 'Order of Celebrations', dress: 'Dress Code', stay: 'Where to Stay', schedule: 'Day Schedule', ceremony: 'Holy Ceremony', reception: 'Reception & Dinner' }, style: vars('#f6f1ea', '#fffaf3', '#f0e5d8', '#281c14', '#7a6757', '#b98f5f', 'rgba(18,12,8,.78)') },
  romantic: { layout: 'soft', cards: 'rounded', title: 'scripted', kicker: 'Together with their families, joyfully invite you to celebrate', badge: 'Soft florals and candlelight', amp: '❦', divider: '✿ ✿ ✿', icon: '❤', rsvp: 'Reply with Love', labels: { families: 'With the blessings of their families', events: "The day's celebrations", dress: 'Dress Code', stay: 'Where to Stay', schedule: 'Day Schedule', ceremony: 'Ceremony', reception: 'Reception & Dinner' }, style: vars('#fff5f6', '#fffdfd', '#ffe9ee', '#46202e', '#9a6d7e', '#c85d7b', 'rgba(53,17,34,.82)') },
  modern: { layout: 'split', cards: 'sharp', title: 'uppercase', kicker: 'Wedding Invitation', badge: 'Minimal and high-contrast', amp: '— & —', divider: '■ ■ ■', icon: '◆', rsvp: 'Your Response', labels: { families: 'Families', events: 'Schedule', dress: 'Dress Code', stay: 'Stay', schedule: 'Timeline', ceremony: 'Ceremony', reception: 'Reception' }, style: vars('#0b1320', '#121f31', '#1a2c43', '#eef5ff', '#85a4c1', '#f5a623', 'rgba(10,17,30,.72)') },
  natural: { layout: 'soft', cards: 'rounded', title: 'lined', kicker: 'Together with their families', badge: 'Botanical garden celebration', amp: '✦', divider: '···', icon: '❋', rsvp: 'Kindly Reply', labels: { families: 'With the Blessings of', events: 'The Celebrations', dress: 'Dress Code', stay: 'Where to Stay', schedule: 'Day Schedule', ceremony: 'Ceremony', reception: 'Reception & Dinner' }, style: vars('#f6f4ed', '#fffef9', '#ebefe3', '#2e3025', '#6b7565', '#789b78', 'rgba(20,23,15,.84)') },
  'old-money': { layout: 'centered', cards: 'outlined', title: 'uppercase', kicker: 'A private celebration of marriage', badge: 'Monogram and heritage details', amp: '&', divider: '✦ ✦ ✦', icon: '♔', rsvp: 'Kindly Confirm', labels: { families: 'Honoring Family', events: 'Celebration Details', dress: 'Attire', stay: 'Guest Stays', schedule: 'Timeline', ceremony: 'Ceremony', reception: 'Dinner Reception' }, style: vars('#f5f0e8', '#fffcf7', '#ece2d3', '#1d1712', '#66584b', '#2e241d', 'rgba(18,14,11,.82)') },
  monochrome: { layout: 'split', cards: 'sharp', title: 'uppercase', kicker: 'A black tie invitation', badge: 'Monochrome editorial', amp: '/', divider: '▪ ▪ ▪', icon: '◩', rsvp: 'RSVP', labels: { families: 'Family', events: 'Event Map', dress: 'Dress Code', stay: 'Where to Stay', schedule: 'Running Order', ceremony: 'Ceremony', reception: 'Afterparty' }, style: vars('#111', '#181818', '#f4f4f4', '#f8f8f8', '#b9b9b9', '#ffffff', 'rgba(0,0,0,.74)') },
  rustic: { layout: 'carded', cards: 'paper', title: 'lined', kicker: 'A countryside wedding invitation', badge: 'Warm textures and vineyard tones', amp: '&', divider: '✦ · ✦', icon: '❈', rsvp: 'Please Let Us Know', labels: { families: 'Family and Friends', events: 'Wedding Day', dress: 'Dress Code', stay: 'Places to Stay', schedule: 'Day Plan', ceremony: 'Ceremony', reception: 'Barn Reception' }, style: vars('#f7f1ea', '#fffaf5', '#f0e1d2', '#3a2a20', '#7b6554', '#a36d46', 'rgba(32,18,12,.84)') },
  destination: { layout: 'postcard', cards: 'sunny', title: 'scripted', kicker: 'Pack your bags, we are getting married', badge: 'Coastal destination weekend', amp: '☼', divider: '☼ ☼ ☼', icon: '✺', rsvp: 'Save Your Spot', labels: { families: 'Meet the Hosts', events: 'Travel Itinerary', dress: 'Vacation Dress Code', stay: 'Travel & Stays', schedule: 'Weekend Flow', ceremony: 'Sunset Ceremony', reception: 'Beach Reception' }, style: vars('#f6fbff', '#ffffff', '#eef8ff', '#19384d', '#6387a0', '#1f89c4', 'rgba(16,59,84,.8)') },
  illustrated: { layout: 'framed', cards: 'gallery', title: 'scripted', kicker: 'An invitation with a sense of place', badge: 'Venue-story keepsake design', amp: '✧', divider: '✧ ✧ ✧', icon: '✎', rsvp: 'Share Your Reply', labels: { families: 'Family', events: 'Venue Story', dress: 'Style Notes', stay: 'Guest Guide', schedule: 'Celebration Flow', ceremony: 'Ceremony', reception: 'Reception' }, style: vars('#f2f4f8', '#ffffff', '#ebeff5', '#273243', '#68758a', '#607ba3', 'rgba(27,36,53,.82)') },
  'photo-story': { layout: 'story', cards: 'rounded', title: 'lined', kicker: 'A story told in photographs', badge: 'Digital-first photo narrative', amp: '+', divider: '● ● ●', icon: '◉', rsvp: 'Reply to the Story', labels: { families: 'Our People', events: 'The Day', dress: 'Dress Code', stay: 'Guest Stay', schedule: 'Story Timeline', ceremony: 'Ceremony', reception: 'Reception' }, style: vars('#f8f3f1', '#fffdfd', '#f1e5e1', '#31262f', '#7c6877', '#b87492', 'rgba(29,19,31,.84)') },
  whimsical: { layout: 'storybook', cards: 'soft', title: 'scripted', kicker: 'A fairytale invitation', badge: 'Dreamy pastel celebration', amp: '♡', divider: '☁ ☁ ☁', icon: '☽', rsvp: 'RSVP with a Wish', labels: { families: 'Our Favorite People', events: 'The Dream Day', dress: 'Dream Palette', stay: 'Stay Nearby', schedule: 'Flow of the Day', ceremony: 'Ceremony', reception: 'Celebration' }, style: vars('#fff7fb', '#ffffff', '#fbe7f2', '#4b3552', '#8f7092', '#c884a6', 'rgba(74,43,69,.8)') },
  'dark-romance': { layout: 'framed', cards: 'velvet', title: 'scripted', kicker: 'An evening celebration', badge: 'Moody florals and candlelight', amp: '✢', divider: '✢ ✢ ✢', icon: '✺', rsvp: 'Reply by Candlelight', labels: { families: 'Those We Honor', events: 'Evening Programme', dress: 'Evening Dress Code', stay: 'Stay the Night', schedule: 'Night Timeline', ceremony: 'Candlelit Ceremony', reception: 'Midnight Reception' }, style: vars('#120d14', '#1c1320', '#2b1b30', '#f6ecf2', '#b999ab', '#d27c99', 'rgba(9,5,10,.88)') },
}

function vars(bg, surface, alt, text, muted, accent, overlay) {
  return {
    '--ti-bg': bg,
    '--ti-surface': surface,
    '--ti-surface-alt': alt,
    '--ti-text': text,
    '--ti-muted': muted,
    '--ti-accent': accent,
    '--ti-accent-soft': `${accent}22`,
    '--ti-border': `${accent}33`,
    '--ti-overlay': `linear-gradient(180deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.24) 45%, ${overlay} 100%)`,
  }
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
  const rest = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return `${weekday} · ${rest}`
}

function sectionOf(invitation, type) {
  return (invitation.sections || []).find((item) => item.type === type) || null
}

const css = `
  .ti-page{min-height:100vh;background:var(--ti-bg);color:var(--ti-text);font-family:'Inter',system-ui,sans-serif}.ti-page *{box-sizing:border-box}.ti-wrap{width:min(1080px,calc(100vw - 1.5rem));margin:0 auto}.ti-page img{max-width:100%;display:block}
  .ti-env{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,var(--ti-surface) 0%,var(--ti-bg) 100%);cursor:pointer;transition:opacity .6s ease}.ti-env--opening{opacity:0;pointer-events:none}.ti-env__stack{text-align:center;display:grid;gap:1rem}.ti-env__title{color:var(--ti-accent);font-size:1rem;letter-spacing:.16em;text-transform:uppercase}.ti-env__body{position:relative;width:min(72vw,340px);aspect-ratio:5/3.3}.ti-env__back,.ti-env__front,.ti-env__flap,.ti-env__letter{position:absolute;inset:0;border:1px solid var(--ti-border);background:var(--ti-surface)}.ti-env__back{border-radius:18px;background:linear-gradient(180deg,var(--ti-surface) 0%,var(--ti-surface-alt) 100%)}.ti-env__front{clip-path:polygon(0 30%,50% 68%,100% 30%,100% 100%,0 100%);z-index:3}.ti-env__flap{clip-path:polygon(0 0,100% 0,50% 78%);transform-origin:top;transition:transform .68s cubic-bezier(.4,0,.2,1);z-index:4}.ti-env__letter{inset:15% 14%;border-radius:12px;transform:translateY(0);transition:transform .54s ease .18s;z-index:2;display:grid;place-items:center}.ti-env__seal{width:54px;height:54px;border-radius:999px;background:var(--ti-accent);color:#fff;display:grid;place-items:center;font-size:1.2rem}.ti-env--open .ti-env__flap{transform:perspective(800px) rotateX(-172deg)}.ti-env--open .ti-env__letter{transform:translateY(-22%)}
  .ti-hero{position:relative;min-height:100svh;display:grid;align-items:center}.ti-hero__media,.ti-hero__overlay{position:absolute;inset:0}.ti-hero__media{background-size:cover;background-position:center}.ti-hero__overlay{background:var(--ti-overlay)}.ti-hero__content{position:relative;z-index:1;padding:2rem 0}.ti-panel{width:min(680px,100%);padding:clamp(1.5rem,4vw,3rem);border:1px solid rgba(255,255,255,.16);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(12px);box-shadow:0 24px 60px rgba(0,0,0,.15);color:#fff}.layout-centered .ti-hero__content,.layout-soft .ti-hero__content,.layout-framed .ti-hero__content,.layout-carded .ti-hero__content,.layout-postcard .ti-hero__content,.layout-story .ti-hero__content,.layout-storybook .ti-hero__content{display:grid;justify-items:center}.layout-framed .ti-panel{border-radius:0}.layout-carded .ti-panel,.layout-postcard .ti-panel{transform:translateY(10%);background:var(--ti-surface);color:var(--ti-text);border-color:var(--ti-border)}.layout-split .ti-hero{grid-template-columns:1fr 1fr;background:var(--ti-bg)}.layout-split .ti-hero__media,.layout-split .ti-hero__overlay{inset:0 50% 0 0}.layout-split .ti-hero__content{display:grid;grid-template-columns:1fr 1fr;align-items:stretch}.layout-split .ti-panel{width:auto;border:none;border-left:1px solid var(--ti-border);border-radius:0;background:var(--ti-bg);color:var(--ti-text);display:flex;flex-direction:column;justify-content:center;box-shadow:none}.layout-split .ti-panel--spacer{display:block}.ti-panel--spacer{display:none}
  .ti-kicker{display:inline-flex;gap:.75rem;align-items:center;color:rgba(255,255,255,.84);font-size:.72rem;letter-spacing:.22em;text-transform:uppercase}.ti-kicker:before{content:'';width:32px;height:1px;background:currentColor}.layout-carded .ti-kicker,.layout-postcard .ti-kicker,.layout-split .ti-kicker,.layout-carded .ti-divider,.layout-postcard .ti-divider,.layout-split .ti-divider,.layout-carded .ti-amp,.layout-postcard .ti-amp,.layout-split .ti-amp{color:var(--ti-accent)}.ti-names{font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.8rem,9vw,5.2rem);line-height:.98;letter-spacing:-.03em;margin:1rem 0 .7rem}.title-uppercase .ti-names,.title-uppercase .ti-card__title{text-transform:uppercase;font-family:'Inter',system-ui,sans-serif;font-weight:800}.ti-amp{display:block;font-size:clamp(1.15rem,3vw,1.85rem);color:rgba(255,255,255,.8);margin:.5rem 0;letter-spacing:.16em}.ti-divider{font-size:.72rem;color:rgba(255,255,255,.7);letter-spacing:.24em;margin-bottom:1rem}.ti-date{font-size:.88rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.86)}.layout-carded .ti-date,.layout-postcard .ti-date,.layout-split .ti-date{color:var(--ti-muted)}.ti-badge{display:inline-flex;margin-top:1.25rem;padding:.5rem .95rem;border-radius:999px;background:var(--ti-accent-soft);border:1px solid var(--ti-border);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.ti-countdown{display:flex;gap:.85rem;flex-wrap:wrap;margin-top:1.5rem}.ti-countdown__unit{min-width:74px;padding:.75rem .6rem;border-radius:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);text-align:center}.layout-carded .ti-countdown__unit,.layout-postcard .ti-countdown__unit,.layout-split .ti-countdown__unit{background:var(--ti-surface-alt);border-color:var(--ti-border)}.ti-countdown__num{display:block;font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;line-height:1}.ti-countdown__label{display:block;margin-top:.3rem;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;opacity:.78}
  .ti-nav{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--ti-bg) 90%, transparent);border-bottom:1px solid var(--ti-border);backdrop-filter:blur(10px)}.ti-nav__inner{width:min(1080px,calc(100vw - 1.5rem));margin:0 auto;display:flex;justify-content:center;flex-wrap:wrap;gap:1.1rem 1.6rem;padding:.9rem 0}.ti-nav__link{text-decoration:none;text-transform:uppercase;letter-spacing:.18em;font-size:.66rem;color:var(--ti-muted);padding-bottom:.16rem;border-bottom:2px solid transparent;white-space:nowrap}.ti-nav__link:hover{color:var(--ti-accent);border-bottom-color:var(--ti-accent)}
  .ti-main{padding:clamp(2.4rem,6vw,4rem) 0 clamp(3rem,8vw,5rem)}.ti-section{padding:2rem 0;border-bottom:1px solid var(--ti-border)}.ti-title{display:flex;align-items:center;gap:.9rem;margin:0 0 1.6rem;color:var(--ti-accent);font-size:.76rem;letter-spacing:.26em;text-transform:uppercase}.title-scripted .ti-title{font-family:'Playfair Display',Georgia,serif;font-size:1.2rem;letter-spacing:.04em;text-transform:none;font-style:italic}.title-lined .ti-title:before,.title-lined .ti-title:after{content:'';flex:1;height:1px;background:var(--ti-border)}.ti-families,.ti-events,.ti-hotels{display:grid;gap:1rem}.ti-families{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.ti-events{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}.ti-hotels{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
  .ti-card{background:var(--ti-surface);border:1px solid var(--ti-border);border-radius:16px;box-shadow:0 16px 36px rgba(0,0,0,.05);overflow:hidden}.cards-outlined .ti-card{box-shadow:none}.cards-sharp .ti-card{border-radius:0}.cards-rounded .ti-card,.cards-soft .ti-card,.cards-sunny .ti-card,.cards-gallery .ti-card{border-radius:28px}.cards-paper .ti-card{background:linear-gradient(180deg,var(--ti-surface) 0%,var(--ti-surface-alt) 100%)}.cards-velvet .ti-card{background:linear-gradient(180deg,var(--ti-surface) 0%,color-mix(in srgb,var(--ti-surface) 84%, black) 100%)}.ti-card__body{padding:1.3rem}.ti-card__eyebrow{color:var(--ti-accent);font-size:.62rem;text-transform:uppercase;letter-spacing:.18em;margin-bottom:.45rem}.ti-card__title{font-family:'Playfair Display',Georgia,serif;font-size:1.15rem;margin:0 0 .35rem}.ti-card__text{color:var(--ti-muted);line-height:1.65;margin:0}.ti-card__photo{width:100%;aspect-ratio:16/9;object-fit:cover}.ti-pill{display:inline-flex;margin-top:.9rem;padding:.38rem .75rem;border-radius:999px;background:var(--ti-accent-soft);color:var(--ti-accent);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase}.ti-link{display:inline-flex;align-items:center;gap:.45rem;margin-top:.95rem;color:var(--ti-accent);text-decoration:none;font-size:.72rem;text-transform:uppercase;letter-spacing:.14em}
  .ti-dress{display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:1rem;align-items:start}.ti-dress__photo{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:16px;border:1px solid var(--ti-border)}.ti-dress__row+.ti-dress__row{margin-top:1rem}.ti-dress__label{display:block;color:var(--ti-accent);text-transform:uppercase;letter-spacing:.18em;font-size:.62rem;margin-bottom:.35rem}.ti-dress__value,.ti-dress__note{line-height:1.65;color:var(--ti-muted)}.ti-dress__note{padding-left:.85rem;border-left:2px solid var(--ti-accent)}.ti-swatches{display:flex;flex-wrap:wrap;gap:.55rem}.ti-swatches span{display:inline-flex;padding:.36rem .72rem;border-radius:999px;background:var(--ti-surface-alt);color:var(--ti-text);font-size:.76rem;border:1px solid var(--ti-border)}
  .ti-schedule{display:grid;gap:.9rem;position:relative}.ti-schedule:before{content:'';position:absolute;left:.3rem;top:.2rem;bottom:.2rem;width:1px;background:linear-gradient(180deg,var(--ti-accent),transparent)}.ti-schedule__item{display:grid;grid-template-columns:84px 1fr;gap:1rem;position:relative;padding-left:1.2rem}.ti-schedule__item:before{content:'';position:absolute;left:0;top:.45rem;width:.6rem;height:.6rem;border-radius:999px;background:var(--ti-accent)}.ti-schedule__time{color:var(--ti-accent);font-size:.7rem;text-transform:uppercase;letter-spacing:.18em}.ti-schedule__label{color:var(--ti-text);line-height:1.5}
  .ti-rsvp{padding:clamp(2.4rem,6vw,4rem) 0 4rem}.ti-rsvp__head{text-align:center;margin-bottom:2rem}.ti-rsvp__title{margin:.4rem 0;font-family:'Playfair Display',Georgia,serif;font-size:clamp(2rem,6vw,3.2rem)}.ti-rsvp__sub{color:var(--ti-muted);letter-spacing:.12em;text-transform:uppercase;font-size:.74rem}.ti-form{background:color-mix(in srgb,var(--ti-surface) 88%, transparent);border:1px solid var(--ti-border);border-radius:28px;padding:clamp(1.25rem,4vw,2rem);box-shadow:0 18px 42px rgba(0,0,0,.05)}.ti-field+.ti-field{margin-top:1rem}.ti-label{display:block;margin-bottom:.55rem;color:var(--ti-muted);font-size:.78rem}.ti-input,.ti-textarea,.ti-inline-input{width:100%;background:var(--ti-surface);color:var(--ti-text);border:1px solid var(--ti-border);border-radius:14px;padding:.82rem .95rem;outline:none}.ti-textarea{resize:vertical;min-height:110px;line-height:1.6}.ti-inline-input{margin-top:.7rem}.ti-toggle-row{display:flex;gap:.6rem;flex-wrap:wrap}.ti-toggle-btn{flex:1;min-width:140px;padding:.8rem 1rem;border:1px solid var(--ti-border);border-radius:14px;background:var(--ti-surface);color:var(--ti-muted);cursor:pointer}.ti-toggle-btn.active{color:var(--ti-accent);border-color:var(--ti-accent);background:var(--ti-accent-soft)}.ti-field--error .ti-label{color:#bc4a4a}.ti-field--error .ti-input,.ti-field--error .ti-textarea,.ti-field--error .ti-inline-input{border-color:#e0a4a4}.ti-field--error .ti-toggle-row{padding:.25rem;border-radius:14px;outline:1px solid #cc8f8f}.ti-children{display:flex;align-items:center;gap:.85rem;flex-wrap:wrap}.ti-children span{color:var(--ti-muted);font-size:.78rem}.ti-errors{margin-top:1rem;padding:.95rem 1.1rem;background:rgba(204,78,78,.08);border:1px solid rgba(204,78,78,.24);border-radius:14px;color:#a84040}.ti-errors p{margin:0 0 .4rem;font-weight:700}.ti-errors ul{margin:0;padding-left:1rem}.ti-actions{display:flex;gap:.8rem;margin-top:1.4rem;flex-wrap:wrap}.ti-btn{flex:1;min-width:180px;padding:.9rem 1.1rem;border-radius:14px;border:1px solid var(--ti-border);cursor:pointer}.ti-btn--primary{background:var(--ti-accent);color:#fff;border-color:transparent}.ti-btn--secondary{background:var(--ti-surface);color:var(--ti-text)}
  @media (max-width:860px){.layout-split .ti-hero{grid-template-columns:1fr}.layout-split .ti-hero__media,.layout-split .ti-hero__overlay{inset:0}.layout-split .ti-hero__content{grid-template-columns:1fr}.layout-split .ti-panel--spacer{display:none}.layout-split .ti-panel{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.04));color:#fff;border:1px solid rgba(255,255,255,.16);border-radius:28px;box-shadow:0 24px 60px rgba(0,0,0,.15)}.layout-split .ti-kicker,.layout-split .ti-divider,.layout-split .ti-amp,.layout-split .ti-date{color:rgba(255,255,255,.84)}.layout-split .ti-countdown__unit{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.16)}}
  @media (max-width:700px){.ti-wrap{width:min(100vw - 1rem,1080px)}.ti-hero{min-height:auto}.ti-hero__content{padding:1rem 0 1.5rem}.ti-panel{width:100%;padding:1.1rem 1rem 1.35rem;border-radius:20px}.layout-framed .ti-panel,.layout-split .ti-panel{border-radius:20px}.layout-carded .ti-panel,.layout-postcard .ti-panel{transform:none}.ti-kicker{display:flex;justify-content:center;gap:.55rem;font-size:.58rem;letter-spacing:.16em;text-align:center}.ti-kicker:before{width:20px}.ti-names{font-size:clamp(2.2rem,13vw,3.35rem);margin:.8rem 0 .55rem;word-break:break-word}.ti-amp{font-size:1rem;margin:.3rem 0}.ti-divider{font-size:.58rem;letter-spacing:.16em;margin-bottom:.7rem}.ti-date{font-size:.72rem;line-height:1.5}.ti-badge{margin-top:.85rem;padding:.45rem .75rem;font-size:.62rem;letter-spacing:.08em;text-align:center}.ti-countdown{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin-top:1rem}.ti-countdown__unit{min-width:0;padding:.6rem .45rem;border-radius:14px}.ti-countdown__num{font-size:1.35rem}.ti-countdown__label{font-size:.52rem;letter-spacing:.14em}.ti-nav__inner{justify-content:flex-start;flex-wrap:nowrap;overflow-x:auto;gap:.85rem;padding:.75rem 0 .8rem;scrollbar-width:none}.ti-nav__inner::-webkit-scrollbar{display:none}.ti-nav__link{font-size:.58rem;letter-spacing:.12em;flex:0 0 auto}.ti-main{padding:1.4rem 0 2.2rem}.ti-section{padding:1.35rem 0}.ti-title{margin:0 0 1rem;font-size:.62rem;letter-spacing:.16em}.title-scripted .ti-title{font-size:1rem}.title-lined .ti-title:before,.title-lined .ti-title:after{max-width:42px}.ti-families,.ti-events,.ti-hotels{grid-template-columns:1fr;gap:.75rem}.ti-card,.cards-rounded .ti-card,.cards-soft .ti-card,.cards-sunny .ti-card,.cards-gallery .ti-card{border-radius:18px}.cards-sharp .ti-card{border-radius:12px}.ti-card__body{padding:1rem}.ti-card__title{font-size:1rem}.ti-card__text{font-size:.9rem}.ti-pill{font-size:.62rem;padding:.32rem .65rem}.ti-link{font-size:.64rem;letter-spacing:.1em}.ti-dress{grid-template-columns:1fr;gap:.85rem}.ti-dress__photo{max-width:100%;aspect-ratio:4/5}.ti-dress__label{font-size:.56rem}.ti-swatches{gap:.45rem}.ti-swatches span{font-size:.68rem;padding:.3rem .6rem}.ti-schedule{gap:.75rem;padding-left:0}.ti-schedule:before{left:.25rem}.ti-schedule__item{grid-template-columns:1fr;gap:.18rem;padding-left:1rem}.ti-schedule__item:before{top:.38rem;width:.5rem;height:.5rem}.ti-schedule__time{font-size:.62rem;letter-spacing:.12em}.ti-schedule__label{font-size:.92rem}.ti-rsvp{padding:1.5rem 0 2.4rem}.ti-rsvp__head{margin-bottom:1.1rem}.ti-rsvp__title{font-size:clamp(1.7rem,10vw,2.35rem)}.ti-rsvp__sub{font-size:.64rem;letter-spacing:.08em;line-height:1.5}.ti-form{padding:1rem .9rem 1.1rem;border-radius:20px}.ti-label{font-size:.74rem}.ti-input,.ti-textarea,.ti-inline-input{padding:.76rem .82rem;border-radius:12px}.ti-toggle-row{gap:.45rem}.ti-toggle-btn{min-width:0;width:100%;padding:.72rem .8rem;border-radius:12px;font-size:.84rem}.ti-children{align-items:flex-start;gap:.65rem}.ti-inline-input[style]{width:100%!important}.ti-errors{padding:.8rem .9rem;border-radius:12px}.ti-actions{gap:.6rem}.ti-btn{min-width:100%;width:100%;padding:.82rem 1rem;border-radius:12px}}
`

function EnvelopeIntro({ opening, onOpen, theme }) {
  return (
    <div className={`ti-env${opening ? ' ti-env--opening' : ''}`} onClick={onOpen} role="button" aria-label="Open invitation">
      <div className="ti-env__stack">
        <div className="ti-env__title">Open your invitation</div>
        <div className={`ti-env__body${opening ? ' ti-env--open' : ''}`}>
          <div className="ti-env__back" />
          <div className="ti-env__letter">
            <div className="ti-env__seal">{theme.icon}</div>
          </div>
          <div className="ti-env__front" />
          <div className="ti-env__flap" />
        </div>
      </div>
    </div>
  )
}

function FamilyCard({ role, name }) {
  return (
    <article className="ti-card">
      <div className="ti-card__body">
        <div className="ti-card__eyebrow">{role}</div>
        <h3 className="ti-card__title">{name}</h3>
      </div>
    </article>
  )
}

function EventCard({ type, title, address, time, dateText, mapUrl, photoUrl }) {
  return (
    <article className="ti-card">
      {photoUrl && <img className="ti-card__photo" src={photoUrl} alt={title} />}
      <div className="ti-card__body">
        <div className="ti-card__eyebrow">{type}</div>
        <h3 className="ti-card__title">{title}</h3>
        <p className="ti-card__text">
          {address ? (
            <>
              {address}
              <br />
              {dateText}
            </>
          ) : dateText}
        </p>
        {time && <span className="ti-pill">{time}</span>}
        {mapUrl && (
          <a className="ti-link" href={mapUrl} target="_blank" rel="noreferrer">
            View on map
          </a>
        )}
      </div>
    </article>
  )
}

function AccommodationCard({ hotel }) {
  return (
    <article className="ti-card">
      <div className="ti-card__body">
        <h3 className="ti-card__title">{hotel.name}</h3>
        {hotel.distance && <div className="ti-card__eyebrow">{hotel.distance} from venue</div>}
        {hotel.note && <p className="ti-card__text">{hotel.note}</p>}
        {hotel.bookingLink && (
          <a className="ti-link" href={hotel.bookingLink} target="_blank" rel="noreferrer">
            Book now
          </a>
        )}
      </div>
    </article>
  )
}

function RsvpForm({ invitationRef, menuOptions, theme }) {
  const { t } = useTranslation()
  const menuChoices = menuOptions?.length ? menuOptions : DEFAULT_MENU_OPTIONS
  const [guestName, setGuestName] = useState('')
  const [attending, setAttending] = useState(null)
  const [partnerName, setPartnerName] = useState('')
  const [plusOne, setPlusOne] = useState(null)
  const [menu, setMenu] = useState(menuChoices[0] || '')
  const [children, setChildren] = useState(null)
  const [childCount, setChildCount] = useState('')
  const [transport, setTransport] = useState(null)
  const [allergies, setAllergies] = useState(null)
  const [allergyDetails, setAllergyDetails] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!guestName.trim()) nextErrors.guestName = 'Your name is required'
    if (!attending) nextErrors.attending = 'Please choose whether you can attend'
    if (attending === 'yes' && plusOne === 'yes' && !partnerName.trim()) nextErrors.partnerName = "Partner's name is required"
    if (attending === 'yes' && !menu) nextErrors.menu = 'Select a menu preference'
    return nextErrors
  }

  const resetForm = () => {
    setGuestName('')
    setAttending(null)
    setPartnerName('')
    setPlusOne(null)
    setMenu(menuChoices[0] || '')
    setChildren(null)
    setChildCount('')
    setTransport(null)
    setAllergies(null)
    setAllergyDetails('')
  }

  const handleSubmit = async (answer) => {
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/invitations/${invitationRef}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          answer,
          partnerName: plusOne === 'yes' ? partnerName.trim() : null,
          menuPreference: attending === 'yes' ? menu : null,
          children: children === 'yes' ? Number(childCount || 0) || 0 : 0,
          transport: transport === 'yes' ? true : transport === 'no' ? false : null,
          allergies: allergies === 'yes' ? allergyDetails.trim() || 'Yes' : null,
          notes: notes.trim() || null,
        }),
      })
      if (!response.ok) throw new Error('Failed to submit RSVP')
      resetForm()
      setNotes(answer === 'DECLINED' ? "We'll miss you." : 'Thank you, your response has been saved.')
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      setSubmitError(t('rsvp_common.submit_error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="ti-form">
      <div className={`ti-field${errors.guestName ? ' ti-field--error' : ''}`}>
        <label className="ti-label">Your name</label>
        <input className="ti-input" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Enter your full name" />
      </div>

      <div className={`ti-field${errors.attending ? ' ti-field--error' : ''}`}>
        <label className="ti-label">Will you join us?</label>
        <div className="ti-toggle-row">
          <button type="button" className={`ti-toggle-btn${attending === 'yes' ? ' active' : ''}`} onClick={() => setAttending('yes')}>Happily attending</button>
          <button type="button" className={`ti-toggle-btn${attending === 'no' ? ' active' : ''}`} onClick={() => setAttending('no')}>Unable to attend</button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          <div className={`ti-field${errors.partnerName ? ' ti-field--error' : ''}`}>
            <label className="ti-label">Will you bring a plus one?</label>
            <div className="ti-toggle-row">
              <button type="button" className={`ti-toggle-btn${plusOne === 'yes' ? ' active' : ''}`} onClick={() => setPlusOne('yes')}>Yes</button>
              <button type="button" className={`ti-toggle-btn${plusOne === 'no' ? ' active' : ''}`} onClick={() => setPlusOne('no')}>No</button>
            </div>
            {plusOne === 'yes' && <input className="ti-inline-input" value={partnerName} onChange={(event) => setPartnerName(event.target.value)} placeholder="Partner's name" />}
          </div>

          <div className={`ti-field${errors.menu ? ' ti-field--error' : ''}`}>
            <label className="ti-label">Menu preference</label>
            <div className="ti-toggle-row">
              {menuChoices.map((choice) => (
                <button key={choice} type="button" className={`ti-toggle-btn${menu === choice ? ' active' : ''}`} onClick={() => setMenu(choice)}>
                  {choice}
                </button>
              ))}
            </div>
          </div>

          <div className="ti-field">
            <label className="ti-label">Bringing children?</label>
            <div className="ti-children">
              <div className="ti-toggle-row">
                <button type="button" className={`ti-toggle-btn${children === 'yes' ? ' active' : ''}`} onClick={() => setChildren('yes')}>Yes</button>
                <button type="button" className={`ti-toggle-btn${children === 'no' ? ' active' : ''}`} onClick={() => setChildren('no')}>No</button>
              </div>
              {children === 'yes' && (
                <>
                  <span>How many?</span>
                  <input className="ti-inline-input" style={{ width: '90px', marginTop: 0 }} type="number" min={1} max={10} value={childCount} onChange={(event) => setChildCount(event.target.value)} />
                </>
              )}
            </div>
          </div>

          <div className="ti-field">
            <label className="ti-label">Do you need transportation?</label>
            <div className="ti-toggle-row">
              <button type="button" className={`ti-toggle-btn${transport === 'yes' ? ' active' : ''}`} onClick={() => setTransport('yes')}>Yes, please</button>
              <button type="button" className={`ti-toggle-btn${transport === 'no' ? ' active' : ''}`} onClick={() => setTransport('no')}>No, thank you</button>
            </div>
          </div>

          <div className="ti-field">
            <label className="ti-label">Any food allergies?</label>
            <div className="ti-toggle-row">
              <button type="button" className={`ti-toggle-btn${allergies === 'yes' ? ' active' : ''}`} onClick={() => setAllergies('yes')}>Yes</button>
              <button type="button" className={`ti-toggle-btn${allergies === 'no' ? ' active' : ''}`} onClick={() => setAllergies('no')}>No</button>
            </div>
            {allergies === 'yes' && <input className="ti-inline-input" value={allergyDetails} onChange={(event) => setAllergyDetails(event.target.value)} placeholder="Please describe your allergies" />}
          </div>
        </>
      )}

      <div className="ti-field">
        <label className="ti-label">{attending === 'yes' ? 'Questions or comments' : 'Message (optional)'}</label>
        <textarea className="ti-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={attending === 'yes' ? 'Dietary needs, special requests, or a note for the couple' : 'Share a message for the couple'} />
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="ti-errors">
          <p>Please fill in the following:</p>
          <ul>{Object.values(errors).map((message, index) => <li key={index}>{message}</li>)}</ul>
        </div>
      )}
      {submitError && <div className="ti-errors" role="alert"><p>{submitError}</p></div>}

      {attending && (
        <div className="ti-actions">
          {attending === 'yes' && <button type="button" className="ti-btn ti-btn--primary" disabled={submitting} onClick={() => handleSubmit('ACCEPTED')}>{submitting ? 'Submitting...' : theme.rsvp}</button>}
          {attending === 'no' && <button type="button" className="ti-btn ti-btn--secondary" disabled={submitting} onClick={() => handleSubmit('DECLINED')}>{submitting ? 'Submitting...' : 'Send decline'}</button>}
        </div>
      )}
    </div>
  )
}

export default function ThemedInvitation({ themeKey = 'classic', invitationRef, invitationData }) {
  const { ref: routeRef } = useParams()
  const theme = THEMES[themeKey] || THEMES.classic
  const [invitation, setInvitation] = useState(invitationData || null)
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), [])
  const isPreview = searchParams.get('preview') === 'true'
  const isEmbeddedPreview = searchParams.get('embed') === 'true'
  const [phase, setPhase] = useState(isPreview ? 'open' : 'closed')

  useEffect(() => {
    if (invitationData) {
      setInvitation(invitationData)
      return
    }
    const ref = invitationRef || routeRef
    if (!ref) return
    fetch(`/api/invitations/${ref}`)
      .then((response) => response.json())
      .then(setInvitation)
      .catch(console.error)
  }, [invitationData, invitationRef, routeRef])

  const handleOpen = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    window.setTimeout(() => setPhase('open'), 1000)
  }

  if (!invitation) {
    return <div className="ti-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Loading...</div>
  }

  const dateText = fmtDate(invitation.eventDate)
  const countdown = useCountdown(invitation.eventDate)
  const isDraft = invitation.status === 'DRAFT'
  const isPastEvent = invitation.eventDate && new Date(invitation.eventDate) < new Date()
  const dressCode = sectionOf(invitation, 'DRESS_CODE')
  const accommodation = sectionOf(invitation, 'ACCOMMODATION')
  const daySchedule = sectionOf(invitation, 'DAY_SCHEDULE')
  const families = [
    invitation.groomParents ? { role: 'Parents of the Groom', name: invitation.groomParents } : null,
    invitation.brideParents ? { role: 'Parents of the Bride', name: invitation.brideParents } : null,
    invitation.godparents ? { role: 'Godparents', name: invitation.godparents } : null,
  ].filter(Boolean)

  return (
    <div className={`ti-page layout-${theme.layout} cards-${theme.cards} title-${theme.title}`} style={theme.style}>
      <style>{css}</style>
      {phase !== 'open' && <EnvelopeIntro opening={phase === 'opening'} onOpen={handleOpen} theme={theme} />}

      <section className="ti-hero">
        <div className="ti-hero__media" style={{ backgroundImage: `url('${invitation.backgroundImageUrl}')` }} />
        <div className="ti-hero__overlay" />
        <div className="ti-hero__content">
          <div className="ti-panel--spacer" />
          <div className="ti-wrap">
            <div className="ti-panel">
              <div className="ti-kicker">{theme.kicker}</div>
              <h1 className="ti-names">
                {invitation.groomName}
                <span className="ti-amp">{theme.amp}</span>
                {invitation.brideName}
              </h1>
              <div className="ti-divider">{theme.divider}</div>
              <div className="ti-date">{dateText}</div>
              {(invitation.ceremonyVenue || invitation.receptionVenue) && <div className="ti-badge">{theme.badge}</div>}
              {countdown && (
                <div className="ti-countdown">
                  {[
                    ['Days', countdown.days],
                    ['Hours', countdown.hours],
                    ['Min', countdown.minutes],
                    ['Sec', countdown.seconds],
                  ].map(([label, value]) => (
                    <div key={label} className="ti-countdown__unit">
                      <span className="ti-countdown__num">{String(value).padStart(2, '0')}</span>
                      <span className="ti-countdown__label">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <nav className="ti-nav">
        <div className="ti-nav__inner">
          {families.length > 0 && <a className="ti-nav__link" href="#families">Families</a>}
          {(invitation.ceremonyVenue || invitation.receptionVenue) && <a className="ti-nav__link" href="#celebrations">Celebrations</a>}
          {dressCode && <a className="ti-nav__link" href="#dress-code">Dress Code</a>}
          {accommodation && <a className="ti-nav__link" href="#accommodation">Stay</a>}
          {daySchedule && <a className="ti-nav__link" href="#day-schedule">Schedule</a>}
          <a className="ti-nav__link" href="#rsvp">RSVP</a>
        </div>
      </nav>

      <main className="ti-main">
        <div className="ti-wrap">
          {families.length > 0 && (
            <section className="ti-section" id="families">
              <h2 className="ti-title">{theme.labels.families}</h2>
              <div className="ti-families">{families.map((family) => <FamilyCard key={family.role} role={family.role} name={family.name} />)}</div>
            </section>
          )}

          {(invitation.ceremonyVenue || invitation.receptionVenue) && (
            <section className="ti-section" id="celebrations">
              <h2 className="ti-title">{theme.labels.events}</h2>
              <div className="ti-events">
                {invitation.ceremonyVenue && <EventCard type={theme.labels.ceremony} title={invitation.ceremonyVenue} address={invitation.ceremonyAddress} time={invitation.ceremonyTime} dateText={dateText} mapUrl={invitation.ceremonyMapUrl} photoUrl={invitation.ceremonyPhotoUrl} />}
                {invitation.receptionVenue && <EventCard type={theme.labels.reception} title={invitation.receptionVenue} address={invitation.receptionAddress} time={invitation.receptionTime} dateText={dateText} mapUrl={invitation.receptionMapUrl} photoUrl={invitation.receptionPhotoUrl} />}
              </div>
            </section>
          )}

          {dressCode && (
            <section className="ti-section" id="dress-code">
              <h2 className="ti-title">{theme.labels.dress}</h2>
              <div className="ti-dress">
                {dressCode.dressCodeImageUrl && <img className="ti-dress__photo" src={dressCode.dressCodeImageUrl} alt="Dress code" />}
                <div>
                  {dressCode.dressCodeFormality && <div className="ti-dress__row"><span className="ti-dress__label">Formality</span><div className="ti-dress__value">{dressCode.dressCodeFormality}</div></div>}
                  {dressCode.dressCodeColours && <div className="ti-dress__row"><span className="ti-dress__label">Colour Palette</span><div className="ti-swatches">{dressCode.dressCodeColours.split(',').map((colour) => <span key={colour}>{colour.trim()}</span>)}</div></div>}
                  {dressCode.dressCodeNote && <div className="ti-dress__row"><span className="ti-dress__label">Note</span><div className="ti-dress__note">{dressCode.dressCodeNote}</div></div>}
                </div>
              </div>
            </section>
          )}

          {accommodation?.hotels?.length > 0 && (
            <section className="ti-section" id="accommodation">
              <h2 className="ti-title">{theme.labels.stay}</h2>
              <div className="ti-hotels">{accommodation.hotels.map((hotel, index) => <AccommodationCard key={`${hotel.name}-${index}`} hotel={hotel} />)}</div>
            </section>
          )}

          {daySchedule?.scheduleItems?.length > 0 && (
            <section className="ti-section" id="day-schedule">
              <h2 className="ti-title">{theme.labels.schedule}</h2>
              <div className="ti-schedule">
                {daySchedule.scheduleItems.map((item, index) => (
                  <div key={`${item.time}-${index}`} className="ti-schedule__item">
                    <div className="ti-schedule__time">{item.time}</div>
                    <div className="ti-schedule__label">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <section className="ti-rsvp" id="rsvp">
        <div className="ti-wrap">
          {isDraft ? (
            <div className="ti-form" style={{ textAlign: 'center' }}>
              <div className="ti-title" style={{ justifyContent: 'center' }}>Coming Soon</div>
              <h2 className="ti-rsvp__title">Invitation draft</h2>
              <p className="ti-rsvp__sub">This invitation has not been published yet.</p>
            </div>
          ) : isPastEvent ? (
            <div className="ti-form" style={{ textAlign: 'center' }}>
              <div className="ti-title" style={{ justifyContent: 'center' }}>Thank You</div>
              <h2 className="ti-rsvp__title">What a celebration</h2>
              <p className="ti-rsvp__sub">We hope you enjoyed celebrating with us.</p>
            </div>
          ) : isEmbeddedPreview ? (
            <div className="ti-form" style={{ textAlign: 'center' }}>
              <div className="ti-title" style={{ justifyContent: 'center' }}>Live Preview</div>
              <h2 className="ti-rsvp__title">RSVP preview</h2>
              <p className="ti-rsvp__sub">Open the full demo to interact with RSVP fields.</p>
            </div>
          ) : (
            <>
              <div className="ti-rsvp__head">
                <div className="ti-title" style={{ justifyContent: 'center' }}>RSVP</div>
                <h2 className="ti-rsvp__title">{theme.rsvp}</h2>
                {invitation.rsvpDeadline && <p className="ti-rsvp__sub">Please respond by {invitation.rsvpDeadline}</p>}
              </div>
              <RsvpForm invitationRef={invitationRef || routeRef} menuOptions={invitation.menuOptions} theme={theme} />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
