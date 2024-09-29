const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

// const rateLimit = require("express-rate-limit");
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
// const brandRouter = require("./routes/brandRoutes");
// const overviewRouter = require("./routes/overviewRoutes");
const sliderRouter = require('./routes/sliderRoutes')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const cartRouter = require('./routes/cartRoutes')
const addressRouter = require('./routes/addressRoutes')
const orderRouter = require('./routes/orderRoutes')
const authRouter = require('./routes/authRoutes')
// middleware
var corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8080'],
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // URL-encoded body parse işlemi için
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit request from same API
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many request from this IP, Please try again in a hour",
// });
// app.use("/", limiter);

// Data sanitization against NoSql query injection
//app.use(mongoSanitize());

// Data sanitization against XSS
//app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: ["price", "ratingsQuantity", "ratingsAverage", "brand"],
//   })
// );

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// route
// app.use("/brands", brandRouter);
// app.use("/", overviewRouter);
app.use('/api/sliders', sliderRouter)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/carts', cartRouter)
app.use('/api/addresses', addressRouter)
app.use('/api/orders', orderRouter)
app.use('/api/auth', authRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)
module.exports = app
