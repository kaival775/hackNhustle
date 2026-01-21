# Railway Deployment Guide for ISL Learning Platform Backend

## Prerequisites
- Railway account (sign up at https://railway.app)
- MongoDB Atlas account (or another cloud MongoDB provider)
- Git repository

## Deployment Steps

### 1. Prepare Environment Variables
In Railway, you need to set the following environment variables:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET_KEY=your-super-secret-jwt-key-here
PORT=5002
```

### 2. Deploy to Railway

#### Option A: Deploy from GitHub
1. Go to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository
5. Railway will auto-detect Python and deploy

#### Option B: Deploy using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to your project
railway link

# Deploy
railway up
```

### 3. Set Environment Variables in Railway
1. Go to your project in Railway dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add the environment variables listed above

### 4. Configure MongoDB Atlas
1. Create a MongoDB Atlas cluster (free tier available)
2. Create a database user
3. Whitelist all IP addresses (0.0.0.0/0) for Railway access
4. Get your connection string and add it to MONGO_URI

### 5. Verify Deployment
Once deployed, Railway will provide you with a URL like:
```
https://your-app-name.up.railway.app
```

Test the API:
```bash
curl https://your-app-name.up.railway.app/health
```

## API Documentation
Access Swagger documentation at:
```
https://your-app-name.up.railway.app/docs/
```

## Files Created for Deployment

- **Procfile**: Tells Railway how to run the application
- **runtime.txt**: Specifies Python version
- **railway.json**: Railway-specific configuration
- **requirements.txt**: Updated with gunicorn for production server
- **.gitignore**: Prevents sensitive files from being committed

## Important Notes

1. **Security**: Never commit `.env` file to Git
2. **Database**: Use MongoDB Atlas or another cloud MongoDB provider
3. **CORS**: Update CORS settings in app.py if needed for your frontend domain
4. **Port**: Railway automatically assigns PORT environment variable
5. **Logs**: View logs in Railway dashboard for debugging

## Troubleshooting

### MongoDB Connection Issues
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

### Application Won't Start
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure requirements.txt has all dependencies

### SSL/TLS Errors
- The app is configured with `tlsInsecure=True` for development
- For production, configure proper SSL certificates

## Local Testing with Production Config
```bash
# Install gunicorn locally
pip install gunicorn

# Run with gunicorn
gunicorn app:app --bind 0.0.0.0:5002

# Test the endpoint
curl http://localhost:5002/health
```

## Support
For issues, check:
- Railway Logs: In Railway dashboard
- MongoDB Atlas Logs: In Atlas dashboard
- Application logs: Use Railway CLI `railway logs`
