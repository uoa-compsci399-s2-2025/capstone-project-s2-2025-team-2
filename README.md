# CoLab

A collaborative web-based platform designed to help researchers connect across New Zealand. Share and exchange labratory reagents to minimise waste.

- **Reduce Waste**: Minimise environmental wastage by exchanging unused chemicals.
- **Save Money**: Avoid unecessary bulk purchasing and source affordable materials.
- **Foster Collaboration**: Connect researchers across institutions to strengthen the scientific community, share knowledge and resources.

## Project Management Tool

[https://github.com/uoa-compsci399-s2-2025/capstone-project-s2-2025-team-2/projects?query=is%3Aopen](https://github.com/uoa-compsci399-s2-2025/capstone-project-s2-2025-team-2/projects?query=is%3Aopen)

## Technologies Used

### Languages

- **TypeScript 5.9.2**

### Frontend

- **Next.js 15.4.4**
- **React 19.1.0**
- **React DOM 19.1.0**
- **Tailwind CSS 4.1.13**
- **openapi-fetch 0.14.0**
- **openapi-typescript 7.9.1**
- **next-themes 0.4.6**
- **sonner 2.0.7**
- **react-icons 5.5.0**
- **@mui/icons-material 7.3.2**
- **@heroicons/react 2.2.0**

### Backend

- **Node.js**
- **Express 5.1.0**
- **TSOA 6.6.0**
- **swagger-jsdoc 6.2.8**
- **swagger-ui-express 5.0.1**
- **body-parser 2.2.0**
- **cors 2.8.5**
- **helmet 8.1.0**

### Authentication & Database

- **Firebase 12.3.0**
- **Firebase Admin 13.5.0**
- **Google Auth Library 10.3.0**

### Utilities

- **nodemailer 7.0.6**
- **node-cron 4.2.1**
- **zod 4.1.11**
- **uuid 13.0.0**
- **dotenv 16.6.1**

### Development Tools

- **pnpm 10.7.1**
- **ESLint 9.36.0**
- **Prettier 3.6.2**
- **Storybook 9.1.10**
- **ts-node 10.9.2**
- **tsc-alias 1.8.16**
- **concurrently 9.2.1**

## Installation and Setup

### Prerequisites

- **Node.js**
- **pnpm**
- **Git**

### Step 1: Clone the Repository

```bash
git clone git@github.com:uoa-compsci399-s2-2025/capstone-project-s2-2025-team-2.git
cd capstone-project-s2-2025-team-2
```

### Step 2: Install Dependencies

Install dependencies for all workspaces:

```bash
pnpm install
```

### Step 3: Environment Variables

Create environment variable files for both client and server:

- Create a `.env` file in both the `server/` and `client/` directory
- Enter their respective variables disclosed in the assignment submission.

### Step 4: Generate Type Definitions

Generate TypeScript types from the OpenAPI specification:

```bash
pnpm generate:types
```

This will:

- Generate OpenAPI spec and routes using TSOA
- Generate TypeScript types for the client from the OpenAPI spec

### Step 5: Run the Development Server

Run both the client (Next.js) and server (Express)

```bash
pnpm run dev
```

### Step 6: Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/swagger

## Usage Examples

### Create an account

1. Navigate to `/auth`
2. Click Sign Up
3. Enter your email, click "Verify"
4. Recieve verification code in email, enter code and click "Validate"
5. Click "Next Page"
6. Enter user details (display name, institution)

### Creating a Reagent Listing

1. Sign up or sign in to your account
2. Navigate to the Marketplace (`/marketplace`)
3. Click the "+" button in the bottom right corner
4. Fill in the reagent details:
   - Name, description, quantity, unit
   - Category (chemical, hazardous, biological)
   - Trading type (sell, trade, giveaway)
   - Expiry date
   - Images
   - Location
   - Price (if sell type)
5. Set visibility (public, private, institution-only)
6. Indicate restricted access
7. Submit listing

### Browsing and Searching Reagents

1. Navgigate to the Marketplace (`/marketplace`)
2. Use the search bar to find specific reagents
3. Filter by category, condition, or trading type (set filter and enter text in the search bar)
4. Sort by expiry date or name
5. View reagent details by clicking on a card]

### Profile and User Management

- Navigate to profile through sidebar navigation (Profile Button)
- View and sort through your reagent inventory
- Edit user information using the pencil icon next to name

### Editing a Reagent Listing

1. Find your own listing in `/marketplace` or your profile
2. Click "Edit" on the card
3. Update fields and save; changes appear immediately

### Request a Reagent

1. Open a reagent's details page through `/marketplace`
2. Click "Request"
3. Provide message/price/reagent as required and submit
4. Track outgoing requests on `/requests`

### View, Approve, Decline Pending Transactions (requests/offers)

1. In `/requests` or `/offers`
   - View transaction details with the "View" button at the bottom of each reagent card
   - Open chat
   - Confirm/Decline trade (processed transactions are moved to `/history`)

### Inbox Page

1. Open `/inbox` to view conversations (each conversation is tied to a specific order)
2. Select a conversation to chat with the other user
3. "View Listing" button to redirect to reagent details page
4. "Edit Request" button to bring up

### View Transaction History

- Visit `/history` to view past request transactions

### Bounty Board Page

- Navigate to `/bountyboard`
- Create a bounty for any reagent you seek but is currently unlisted
- Browse board to find any bounties you are able to fufill, make a subsequent offer

## Deployment

[Colab.Exchange](Colab.Exchange)

## Future Plans

For future releases we plan to add:

- **Enhanced Search**: Advanced filtering options including price and date range, location based search
- **Custom Tags**: Allow users to add new categories to list their reagents under
- **Rating and Review System**: Allow users to rate others and leave reviews
- **Notification System**: Real-time notifications for new requests, messages, and expiring reagents
- **Analytics Dashboard**: Provide users with insights into their environmental impact (AI calculated)
- **Partial Quantity Trading**: Ability to specify and exchange specific quantities from a reagent listing
- **Advanced Messaging Features**: Read receipts, file sharing, image attachments in messages

## Acknowledgements

- TSOA boilerplate

A BIG, big thank you to:

- Our Clients, David and Wandia
- Our Teachers, Anna and Asma

---
