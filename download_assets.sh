#!/bin/bash
# Download all media assets from utkarsh2025.onrender.com

BASE_URL="https://utkarsh2025.onrender.com"
OUTPUT_DIR="public/utkarsh2025-assets"

# Root level assets
curl -sL "$BASE_URL/assets/bg.jpg" -o "$OUTPUT_DIR/bg.jpg"
curl -sL "$BASE_URL/assets/futuretech.jpg" -o "$OUTPUT_DIR/futuretech.jpg"
curl -sL "$BASE_URL/assets/logo_white.png" -o "$OUTPUT_DIR/logo_white.png"
curl -sL "$BASE_URL/assets/logo1.jpg" -o "$OUTPUT_DIR/logo1.jpg"

# About folder
curl -sL "$BASE_URL/assets/about/dance.jpg" -o "$OUTPUT_DIR/about/dance.jpg"
curl -sL "$BASE_URL/assets/about/game.png" -o "$OUTPUT_DIR/about/game.png"
curl -sL "$BASE_URL/assets/about/knowledge.png" -o "$OUTPUT_DIR/about/knowledge.png"
curl -sL "$BASE_URL/assets/about/music.jpg" -o "$OUTPUT_DIR/about/music.jpg"

# Carousel folder
curl -sL "$BASE_URL/assets/carousel/collegeimg.jpg" -o "$OUTPUT_DIR/carousel/collegeimg.jpg"

# Eventimg folder
for i in {1..9}; do
  curl -sL "$BASE_URL/assets/eventimg/img$i.jpg" -o "$OUTPUT_DIR/eventimg/img$i.jpg"
done

# Home folder
curl -sL "$BASE_URL/assets/home/curve.png" -o "$OUTPUT_DIR/home/curve.png"
curl -sL "$BASE_URL/assets/home/hero-background.jpg" -o "$OUTPUT_DIR/home/hero-background.jpg"

# Schedule folder
SCHEDULE_FILES=(
  "arena.jpg" "blindate.jpg" "bob.jpg" "collage.jpg" "crime.jpg" "escape.jpg"
  "facepaint.jpg" "false.jpg" "fashion.jpg" "hunt.jpg" "idol.png" "indianmusic.jpg"
  "meme.jpg" "monoact.jpg" "mrandms.jpg" "nachbaliye.png" "natak.jpg" "opening.png"
  "Quest.jpg" "quiz.png" "sidk.jpg" "squidgame.jpg" "techo.jpg" "warof.jpg"
)
for file in "${SCHEDULE_FILES[@]}"; do
  curl -sL "$BASE_URL/assets/schedule/$file" -o "$OUTPUT_DIR/schedule/$file"
done

# Team folder
TEAM_FILES=(
  "agstage.png" "agstage2.png" "agsweb1.png" "agsweb2.png" "amphi.png"
  "audi1.jpg" "audi2.jpg" "canteen1.png" "canteen2.png" "class1.png" "class2.png"
  "court.png" "creativity1.png" "creativity2.png" "creativity3.png"
  "gs.png" "gs1.jpg" "gs2.jpg" "gs3.jpg"
  "hospitality1.png" "hospitality2.png"
  "marketing1.png" "marketing2.png" "marketing3.png"
  "media1.png" "media2.png" "media3.png"
  "nontech1.jpg" "nontech2.jpg"
  "spons1.png" "spons2.png"
  "tech1.png" "tech2.png"
)
for file in "${TEAM_FILES[@]}"; do
  curl -sL "$BASE_URL/assets/team/$file" -o "$OUTPUT_DIR/team/$file"
done

echo "Download complete!"
