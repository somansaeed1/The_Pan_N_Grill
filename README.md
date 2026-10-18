# The Pan N Grill

Ordering website for The Pan N Grill, a restaurant at Adhiwal Chowk, Jhang. Customers pick items from the menu, check whether delivery is available at their address, and send the order to the restaurant on WhatsApp.

The repository is a monorepo with a Next.js frontend and an Express backend.

## Structure

```
frontend/    Next.js 15 app (App Router, TypeScript, Tailwind CSS)
backend/     Express API
package.json npm workspace root and shared scripts
vercel.json  Vercel settings for the frontend
```

Inside `frontend/`:

```
app/         Routes: home, menu, checkout, delivery-zone, about, contact
components/  Cart, checkout, menu, navbar, footer and toast components
lib/         Menu data, catalog settings, validation and helpers
public/      Images
```

## Requirements

- Node.js 20 or later
- npm

## Setup

```bash
git clone https://github.com/somansaeed1/The_Pan_N_Grill.git
cd The_Pan_N_Grill
npm run install:all
```

## Scripts

Run these from the repository root.

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev:frontend` | Start the frontend on http://localhost:3000  |
| `npm run dev:backend`  | Start the API on http://localhost:4000       |
| `npm run build`        | Production build of the frontend             |
| `npm run lint`         | Lint the frontend                            |

The API currently exposes one endpoint, `GET /api/health`.

## Configuration

The frontend does not use environment variables.

The backend reads two variables. Copy `backend/.env.example` to `backend/.env` to set them locally.

| Variable       | Default                 | Description                              |
| -------------- | ----------------------- | ---------------------------------------- |
| `PORT`         | `4000`                  | Port the API listens on                  |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed origins  |

### Changing site content

| What                              | Where                                            |
| --------------------------------- | ------------------------------------------------ |
| Menu items, prices, sizes, images | `frontend/lib/menuData.ts`                       |
| Add-ons and their prices          | `frontend/lib/catalog.ts`                        |
| Sold-out items                    | `UNAVAILABLE_ITEM_IDS` in `frontend/lib/catalog.ts` |
| Address, phone numbers, WhatsApp  | `frontend/lib/site.ts`                           |
| Delivery distances and minimums   | `frontend/lib/deliveryZoneUtils.ts`              |
| Brand colors                      | `frontend/tailwind.config.ts`                    |

## How ordering works

The cart is stored in the browser's `localStorage`. At checkout the form validates the customer's name, a Pakistani mobile number and, for delivery, an address. Delivery orders are also checked against the saved delivery location and its minimum order amount.

When the form is valid, the order is written as a WhatsApp message and opened in WhatsApp. The customer sends it from there. Orders are not stored on a server and no payment is taken online.

The delivery check uses the browser's geolocation, OpenStreetMap Nominatim for the city lookup and a distance calculation from the restaurant. No API keys are required.

## Deployment

The Vercel project builds from the repository root. `vercel.json` sets the build command and output directory for the frontend:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build --prefix frontend",
  "outputDirectory": "frontend/.next"
}
```

`frontend` is an npm workspace, so a single `npm ci` at the root installs it and places `next` in the root `node_modules`, which Vercel needs to detect the framework. If you upgrade Next.js, run the upgrade from the root so the lockfile stays consistent.

The backend is meant to be deployed as its own Vercel project with the Root Directory set to `backend`.

## Branches

- `main` is production. Only the repository owner merges into it.
- `staging` is where changes are integrated and tested.
- Work happens on `feature/<name>` branches created from `staging` and is merged back through a pull request.
