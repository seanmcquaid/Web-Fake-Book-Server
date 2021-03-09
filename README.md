# Web Fake Book - Client

## Architecture

- Mongoose + MongoDB
- Node.js + TypeScript
- Express

## Testing Strategy

### Integration Testing

I decided to try using SuperTest with Jasmine as I found it easier to do Integration Testing with appropriate mocking for my Mongoose models. I have covered each endpoint for each scenario possible. I didn't feel the need to unit test necessarily as all the parts are working together appropriately and validated through Integration Testing.
