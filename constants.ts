
import { CaptionLength, CaptionStyle, CaptionAppearanceStyle, EmojiCount } from './types';

export const APP_TITLE = "Picture Caption";

export const DEFAULT_CAPTION_LENGTH = CaptionLength.MEDIUM;
export const DEFAULT_CAPTION_STYLE = CaptionStyle.RANDOM; // Updated default
export const DEFAULT_EMOJI_COUNT = EmojiCount.NONE;

// Adjusted label generation to be more robust for different formats
export const CAPTION_LENGTH_OPTIONS = Object.values(CaptionLength).map(value => {
  const label = value.charAt(0).toUpperCase() + value.slice(1);
  // Attempt to extract the part before " (" if present, otherwise use the full capitalized string
  const simpleLabel = label.includes(" (") ? label.substring(0, label.indexOf(" (")) : label;
  return { value, label: simpleLabel };
});

export const CAPTION_STYLE_OPTIONS = Object.values(CaptionStyle).map(value => {
    let label: string;
    switch(value) {
        case CaptionStyle.RANDOM: label = "Random"; break;
        case CaptionStyle.HOTWIFE: label = "Hotwife"; break;
        case CaptionStyle.HOTWIFE_PLUS: label = "Hotwife+ (Explicit)"; break;
        case CaptionStyle.CUCKOLD: label = "Cuckold"; break;
        case CaptionStyle.CUCKOLD_PLUS: label = "Cuckold+ (Explicit)"; break;
        case CaptionStyle.CHEATING: label = "Cheating"; break;
        case CaptionStyle.ESCORT: label = "Escort / Paid"; break;
        case CaptionStyle.SHY: label = "Shy / Reluctant"; break;
        case CaptionStyle.BULLY: label = "Bully (Degrading)"; break;
        case CaptionStyle.SPH: label = "SPH (Humiliation)"; break;
        case CaptionStyle.JOI: label = "JOI (Instructions)"; break;
        case CaptionStyle.HOTWIFE_CHALLENGES: label = "Hotwife Challenges"; break;
        case CaptionStyle.CUCKOLD_CHALLENGES: label = "Cuckold Challenges"; break;
        default:
            const styleValueAsString = value as string;
            label = styleValueAsString.charAt(0).toUpperCase() + styleValueAsString.slice(1).replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
    }
    return { value, label };
});


export const EMOJI_COUNT_OPTIONS = [
  { value: EmojiCount.NONE, label: "None" },
  { value: EmojiCount.ONE, label: "One" },
  { value: EmojiCount.FEW, label: "Few (2-3)" },
  { value: EmojiCount.MANY, label: "Many (4-5)" },
];

export const GEMINI_TEXT_MODEL = "models/gemini-1.5-pro";
export const GEMINI_MULTIMODAL_MODEL = "models/gemini-1.5-pro";

// Canvas text styling defaults
export const TEXT_COLOR = "white";
export const TEXT_STROKE_COLOR = "black";
export const TEXT_STROKE_WIDTH = 2; // px, base stroke width, scaled with font size
export const TEXT_FONT_FAMILY = "Arial, sans-serif"; // Common, web-safe font
export const TEXT_ALIGN = "center" as CanvasTextAlign;
export const TEXT_BASELINE = "bottom" as CanvasTextBaseline; // Default for bottom-aligned text

// Dynamic sizing ratios based on image dimensions
export const TEXT_FONT_SIZE_RATIO_HEIGHT = 0.06; // e.g., 6% of image height for initial font calculation
export const TEXT_MAX_FONT_SIZE_WIDTH_RATIO = 0.08; // Max font size related to image width
export const TEXT_PADDING_RATIO_HEIGHT = 0.04; // e.g., 4% of image height from edge
export const TEXT_LINE_HEIGHT_MULTIPLIER = 1.2; // Multiplier for line height based on font size
export const MAX_CANVAS_WIDTH = 1000; // Max width for the canvas
export const MAX_CANVAS_HEIGHT = 800; // Max height for the canvas
export const MAX_TEXT_BLOCK_HEIGHT_RATIO = 0.25; // Text block should not exceed 25% of image height
export const ABSOLUTE_MIN_FONT_SIZE_RENDER = 8; // Absolute minimum font size for rendering on canvas

export const TEXT_POSITION_OPTIONS = [
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'middle-center', label: 'Middle Center' },
  { value: 'top-bottom-center', label: 'Top & Bottom Center' },
];
export const DEFAULT_TEXT_POSITION = 'bottom-center';
export const DEFAULT_TEXT_OPACITY = 100; // Default opacity percentage
export const DEFAULT_CUSTOM_FONT_SIZE = null; // Default custom font size (null means auto)
export const MIN_USER_FONT_SIZE = 8; // Min font size user can input for slider/input
export const MAX_USER_FONT_SIZE = 100; // Max font size user can input for slider/input
export const DEFAULT_FALLBACK_SLIDER_FONT_SIZE = 24; // Default for slider when auto is turned off

// Caption Appearance Styles
export const DEFAULT_CAPTION_APPEARANCE_STYLE = CaptionAppearanceStyle.DEFAULT;
export const CAPTION_APPEARANCE_STYLE_OPTIONS = Object.values(CaptionAppearanceStyle).map(value => ({
  value,
  label: value.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, l => l.toUpperCase()), // Improved labeling
}));

// Default Style
export const DEFAULT_FONT_WEIGHT = "bold";

// Classic Film Style
export const CLASSIC_FILM_FONT_FAMILY = "Georgia, 'Times New Roman', serif";
export const CLASSIC_FILM_TEXT_COLOR = "#FFF8DC"; // Cornsilk
export const CLASSIC_FILM_STROKE_COLOR = "black";
export const CLASSIC_FILM_FONT_WEIGHT = "bold";

// Comic Book Style
export const COMIC_BOOK_FONT_FAMILY = "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
export const COMIC_BOOK_TEXT_COLOR = "#FFFF00"; // Yellow
export const COMIC_BOOK_STROKE_COLOR = "black";
export const COMIC_BOOK_STROKE_WIDTH_MULTIPLIER = 2; // Thicker stroke
export const COMIC_BOOK_FONT_WEIGHT = "bold"; // Impact is already bold

// Elegant Script Style
export const ELEGANT_SCRIPT_FONT_FAMILY = "'Brush Script MT', 'Brush Script Std', 'Lucida Calligraphy', 'Lucida Handwriting', cursive";
export const ELEGANT_SCRIPT_TEXT_COLOR = "white";
export const ELEGANT_SCRIPT_STROKE_COLOR = "#4A4A4A"; // Dark Grey
export const ELEGANT_SCRIPT_STROKE_WIDTH_MULTIPLIER = 0.5; // Thinner stroke
export const ELEGANT_SCRIPT_FONT_WEIGHT = "normal";

// Neon Sign Style
export const NEON_SIGN_FONT_FAMILY = "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif";
export const NEON_SIGN_TEXT_COLOR = "#FF00FF"; // Magenta
export const NEON_SIGN_SHADOW_COLOR = "#FF00FF"; // Magenta
export const NEON_SIGN_SHADOW_BLUR = 10; // Px
export const NEON_SIGN_STROKE_COLOR = "black"; // Thin black stroke for definition
export const NEON_SIGN_STROKE_WIDTH_MULTIPLIER = 0.3;
export const NEON_SIGN_FONT_WEIGHT = "bold";

// Retro Wave Style
export const RETRO_WAVE_FONT_FAMILY = "'Arial Black', Gadget, sans-serif";
export const RETRO_WAVE_TEXT_COLOR = "#00FFFF"; // Cyan
export const RETRO_WAVE_SHADOW_COLOR = "#FF00FF"; // Magenta
export const RETRO_WAVE_SHADOW_BLUR = 12;
export const RETRO_WAVE_SHADOW_OFFSET_X = 2;
export const RETRO_WAVE_SHADOW_OFFSET_Y = 2;
export const RETRO_WAVE_STROKE_COLOR = "#301934"; // Dark Purple
export const RETRO_WAVE_STROKE_WIDTH_MULTIPLIER = 0.5;
export const RETRO_WAVE_FONT_WEIGHT = "bold"; // Arial Black is bold

// Handwritten Note Style
export const HANDWRITTEN_NOTE_FONT_FAMILY = "'Segoe Print', 'Bradley Hand', Chilanka, TSCu_Comic, casual, cursive"; // Casual script/handwritten
export const HANDWRITTEN_NOTE_TEXT_COLOR = "#2c3e50"; // Dark slate blue
export const HANDWRITTEN_NOTE_STROKE_COLOR = "transparent"; // No stroke or very subtle
export const HANDWRITTEN_NOTE_FONT_WEIGHT = "normal";

// Vintage Poster Style
export const VINTAGE_POSTER_FONT_FAMILY = "Georgia, 'Times New Roman', serif";
export const VINTAGE_POSTER_TEXT_COLOR = "#F5F5DC"; // Beige/Cream
export const VINTAGE_POSTER_STROKE_COLOR = "#8B0000"; // Dark Red
export const VINTAGE_POSTER_STROKE_WIDTH_MULTIPLIER = 1.5;
export const VINTAGE_POSTER_FONT_WEIGHT = "bold";

// Modern Clean Style
export const MODERN_CLEAN_FONT_FAMILY = "Arial, 'Helvetica Neue', Helvetica, sans-serif"; // Standard clean sans-serif
export const MODERN_CLEAN_TEXT_COLOR = "#CCCCCC"; // Light Grey
export const MODERN_CLEAN_SHADOW_COLOR = "#000000"; // Black
export const MODERN_CLEAN_SHADOW_BLUR = 3;
export const MODERN_CLEAN_SHADOW_OFFSET_Y = 1;
export const MODERN_CLEAN_STROKE_COLOR = "transparent"; // No stroke
export const MODERN_CLEAN_FONT_WEIGHT = "300"; // Lighter weight

// Modern Minimalist Style
export const MODERN_MINIMALIST_FONT_FAMILY = "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif";
export const MODERN_MINIMALIST_TEXT_COLOR = "#E0E0E0"; // Light Grey
export const MODERN_MINIMALIST_SHADOW_COLOR = "rgba(0,0,0,0.4)";
export const MODERN_MINIMALIST_SHADOW_BLUR = 2;
export const MODERN_MINIMALIST_SHADOW_OFFSET_Y = 1;
export const MODERN_MINIMALIST_STROKE_COLOR = "transparent";
export const MODERN_MINIMALIST_FONT_WEIGHT = "300"; // Light

// Frosted Glass Style
export const FROSTED_GLASS_FONT_FAMILY = "Roboto, Arial, sans-serif";
export const FROSTED_GLASS_TEXT_COLOR = "#FFFFFF"; // Explicit white
export const FROSTED_GLASS_BACKGROUND_BAR_COLOR = "rgba(20, 20, 20, 0.65)";
export const FROSTED_GLASS_BACKGROUND_BAR_PADDING_X_RATIO = 0.05; // % of font size
export const FROSTED_GLASS_BACKGROUND_BAR_PADDING_Y_RATIO = 0.05; // % of font size
export const FROSTED_GLASS_BACKGROUND_BAR_RADIUS_RATIO = 0.15; // % of font size
export const FROSTED_GLASS_FONT_WEIGHT = "bold"; // Changed from "500"

// Bright Accent Stroke Style
export const BRIGHT_ACCENT_STROKE_FONT_FAMILY = "Arial, sans-serif";
export const BRIGHT_ACCENT_STROKE_TEXT_COLOR = "white";
export const BRIGHT_ACCENT_STROKE_STROKE_COLOR = "#2DD4BF"; // Teal accent
export const BRIGHT_ACCENT_STROKE_STROKE_WIDTH_MULTIPLIER = 2.5;
export const BRIGHT_ACCENT_STROKE_FONT_WEIGHT = "bold";

// Watermark Constants
export const WATERMARK_TEXT = "picturecaption.app";
export const WATERMARK_OPACITY = 0.8; // 80% opacity
export const WATERMARK_COLOR = "rgba(255, 255, 255, 0.8)"; // Semi-transparent white
export const WATERMARK_FONT_FAMILY = "Arial, sans-serif";
export const WATERMARK_FONT_SIZE_RATIO_WIDTH = 0.022; // 2.2% of image width
export const MIN_WATERMARK_FONT_SIZE = 8; // Minimum 8px
export const WATERMARK_PADDING_RATIO = 0.015; // 1.5% of min(width, height) for padding
export const WATERMARK_SHADOW_COLOR = "rgba(0, 0, 0, 0.5)";
export const WATERMARK_SHADOW_BLUR = 2;
export const WATERMARK_SHADOW_OFFSET_X = 1;
export const WATERMARK_SHADOW_OFFSET_Y = 1;
