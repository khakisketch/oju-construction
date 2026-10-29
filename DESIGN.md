# Design

<!-- impeccable:design-schema 1 -->

## World

**As-built dossier / section drawing.** The page is a working construction document, not a brochure: warm concrete paper, graphite rules, measured labels, a section drawing that carries the first viewport, and data set in tables rather than cards. The visitor should feel they are reading a company that documents its work, not one that advertises it.

This is a replacement world for the renewal surface at `/renewal`. The incumbent blue-and-photo brochure remains the current production site until the renewal is approved.

## Tokens

### Color

| Token | Value | Role |
|---|---|---|
| `--ink` | `#1e2328` | body, rules, dark panels |
| `--ink-soft` | `#343a3f` | secondary body |
| `--paper` | `#f4f1ea` | page ground |
| `--paper-deep` | `#ece7dc` | recessed ground |
| `--white` | `#fcfbf8` | document surface |
| `--concrete` | `#e4dfd4` | table heads, quiet fills |
| `--line` | `#cfc8ba` | hairline rules |
| `--line-strong` | `#a9a192` | stronger rules, borders |
| `--steel` | `#2c4652` | drafting blue, links |
| `--steel-light` | `#54707b` | secondary steel |
| `--orange` | `#d9552a` | safety accent, drawing marks |
| `--orange-ink` | `#b9471f` | orange text on light ground |
| `--green` | `#5e7a5a` | planting / landscape |
| `--muted` | `#646a6d` | labels, secondary copy |
| `--muted-light` | `#8b9194` | tertiary metadata |

Rules: orange is a marking color, never a field. It appears in rules, dots, small labels, and one emphasis per section. Large orange fields are forbidden. On dark panels, use `#f3b49a` for accent labels, not pure orange.

### Type

- Display / numbers / Latin labels: **Archivo** (`--font-archivo`), weights 400–800, tracking `-0.04em` to `-0.02em`.
- Korean body: **Noto Sans KR**, weights 400/500/700/900, line-height 1.65–1.8.
- Micro labels: 9–11px, uppercase, `letter-spacing: 0.12em–0.16em`, Archivo 700.
- Section titles: `clamp(34px, 4.1vw, 56px)`, line-height 1.02, tracking `-0.04em`.
- Hero title: `clamp(48px, 6.1vw, 88px)`, line-height 0.98, tracking `-0.045em`.
- Body: 14–17px, max measure 54–56ch.
- Numbers: tabular numerals wherever data is compared.

### Space and grid

- Max width: 1440px.
- Page padding: 48px desktop, 20px mobile.
- Section padding: 96px desktop, 64px mobile.
- 12-column grid; section headers are a 0.95fr / 1.05fr split, collapsing to one column at 1180px.
- Rules are 1px `--line`; the top rule of a table is 1px `--ink`.
- No rounded cards except the logo mark. Buttons, inputs, and panels are square (0 radius).

### Motion

- One authored moment: the section drawing draws itself on first load (`stroke-dashoffset` 1.6s), then the five layer labels fade in.
- Hero copy rises 14px over 700ms with a 80–290ms stagger.
- No scroll-triggered reveals, no parallax, no auto-carousel.
- `prefers-reduced-motion: reduce` removes all transforms and drawing animation.

## Components

- **Header:** 72px sticky, paper at 94% with 14px blur, 1px bottom rule. Wordmark + 6 nav links + phone + square brochure CTA. Mobile: 64px, menu panel.
- **Button:** 48px min height, 1px ink border, square. Primary = ink field / white text; hover = orange field. Ghost = transparent / ink text.
- **Proof strip:** 5-column legal grid on white, 1px rules. Values 13px Archivo 700.
- **Scope table:** 4-column row (number, name, description, action), 1px rules, hover tint at 4.5% orange.
- **Interface panel:** 1px outer rule, 1px gutter, white vs ink panels, 64px count, 5 stacked chips.
- **Field record:** full-bleed photo, 96%→12% dark gradient, 58px title, 4 tag chips, translucent data panel.
- **Matrix:** 4-column table, orange dot / outlined dot / faint dot; legend in 10px muted.
- **Process:** 5 equal columns with 1px rules, 11px orange index, 15px title.
- **Standards:** ink field, 56px title with one peach italic-free emphasis, 4-column rule grid.
- **Contact:** 3 path cards in a rule grid + 2-column form, 44px inputs, square submit.
- **Footer:** ink field, 4-column legal grid, white wordmark, explicit “official site” disambiguation note.

## Do

- Use real company facts: 상호, 대표, 사업자등록번호, 소재지, 전화. These are the brand disambiguation layer.
- Use drawings, tables, and measured labels to carry the page.
- Let one section be quiet after a dense one.
- Show the scope in the first viewport.
- Label synthetic, stock, or concept imagery explicitly.

## Don't

- No stock handshake, crane-only hero, or generic “기술의 정교함” slogan.
- No AI mockup presented as a real project.
- No watermark-bearing images.
- No “최고”, “1등”, “15+ 면허”, “200+ 프로젝트” unless verified.
- No card grid as the page structure; no rounded pill buttons; no gradient text.
- No auto-rotating hero.
- No orange field larger than a rule, dot, or small label.
