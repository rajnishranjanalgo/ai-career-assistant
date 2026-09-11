# Deployment Checklist

## Pre-Deployment

- [x] Production build passes with `npm run build`
- [x] Vitest test suite passes with 12/12 tests
- [x] GitHub Actions CI is configured
- [x] Production environment variable `GROQ_API_KEY` is configured in Vercel
- [x] AI API key is kept server-side
- [x] Chat API input limits are enabled
- [x] Streaming API has a 30-second `maxDuration`
- [x] Error and retry states are implemented
- [x] Stop response control is available during streaming
- [x] Accessibility audit completed
- [x] Lighthouse Mobile audit completed
- [x] WAVE audit completed

## Production Verification

- [x] Production URL loads successfully
- [x] AI chat works in production
- [x] Streaming responses work
- [x] Resume analysis tool works
- [x] Error/retry behavior is available
- [x] Keyboard navigation works
- [x] Mobile layout works

## Safe Failure

The application validates incoming chat requests before sending them
to the AI provider.

Current limits:

- Maximum 20 messages per request
- Maximum 4,000 characters per text message
- Maximum 30 seconds for a streaming request

If the AI request fails, the API returns an error response and the
frontend displays an error/retry state instead of silently failing.

## Rollback

If a production deployment introduces a regression:

1. Open the Vercel project.
2. Open the Deployments section.
3. Select the last known working deployment.
4. Promote/redeploy that deployment.
5. Verify the production URL and AI chat flow.

## Monitoring

Production deployments and runtime issues can be checked through:

- Vercel deployment status
- Vercel runtime/deployment logs
- GitHub Actions CI results

## Post-Deployment

- [x] Verify the production URL
- [x] Verify AI chat
- [x] Verify resume analysis
- [x] Verify accessibility behavior
- [x] Verify mobile behavior