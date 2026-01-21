# Jane Doe for Senate 2026

A modern, full-featured political campaign website built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Public Pages
- **Home**: Hero section with campaign slogan, core values, statistics, and call-to-action buttons
- **About**: Biography, achievements, leadership principles, and personal story
- **Policies**: Collapsible policy cards organized by category (Economy, Healthcare, Education, etc.)
- **Events**: Campaign events calendar with RSVP functionality
- **News & Media**: Blog with articles, press releases, and video content
- **Volunteer & Donate**: Volunteer signup form, donation interface, and contact form

### Features
- **Dark Mode**: System-aware theme toggle with smooth transitions
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Newsletter Signup**: Integrated in footer with Supabase backend
- **RSVP System**: Event registration with guest tracking
- **Content Management**: Basic admin dashboard for managing events and blog posts
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support
- **Accessible**: ARIA labels, keyboard navigation, and semantic HTML

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (for admin features)

## Design System

### Colors
- **Primary**: Navy blue (`#1e3a8a`) - Trust, stability, leadership
- **Secondary**: Amber (`#f59e0b`) - Energy, optimism, action
- **Accent**: White and gray tones for contrast
- **Dark Mode**: Full support with refined color palette

### Typography
- Clean, professional font stack
- Hierarchical sizing for clarity
- 150% line height for body text
- 120% line height for headings

### Components
- Gradient buttons with hover effects
- Card-based layouts with shadows
- Smooth transitions and animations
- Mobile-optimized navigation

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd politician-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Update `.env` file (already configured in this project)

4. Run the database schema:
   - Open your Supabase SQL Editor
   - Copy and run the SQL from `supabase-schema.sql`
   - This will create all tables, RLS policies, and sample data

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Database Schema

The application uses the following tables:

- **policies**: Campaign policy positions
- **events**: Campaign events with RSVP tracking
- **blog_posts**: News articles and press releases
- **event_rsvps**: Event attendance registrations
- **newsletter_signups**: Email subscribers
- **volunteer_signups**: Volunteer applications
- **contact_messages**: Contact form submissions

All tables have Row Level Security (RLS) enabled:
- Public read access for published content
- Public write access for forms (RSVP, newsletter, volunteer, contact)
- Authenticated write access for admin operations

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── contexts/           # React context providers
│   └── ThemeContext.tsx
├── lib/               # Utilities and configurations
│   ├── supabase.ts    # Supabase client
│   └── database.types.ts
├── pages/             # Page components
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Policies.tsx
│   ├── Events.tsx
│   ├── News.tsx
│   ├── Volunteer.tsx
│   └── Admin.tsx
├── App.tsx            # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles and animations
```

## Admin Dashboard

Access the admin dashboard by navigating to the "admin" page (add `?page=admin` or modify navigation).

**Note**: In production, you should:
1. Add authentication (Supabase Auth is already set up)
2. Protect admin routes with auth guards
3. Implement full CRUD operations for all content types
4. Add image upload functionality

## Customization

### Branding
- Update candidate name and details in `Header.tsx` and `Footer.tsx`
- Replace "JD" logo placeholder with actual candidate photo/logo
- Modify color scheme in Tailwind config if needed

### Content
- Sample data is included in `supabase-schema.sql`
- Use the admin dashboard to add/edit events and blog posts
- Update biography and achievements in `About.tsx`
- Modify policy positions in the database

### Stripe Integration
To enable donations:
1. Create a Stripe account
2. Get your API keys
3. Implement Stripe Checkout or Payment Element
4. Update the donate section in `Volunteer.tsx`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any static hosting service:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Railway
- Render

## Contributing

This is a campaign website template. Feel free to customize it for your needs.

## License

All rights reserved. Paid for by Jane Doe for Senate Committee.

## Support

For questions or issues, contact: info@janedoe2026.com

---

**Disclaimer**: This is a demo project. Federal election law requires proper disclosure statements, contribution limits, and reporting. Consult with legal counsel and the FEC before launching a real political campaign website.
