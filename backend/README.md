## Hello, this is an opinionated starter template for backend services with nodejs + express + typescript + prisma orm, feel free to modify it to your liking

# Tech Stack

- <b>Node.js with Express</b>: backend framework for building APIs.
- <b>JWT</b>: JSON Web Tokens for authentication and authorization.
- <b>postgres</b>: A relational database for storing application data.
- <b>prisma ORM</b>: this handles DB migrations, modeling data schema, pooling.

# Project structure

.
├── src
│ ├── config
│ │ └── cors-config.ts
│ │ └── db.ts
│ ├── controllers
│ │ └── auth - auth-controller.ts `All auth related routes controllers are defined in this file`
│ │ └── ... `(add the rest of controllers here...)`
│ ├── middleware
│ │ └── authMiddleware.ts `sample auth middleware for protected routes`
│ │ └── ... `(add the rest of middlewares here..., )`
│ ├── subscriptions
│ │ └── newAccount.sub.ts
│ │ └── ... `(add the rest of subscriptions here...)`
│ ├── routes
│ │ └── auth.routes.ts
| | └── user.routes.ts
│ │ └── ... `(add the rest of routes here...)`
│ ├── services
│ │ └── auth.service.ts
│ │ └── ... `(add the rest of services here...)`
│ ├── templates
│ │ └── index.ts `HTML templates eg for emails, like a welcome email, password reset email etc`
│ ├── types
│ │ └── index.ts `these are global typescript types`
│ ├── utils
│ │ └── constants.ts ``│   └── server.ts`root of the app`├── .env.example
├── .gitignore
├── package.json
├── public.json `this is for static stuff like images, videos etc`├── Dockerfile -`(you can ignore these for now)`├── tsconfig.json
├── README.md
└── prisma
    ├── migrations
    └── schema.prisma
    └── user.prisma
    └── ...`(model your data schema here...)`
