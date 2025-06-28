# FinSight - Personal Finance Tracker

A responsive, full-stack web application that helps users track personal finances through an intuitive, clean interface.

## 🚀 Features Implemented (Stage 1)

### Transaction Management
- ✅ Add, edit, and delete transactions
- ✅ Track amount, date, description, and type (Income/Expense)
- ✅ View a list of all transactions with sorting by date
- ✅ Basic form validation (required fields, valid amount/date)

### Data Visualization
- ✅ Monthly expense and income bar chart using Recharts
- ✅ Responsive chart design with custom tooltips
- ✅ Color-coded transaction types (red for expenses, green for income)

### User Experience
- ✅ Responsive design with Tailwind CSS
- ✅ Clean, modern UI using shadcn/ui components
- ✅ Loading states and error handling
- ✅ Confirmation dialogs for destructive actions
- ✅ Real-time updates after CRUD operations

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (with custom design system)
- **shadcn/ui** (reusable UI components)
- **Recharts** (data visualization)

### Backend
- **Next.js API Routes** (Express.js-like)
- **Prisma ORM** (database management)
- **PostgreSQL** (primary database)
- **Redis** (caching layer)

### Development Tools
- **Docker & Docker Compose** (database services)
- **ESLint** (code quality)
- **Zod** (validation)

## 📁 Project Structure

```
finsight/
├── src/
│   ├── app/
│   │   ├── api/transactions/     # API routes
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── transaction-form.tsx # Add transaction form
│   │   ├── transaction-list.tsx # Transaction list with CRUD
│   │   └── monthly-chart.tsx    # Recharts visualization
│   └── lib/
│       ├── prisma.ts            # Prisma client
│       ├── redis.ts             # Redis client
│       ├── utils.ts             # Utility functions
│       └── validations.ts       # Zod schemas
├── prisma/
│   └── schema.prisma            # Database schema
├── docker-compose.yml           # Database services
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd finsight
npm install
```

### 2. Environment Setup
```bash
# Copy environment variables
cp env.example .env

# Edit .env with your database credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/finsight"
REDIS_URL="redis://localhost:6379"
```

### 3. Start Database Services
```bash
# Start PostgreSQL and Redis
docker-compose up -d
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Schema

### Transaction Model
```prisma
model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  description String
  date        DateTime
  type        TransactionType @default(EXPENSE)
  category    String?  // For future stages
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum TransactionType {
  INCOME
  EXPENSE
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## 🎨 UI Components

The application uses a custom design system built with:
- **shadcn/ui** components (Button, Input, Card, Select, etc.)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Custom color scheme** with CSS variables

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔮 Future Enhancements (Stages 2 & 3)

### Stage 2 - Categories & Dashboard
- Predefined categories (Food, Rent, Travel, etc.)
- Category-wise pie chart
- Enhanced dashboard with totals and breakdowns

### Stage 3 - Budgeting & Insights
- Monthly budgets per category
- Budget vs Actual comparison
- Spending insights and alerts

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Railway**: Supports PostgreSQL and Redis
- **Heroku**: Add PostgreSQL and Redis add-ons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies** 