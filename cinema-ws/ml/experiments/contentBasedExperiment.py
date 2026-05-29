import json
import sys
from pathlib import Path

import pandas as pd

def clean_value(value):
    if pd.isna(value):
        return ""
    return value

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

from recommender import recommend_existing_unwatched


with open(ROOT_DIR / "experiments" / "tvshows.json", "r") as file:
    tvshows = json.load(file)

df = pd.DataFrame(tvshows)

results = recommend_existing_unwatched(df, top_n=20)

print("\nTop unwatched recommendations:\n")

for _, row in results.head(10).iterrows():
    print(f"{row['title']} -> match score: {round(row['matchScore'] * 100, 2)}%")

recommended_shows = []

for _, row in results.iterrows():
    recommended_shows.append(
        {
            "title": clean_value(row["title"]),
            "matchScore": round(row["matchScore"] * 100, 2),
            "genres": row["genres"],
            "imageUrl": clean_value(row["imageUrl"]),
            "overview": clean_value(row["overview"]),
            "tmdbRating": clean_value(row["tmdbRating"]),
            "popularity": clean_value(row["popularity"]),
            "year": clean_value(row["year"]),
        }
    )

with open(ROOT_DIR / "experiments" / "recommendations.json", "w") as file:
    json.dump(recommended_shows, file, indent=2)

print("\nRecommendations exported successfully.")