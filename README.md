# Full-Stack TV Show Recommendation Platform using Machine Learning

A full-stack TV show recommendation platform built with React, Node.js, Express, MongoDB, and machine-learning-based recommendation logic.

The project started as a TV show management app and evolved into a personalized recommendation system that uses watched shows, user ratings, genre vectors, cosine similarity, TMDB metadata, hybrid scoring, and user feedback to recommend shows more intelligently.

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

- TMDB API for TV show metadata:
  - title
  - poster
  - genres
  - release year
  - overview
  - TMDB rating
  - popularity

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
- Add TV shows from TMDB
- Search TMDB and select the correct show
- Mark shows as watched
- Rate watched shows from 0–10
- Move shows back to want-to-watch
- Delete shows
- Admin-only protected actions using JWT and role-based authorization

### Public Showcase Mode

- Visitors can view watched and want-to-watch lists
- Visitors can view match scores and recommendation explanations
- Visitors cannot modify the database
- Admin login modal appears for protected actions

---

## Recommendation System

The platform uses a hybrid content-based recommendation system.

Each TV show is represented as a numerical genre/category vector.  
The system builds a user taste profile from watched shows, weighted by the user’s ratings.

Example:

```txt
Breaking Bad rating: 10 → strong Crime/Drama signal
Friends rating: 6 → weaker Comedy/Romance signal
```

````

The system then compares the user taste vector with candidate TV show vectors using cosine similarity.

Main ML concepts used:

- Genre vectorization
- Rating-weighted user taste vectors
- Cosine similarity
- Feature engineering
- Hybrid recommendation scoring
- TMDB metadata ranking
- Explainable recommendations
- Persistent negative feedback

---

## AI Suggestions

The Want to Watch page includes an AI Suggestions section.

AI Suggestions are generated dynamically from TMDB and filtered to exclude:

- already watched shows
- shows already in want-to-watch
- shows marked as Not Interested

Each suggestion includes:

- match score
- taste similarity
- category preference
- TMDB rating score
- popularity score
- year match score
- explanation based on similar watched shows

Users can:

- add a suggestion to Want to Watch
- mark a suggestion as Not Interested

Ignored suggestions are stored permanently in MongoDB, so they do not return after refreshing the page.

---

## Machine Learning / Math Concepts

The project currently uses the following recommendation formulas:

### Weighted User Taste Vector

```txt
u_j = Σ(r_i × x_ij) / Σr_i
```

Where:

- `u_j` = user preference for category `j`
- `r_i` = user rating for watched show `i`
- `x_ij` = value of category `j` in show `i`

### Genre Rating Weight

```txt
G_g = Σ r_i
```

For all watched shows that contain genre `g`.

### Cosine Similarity

```txt
similarity(s, w) = (s · w) / (||s|| ||w||)
```

Used to compare a suggested show vector with watched show vectors.

### Vector Magnitude

```txt
||s|| = sqrt(s_1² + s_2² + ... + s_n²)
```

---

## Project Status

The project currently supports:

- full-stack TV show management
- TMDB integration
- admin authentication
- public showcase mode
- dynamic AI recommendations
- persistent “Not Interested” feedback
- cosine-similarity-based recommendation logic

Next planned improvements:

- rating-weighted recommendation refinement
- better feature scaling
- recommendation evaluation metrics
- clustering similar TV shows
- user-specific recommendation profiles
- trained ML models

```

```
````
