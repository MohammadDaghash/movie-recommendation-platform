# Full-Stack TV Show Recommendation Platform using Machine Learning

A full-stack TV show recommendation platform built with React, Node.js, Express, MongoDB, and machine-learning-inspired recommendation logic.

The project started as a TV show management app and was upgraded into a personalized recommendation system that uses watched shows, user ratings, genre vectors, cosine similarity, TMDB metadata, and hybrid scoring to recommend shows more intelligently.

This project is aligned with ML concepts such as vectors, matrices, dot product similarity, feature engineering, scaling, ranking, and recommendation explainability, as outlined in the updated ML project plan. :contentReference[oaicite:0]{index=0}

---

## Tech Stack

### Frontend

- React
- Vite
- CSS
- Responsive carousel-based UI

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Role-based authorization

### External API

- TMDB API for importing TV show metadata:
  - title
  - poster
  - genres
  - release year
  - overview
  - TMDB rating
  - popularity

### Recommendation Logic

- Genre vectorization
- Rating-weighted user preference vector
- Cosine similarity
- Hybrid recommendation scoring
- Recommendation explanations

---

## Features

### TV Show Library

- View watched TV shows
- View want-to-watch TV shows
- Search TV shows
- Filter by genre
- Browse shows using horizontal carousels
- Open detailed show modal by clicking a card

### Admin Features

- Admin login
- Add TV shows directly from TMDB
- Search TMDB and choose the correct show from multiple results
- Mark shows as watched
- Rate watched shows from 0–10
- Move shows back to want-to-watch
- Delete shows
- Admin-only protected actions using JWT and role-based authorization

### Public Showcase Mode

- Visitors can view the watched and want-to-watch lists
- Visitors can view match scores and recommendation explanations
- Visitors cannot modify the database
- If a visitor tries to perform an admin action, the login modal appears

### Authentication and Authorization

- JWT-based login
- Password hashing using bcrypt
- Protected backend routes
- Admin-only middleware
- Separation between public viewing and admin editing

---

## Recommendation System

The platform uses a content-based recommendation approach.

Each TV show is represented as a genre vector.  
The system builds a user taste profile from watched shows, weighted by the user’s rating.

For example:

```txt
Friends rating: 9.7 → strong Comedy/Romance signal
Peaky Blinders rating: 4.0 → weaker Crime/Drama signal
```
