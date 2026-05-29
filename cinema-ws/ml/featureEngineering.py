MAJOR_CATEGORIES = [
    "Comedy",
    "Drama & Romance",
    "Crime & Thriller",
    "Fantasy & Sci-Fi",
    "Animation",
]


def create_category_vector(genres):
    matched_categories = []

    if "Animation" in genres or "Anime" in genres:
        matched_categories.append("Animation")

    if any(
        genre in genres
        for genre in [
            "Fantasy",
            "Sci-Fi",
            "Science Fiction",
            "Science-Fiction",
            "Sci-Fi & Fantasy",
            "Adventure",
        ]
    ):
        matched_categories.append("Fantasy & Sci-Fi")

    if any(
        genre in genres
        for genre in ["Crime", "Thriller", "Mystery", "Horror"]
    ):
        matched_categories.append("Crime & Thriller")

    if "Drama" in genres and "Romance" in genres:
        matched_categories.append("Drama & Romance")

    if "Comedy" in genres:
        matched_categories.append("Comedy")

    if not matched_categories:
        matched_categories.append("Drama & Romance")

    if len(matched_categories) == 1:
        weights = [1]
    elif len(matched_categories) == 2:
        weights = [0.7, 0.3]
    else:
        weights = [0.5, 0.3, 0.2]

    category_scores = {category: 0 for category in MAJOR_CATEGORIES}

    for index, category in enumerate(matched_categories[:3]):
        category_scores[category] = weights[index]

    return [category_scores[category] for category in MAJOR_CATEGORIES]