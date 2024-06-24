# NousRoutes API

## requirements

- node 20+
- a postgres database

## setup

- create the database
- copy `.env.template` to `.env` and fill the values (frontend is listening for port 5000)
- run migration `npm run migration:run`
- start the app in dev mode: `npm run start:dev`
- start the app in production mode: `npm run start`

## improvements:

- better type validation on the graphql resolver
- CI/CD pipeline based on your providers (gihub/gitlab + hosting)
- real E2E test scheduled daily on the deployed API
- moods to a real table to allow more flexibility
- remove seed from migration and create a real seed script


# Full stack Typescript hiring test

## Use case
Implement a checkout process for WeRoad users to buy a Travel where:
- the user can select a travel to book;
- the user inputs an email and the number of seats to reserve;
- the user pays the total amount to confirm the booking (FAKE payment step);

### Requirements
- A Travel has a max capacity of 5 seats;
- After confirming the number of seats to reserve the availability should be granted for 15 minutes before the cart expires;

**Note:** Implementing a back-office or the integration with a real payment provider is NOT a requirement.

## Tech stack
- Relational database
- Typescript
- Nestjs
- GraphQL
- Nuxt 3
- Tailwind: any styling solution based on Tailwind

**Note**: If you need to change the tech stack you should first agree with us before submitting the test.

## Evaluation points
- Code quality
- Code readability and organization
- Testing
- Solution architecture
- Reasoning
- Ability to document your solution (e.g. instructions, reasoning behind decisions, etc...)
- UI/UX patterns

## Notes
- In the `samples` folder you can find JSON files containing fake data to get started with
