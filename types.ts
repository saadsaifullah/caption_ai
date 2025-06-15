
export enum CaptionLength {
  SHORT = "short (1-5 words)",
  MEDIUM = "medium (6-12 words)",
  LONG = "long (13-20 words)",
  EXTRA_LONG = "extra long (40-60 words)",
  STORY = "story (100-160 words)",
}

export enum CaptionStyle {
  RANDOM = "Random",
  HOTWIFE = "Hotwife",
  HOTWIFE_PLUS = "Hotwife+",
  CUCKOLD = "Cuckold",
  CUCKOLD_PLUS = "Cuckold+",
  CHEATING = "Cheating",
  ESCORT = "Escort",
  SHY = "Shy",
  BULLY = "Bully",
  SPH = "SPH",
  JOI = "JOI",
  HOTWIFE_CHALLENGES = "Hotwife Challenges",
  CUCKOLD_CHALLENGES = "Cuckold Challenges",
}

export enum CaptionAppearanceStyle {
  DEFAULT = "Default",
  CLASSIC_FILM = "Classic Film",
  COMIC_BOOK = "Comic Book",
  ELEGANT_SCRIPT = "Elegant Script",
  NEON_SIGN = "Neon Sign",
  RETRO_WAVE = "Retro Wave",
  HANDWRITTEN_NOTE = "Handwritten Note",
  VINTAGE_POSTER = "Vintage Poster",
  MODERN_CLEAN = "Modern Clean",
  MODERN_MINIMALIST = "Modern Minimalist",
  FROSTED_GLASS = "Frosted Glass",
  BRIGHT_ACCENT_STROKE = "Bright Accent Stroke",
}

export enum EmojiCount {
  NONE = "none",
  ONE = "one",
  FEW = "few", // 2-3
  MANY = "many", // 4-5
}


// Minimal types for Gemini response, not used directly for grounding in this app version
// but good to have for potential future use or if API returns complex objects
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}
