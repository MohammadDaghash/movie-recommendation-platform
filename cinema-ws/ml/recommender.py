import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

from featureEngineering import create_category_vector


def build_feature_matrix(df):
    df = df.copy()

    df["categoryVector"] = df["genres"].apply(create_category_vector)
    df["year"] = df["year"].fillna(df["year"].median())
    df["tmdbRating"] = df["tmdbRating"].fillna(0)
    df["popularity"] = df["popularity"].fillna(0)
    df["userRating"] = df["userRating"].fillna(0)
    df["overview"] = df["overview"].fillna("")
    df["imageUrl"] = df["imageUrl"].fillna("")

    metadata_features = df[["year", "tmdbRating", "popularity"]]

    scaler = MinMaxScaler()
    scaled_metadata = scaler.fit_transform(metadata_features)

    category_matrix = pd.DataFrame(df["categoryVector"].tolist())

    return pd.concat(
        [
            category_matrix * 0.7,
            pd.DataFrame(scaled_metadata) * 0.3,
        ],
        axis=1,
    )


def build_user_profile(df, feature_matrix):
    watched_df = df[df["watched"] == True]

    return (
        feature_matrix.loc[watched_df.index]
        .multiply(watched_df["userRating"], axis=0)
        .sum()
        / watched_df["userRating"].sum()
    )


def recommend_existing_unwatched(df, top_n=10):
    feature_matrix = build_feature_matrix(df)
    user_profile = build_user_profile(df, feature_matrix)

    unwatched_df = df[df["watched"] == False]
    candidate_features = feature_matrix.loc[unwatched_df.index]

    scores = cosine_similarity([user_profile], candidate_features)[0]

    results = unwatched_df.copy()
    results["matchScore"] = scores

    return results.sort_values("matchScore", ascending=False).head(top_n)