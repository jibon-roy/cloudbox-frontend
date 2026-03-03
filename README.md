# CloudBox - Policy-Driven File Storage Platform

> **Manage files like Google Drive, enforce limits like enterprise SaaS.**

CloudBox is a subscription-driven file management platform that combines the simplicity of consumer cloud storage with the control and policy enforcement of enterprise SaaS solutions.

## 🚀 Features

### For Users

- 📁 **Deep Folder Structure** - Create nested folders with configurable depth limits
- 📤 **File Management** - Upload, move, copy, rename, and delete files with real-time validation
- 📊 **Usage Tracking** - Monitor storage used, files uploaded, and quota consumption
- 🔄 **Flexible Plans** - Choose from Free, Silver, Gold, or Diamond subscription tiers
- 🔐 **Secure Access** - Role-based access control and user authentication

### For Admins

- 🎯 **Policy-Driven Validation** - Define business rules that enforce on every file operation
- 📈 **Dashboard Analytics** - Real-time metrics on platform usage and performance
- 💳 **Billing Management** - Track payments, subscriptions, and user billing status
- 👥 **User Management** - Manage users, assign roles, activate/deactivate accounts
- 📋 **Subscription Tiers** - Create and manage multiple subscription packages dynamically
- 🚫 **Content Control** - Set file type restrictions, size limits, and upload quotas

### Platform Capabilities

- ⚡ **Real-Time Validation** - Every file operation is validated against active subscription policies before execution
- 🎚️ **Instant Policy Updates** - Admin changes propagate immediately to all users
- 📊 **Rule Engine** - Advanced policy engine with file types, size limits, and nesting depth controls
- 🌍 **Multi-Tenant** - Support for multiple workspaces and user teams
- 📱 **Responsive Design** - Beautiful UI that works on desktop and mobile

## 📦 Subscription Tiers

| Feature       | Free     | Silver   | Gold      | Diamond     |
| ------------- | -------- | -------- | --------- | ----------- |
| Max Folders   | 20       | 200      | 1,000     | Unlimited\* |
| Max File Size | 10MB     | 50MB     | 250MB     | 1GB         |
| Nesting Depth | 2 Levels | 5 Levels | 10 Levels | 20 Levels   |
| Storage Quota | 100MB    | 500MB    | 2.5GB     | 10GB        |

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Redux + RTK Query** - State management and data fetching
- **Lucide React** - Beautiful icon library
- **SweetAlert2** - Enhanced alert dialogs
- **Sonner** - Toast notifications

### Architecture

- RESTful API integration
- Role-based access control (USER, ADMIN roles)
- Protected routes with authentication
- Server-side and client-side rendering optimization
- SEO optimized with metadata management

## 📁 Project Structure

```
cloudbox-frontend/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (auth)/                   # Authentication routes
│   │   ├── (common)/                 # Public pages (home, pricing, about)
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── api/                      # API route handlers
│   │   └── layout.tsx                # Root layout with metadata
│   ├── components/
│   │   ├── pages/                    # Page-level components
│   │   ├── shared/                   # Reusable shared components
│   │   └── ui/                       # UI library components
│   ├── lib/
│   │   ├── helpers/                  # Utility functions
│   │   └── colors.ts                 # Color configuration
│   ├── redux/
│   │   ├── api/                      # RTK Query API definitions
│   │   ├── features/                 # Redux slices
│   │   └── store.ts                  # Redux store configuration
│   └── utils/                        # Utility functions
├── public/                           # Static assets
├── package.json                      # Dependencies
└── tsconfig.json                     # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cloudbox-frontend.git
cd cloudbox-frontend
```

2. Install dependencies:

```bash
bun i
# or
npm install
```

3. Set up environment variables:

```bash
cp example.env .env.local
```

4. Update `.env.local` with your API endpoints and configuration

### Development

Run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun run start
# or
npm run build
npm start
```

## 📖 Key Pages & Routes

### Public Pages

- `/` - Home page with feature showcase
- `/pricing` - Subscription plans comparison
- `/about` - About CloudBox
- `/contact` - Contact form
- `/auth/login` - User login
- `/auth/register` - User registration

### Admin Dashboard

- `/dashboard` - Admin dashboard home
- `/dashboard/billing-payments` - Billing and payment management
- `/dashboard/user-subscriptions` - Subscription tracking
- `/dashboard/manage-users` - User management and deactivation
- `/dashboard/manage-subscriptions` - Package/tier management
- `/dashboard/user-settings` - Admin settings

### User Dashboard

- `/dashboard` - User file manager
- `/dashboard/user-settings` - User profile settings

## 🔑 API Integration

CloudBox integrates with a backend API for:

- User authentication and authorization
- File operations (CRUD)
- Subscription management
- Billing and payment processing
- Admin dashboard data
- Usage tracking and analytics

## 🎨 Customization

### Colors & Theme

Colors are defined in `src/lib/colors.ts` and can be customized:

```typescript
primary: '#007BFF',
success: '#28A745',
warning: '#FFC107',
danger: '#DC3545',
// ... and more
```

### Component Styling

All components use Tailwind CSS classes. Customize by modifying:

- `src/components/ui/` - Base UI components
- `tailwind.config.js` - Tailwind configuration
- `src/app/globals.css` - Global styles

## 📱 Responsive Design

CloudBox is fully responsive:

- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface
- Adaptive layouts

## 🔐 Security Features

- JWT-based authentication
- Protected API routes
- Role-based access control (RBAC)
- Secure cookie handling
- CORS protection
- Input validation

## 📊 Admin Dashboard Features

### Billing & Payments

- View all user payments and billings
- Filter by status (Pending, Success, Failed)
- Update payment status
- Export billing data to CSV
- Date range filtering

### User Subscriptions

- Track all active and inactive subscriptions
- View subscription status (Active, Expired, Inactive)
- Display package details and pricing
- Export subscription data
- Pagination support

### Manage Users

- Search users by name or email
- Sort by creation date, name, or email
- View user roles (Admin, Regular User)
- Deactivate user accounts
- Track user status (Active, Inactive)
- Export user list to CSV

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, email support@cloudbox.app or visit [https://cloudbox.app/support](https://cloudbox.app/support)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- State management with [Redux Toolkit](https://redux-toolkit.js.org/)

---

**CloudBox** - Manage files with simplicity, enforce policies with power.
