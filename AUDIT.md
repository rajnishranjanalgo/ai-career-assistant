# Accessibility and Performance Audit

## 1. Lighthouse Mobile Audit — Before

The initial Lighthouse Mobile audit was performed against the deployed CareerGuide AI application.

### Baseline Results

| Metric | Before |
|---|---:|
| Performance | 98 |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

![Lighthouse Before](./audit-screenshots/lighthouse-mobile.png)

---

## 2. WAVE Accessibility Audit

WAVE was used to check the deployed CareerGuide AI application.

### Results

| Metric | Result |
|---|---:|
| Errors | 0 |
| Contrast Errors | 0 |
| Alerts | 0 |
| AIM Score | 10/10 |

![WAVE Accessibility Audit](./audit-screenshots/wave-accessibility.png)

---

## 3. Accessibility Improvements

The following accessibility improvements were implemented and verified:

- Added accessible labels for interactive controls.
- Added visible keyboard focus states.
- Added `aria-live` for AI response and status updates.
- Added a keyboard-reachable Stop button during streaming.
- Added an accessible error state with Retry.
- Tested the primary flow using keyboard navigation.
- Verified the responsive mobile layout.

---

## 4. Performance Improvements

The application was kept lightweight and optimized for the frontend audit:

- Kept the application lightweight with a simple UI.
- Avoided unnecessary large assets.
- Tested the deployed application using Lighthouse Mobile.
- Verified the application at a mobile viewport.

---

## 5. Lighthouse Mobile Audit — After

A second Lighthouse Mobile audit was performed after the accessibility improvements.

### Final Results

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Performance | 98 | 97 | -1 |
| Accessibility | 95 | 95 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |

![Lighthouse After](./audit-screenshots/lighthouse-mobile-after.png)

> Note: Lighthouse scores can vary slightly between runs because they depend on runtime conditions. The Performance score changed from 98 to 97, while Accessibility remained at 95.

---

## 6. Final Audit Summary

| Audit | Result |
|---|---:|
| Lighthouse Performance | 97 |
| Lighthouse Accessibility | 95 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| WAVE Errors | 0 |
| WAVE Contrast Errors | 0 |
| WAVE Alerts | 0 |
| WAVE AIM Score | 10/10 |

### Accessibility Verification

- Primary flow tested using keyboard navigation.
- AI streaming status uses `aria-live`.
- Stop button is keyboard reachable.
- Error state provides a Retry action.
- Interactive controls have accessible labels and focus states.

---

## Conclusion

The deployed CareerGuide AI application was audited for accessibility and performance.

Lighthouse Mobile achieved scores above the recommended 90 target for both Performance and Accessibility. The final scores were 97 for Performance and 95 for Accessibility.

WAVE reported zero errors, zero contrast errors, and zero alerts, with an AIM Score of 10/10.

The application also passed a keyboard-only check of the primary flow, including the AI chat interaction and Stop button.