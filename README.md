# Spread Your Afternoon

## Dev Setup

You need to configure your environment and specify how to connect to
your dev database:

    echo "MONGOHQ_URL=mongodb://localhost:27017/afternoondb" >> .env

And then just use foreman to start the application:

    foreman start

This mirrors how the app will run on top of Heroku.