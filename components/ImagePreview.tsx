
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { 
  TEXT_COLOR, TEXT_STROKE_COLOR, TEXT_FONT_FAMILY, TEXT_ALIGN, TEXT_BASELINE,
  TEXT_FONT_SIZE_RATIO_HEIGHT, TEXT_PADDING_RATIO_HEIGHT, TEXT_LINE_HEIGHT_MULTIPLIER,
  MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT, TEXT_STROKE_WIDTH, TEXT_MAX_FONT_SIZE_WIDTH_RATIO,
  MAX_TEXT_BLOCK_HEIGHT_RATIO, DEFAULT_TEXT_OPACITY, ABSOLUTE_MIN_FONT_SIZE_RENDER,
  DEFAULT_FONT_WEIGHT,
  CLASSIC_FILM_FONT_FAMILY, CLASSIC_FILM_TEXT_COLOR, CLASSIC_FILM_STROKE_COLOR, CLASSIC_FILM_FONT_WEIGHT,
  COMIC_BOOK_FONT_FAMILY, COMIC_BOOK_TEXT_COLOR, COMIC_BOOK_STROKE_COLOR, COMIC_BOOK_STROKE_WIDTH_MULTIPLIER, COMIC_BOOK_FONT_WEIGHT,
  ELEGANT_SCRIPT_FONT_FAMILY, ELEGANT_SCRIPT_TEXT_COLOR, ELEGANT_SCRIPT_STROKE_COLOR, ELEGANT_SCRIPT_STROKE_WIDTH_MULTIPLIER, ELEGANT_SCRIPT_FONT_WEIGHT,
  NEON_SIGN_FONT_FAMILY, NEON_SIGN_TEXT_COLOR, NEON_SIGN_SHADOW_COLOR, NEON_SIGN_SHADOW_BLUR, NEON_SIGN_STROKE_COLOR, NEON_SIGN_STROKE_WIDTH_MULTIPLIER, NEON_SIGN_FONT_WEIGHT,
  RETRO_WAVE_FONT_FAMILY, RETRO_WAVE_TEXT_COLOR, RETRO_WAVE_SHADOW_COLOR, RETRO_WAVE_SHADOW_BLUR, RETRO_WAVE_SHADOW_OFFSET_X, RETRO_WAVE_SHADOW_OFFSET_Y, RETRO_WAVE_STROKE_COLOR, RETRO_WAVE_STROKE_WIDTH_MULTIPLIER, RETRO_WAVE_FONT_WEIGHT,
  HANDWRITTEN_NOTE_FONT_FAMILY, HANDWRITTEN_NOTE_TEXT_COLOR, HANDWRITTEN_NOTE_STROKE_COLOR, HANDWRITTEN_NOTE_FONT_WEIGHT,
  VINTAGE_POSTER_FONT_FAMILY, VINTAGE_POSTER_TEXT_COLOR, VINTAGE_POSTER_STROKE_COLOR, VINTAGE_POSTER_STROKE_WIDTH_MULTIPLIER, VINTAGE_POSTER_FONT_WEIGHT,
  MODERN_CLEAN_FONT_FAMILY, MODERN_CLEAN_TEXT_COLOR, MODERN_CLEAN_SHADOW_COLOR, MODERN_CLEAN_SHADOW_BLUR, MODERN_CLEAN_SHADOW_OFFSET_Y, MODERN_CLEAN_STROKE_COLOR, MODERN_CLEAN_FONT_WEIGHT,
  MODERN_MINIMALIST_FONT_FAMILY, MODERN_MINIMALIST_TEXT_COLOR, MODERN_MINIMALIST_SHADOW_COLOR, MODERN_MINIMALIST_SHADOW_BLUR, MODERN_MINIMALIST_SHADOW_OFFSET_Y, MODERN_MINIMALIST_STROKE_COLOR, MODERN_MINIMALIST_FONT_WEIGHT,
  FROSTED_GLASS_FONT_FAMILY, FROSTED_GLASS_TEXT_COLOR, FROSTED_GLASS_BACKGROUND_BAR_COLOR, FROSTED_GLASS_BACKGROUND_BAR_PADDING_X_RATIO, FROSTED_GLASS_BACKGROUND_BAR_PADDING_Y_RATIO, FROSTED_GLASS_BACKGROUND_BAR_RADIUS_RATIO, FROSTED_GLASS_FONT_WEIGHT,
  BRIGHT_ACCENT_STROKE_FONT_FAMILY, BRIGHT_ACCENT_STROKE_TEXT_COLOR, BRIGHT_ACCENT_STROKE_STROKE_COLOR, BRIGHT_ACCENT_STROKE_STROKE_WIDTH_MULTIPLIER, BRIGHT_ACCENT_STROKE_FONT_WEIGHT,
  WATERMARK_TEXT, WATERMARK_OPACITY, WATERMARK_COLOR, WATERMARK_FONT_FAMILY, WATERMARK_FONT_SIZE_RATIO_WIDTH, MIN_WATERMARK_FONT_SIZE, WATERMARK_PADDING_RATIO,
  WATERMARK_SHADOW_COLOR, WATERMARK_SHADOW_BLUR, WATERMARK_SHADOW_OFFSET_X, WATERMARK_SHADOW_OFFSET_Y
} from '../constants';
import { CaptionAppearanceStyle } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ImagePreviewProps {
  imageUrl: string | null;
  captionText: string | null;
  originalFileName?: string;
  textPosition?: string;
  textOpacity?: number;
  customFontSize?: number | null;
  captionAppearanceStyle?: CaptionAppearanceStyle;
  isLoadingImage: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageUrl, 
  captionText, 
  originalFileName = 'captioned-image',
  textPosition = 'bottom-center',
  textOpacity = DEFAULT_TEXT_OPACITY,
  customFontSize,
  captionAppearanceStyle = CaptionAppearanceStyle.DEFAULT,
  isLoadingImage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isImageLoadingInternal, setIsImageLoadingInternal] = useState(false);
  const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D, 
    x: number, y: number, 
    width: number, height: number, 
    radius: number, 
    fillColor: string
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  };


  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !imageUrl) {
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    setIsImageLoadingInternal(true);
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = imageUrl;

    img.onload = () => {
      setIsImageLoadingInternal(false);

      let scaledWidth = img.width;
      let scaledHeight = img.height;

      if (scaledWidth > MAX_CANVAS_WIDTH) {
        const ratio = MAX_CANVAS_WIDTH / scaledWidth;
        scaledWidth = MAX_CANVAS_WIDTH;
        scaledHeight *= ratio;
      }
      if (scaledHeight > MAX_CANVAS_HEIGHT) {
        const ratio = MAX_CANVAS_HEIGHT / scaledHeight;
        scaledHeight = MAX_CANVAS_HEIGHT;
        scaledWidth *= ratio;
      }
      
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      setCanvasSize({width: scaledWidth, height: scaledHeight});

      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      
      let currentCaptionText = captionText;

      if (currentCaptionText && currentCaptionText.trim() !== "") {
        const maxWidthForText = scaledWidth * 0.9; 

        const getFontString = (size: number, weight: string | number = DEFAULT_FONT_WEIGHT, family: string = TEXT_FONT_FAMILY) => {
            return `${weight} ${size}px ${family}`;
        };
        
        const wrapTextInternal = (textToWrap: string, currentFontSize: number, context: CanvasRenderingContext2D, currentFontFamily: string, currentFontWeight: string | number): string[] => {
            context.font = getFontString(currentFontSize, currentFontWeight, currentFontFamily);
            const words = textToWrap.split(' ');
            let currentLine = '';
            const wrappedLines: string[] = [];
            for (let n = 0; n < words.length; n++) {
                const testLine = currentLine + words[n] + ' ';
                const metrics = context.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidthForText && n > 0 && currentLine.trim() !== '') {
                    wrappedLines.push(currentLine.trim());
                    currentLine = words[n] + ' ';
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine.trim() !== '') {
                wrappedLines.push(currentLine.trim());
            }
            return wrappedLines.filter(l => l.length > 0);
        };
        
        let currentFontFamily = TEXT_FONT_FAMILY;
        let currentTextColor = TEXT_COLOR;
        let currentStrokeColor = TEXT_STROKE_COLOR;
        let currentStrokeWidthSetting = TEXT_STROKE_WIDTH; 
        let currentFontWeight: string | number = DEFAULT_FONT_WEIGHT;
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        let needsBackgroundBar = false;
        let backgroundBarColor = '';
        let backgroundBarPaddingX = 0;
        let backgroundBarPaddingY = 0;
        let backgroundBarRadius = 0;

        switch(captionAppearanceStyle) {
            case CaptionAppearanceStyle.CLASSIC_FILM:
                currentFontFamily = CLASSIC_FILM_FONT_FAMILY;
                currentTextColor = CLASSIC_FILM_TEXT_COLOR;
                currentStrokeColor = CLASSIC_FILM_STROKE_COLOR;
                currentFontWeight = CLASSIC_FILM_FONT_WEIGHT;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH;
                if (currentCaptionText) currentCaptionText = currentCaptionText.toUpperCase();
                break;
            case CaptionAppearanceStyle.COMIC_BOOK:
                currentFontFamily = COMIC_BOOK_FONT_FAMILY;
                currentTextColor = COMIC_BOOK_TEXT_COLOR;
                currentStrokeColor = COMIC_BOOK_STROKE_COLOR;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH * COMIC_BOOK_STROKE_WIDTH_MULTIPLIER;
                currentFontWeight = COMIC_BOOK_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.ELEGANT_SCRIPT:
                currentFontFamily = ELEGANT_SCRIPT_FONT_FAMILY;
                currentTextColor = ELEGANT_SCRIPT_TEXT_COLOR;
                currentStrokeColor = ELEGANT_SCRIPT_STROKE_COLOR;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH * ELEGANT_SCRIPT_STROKE_WIDTH_MULTIPLIER;
                currentFontWeight = ELEGANT_SCRIPT_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.NEON_SIGN:
                currentFontFamily = NEON_SIGN_FONT_FAMILY;
                currentTextColor = NEON_SIGN_TEXT_COLOR;
                ctx.shadowColor = NEON_SIGN_SHADOW_COLOR;
                ctx.shadowBlur = NEON_SIGN_SHADOW_BLUR;
                currentStrokeColor = NEON_SIGN_STROKE_COLOR;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH * NEON_SIGN_STROKE_WIDTH_MULTIPLIER;
                currentFontWeight = NEON_SIGN_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.RETRO_WAVE:
                currentFontFamily = RETRO_WAVE_FONT_FAMILY;
                currentTextColor = RETRO_WAVE_TEXT_COLOR;
                ctx.shadowColor = RETRO_WAVE_SHADOW_COLOR;
                ctx.shadowBlur = RETRO_WAVE_SHADOW_BLUR;
                ctx.shadowOffsetX = RETRO_WAVE_SHADOW_OFFSET_X;
                ctx.shadowOffsetY = RETRO_WAVE_SHADOW_OFFSET_Y;
                currentStrokeColor = RETRO_WAVE_STROKE_COLOR;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH * RETRO_WAVE_STROKE_WIDTH_MULTIPLIER;
                currentFontWeight = RETRO_WAVE_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.HANDWRITTEN_NOTE:
                currentFontFamily = HANDWRITTEN_NOTE_FONT_FAMILY;
                currentTextColor = HANDWRITTEN_NOTE_TEXT_COLOR;
                currentStrokeColor = HANDWRITTEN_NOTE_STROKE_COLOR;
                currentStrokeWidthSetting = 0; 
                currentFontWeight = HANDWRITTEN_NOTE_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.VINTAGE_POSTER:
                currentFontFamily = VINTAGE_POSTER_FONT_FAMILY;
                currentTextColor = VINTAGE_POSTER_TEXT_COLOR;
                currentStrokeColor = VINTAGE_POSTER_STROKE_COLOR;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH * VINTAGE_POSTER_STROKE_WIDTH_MULTIPLIER;
                currentFontWeight = VINTAGE_POSTER_FONT_WEIGHT;
                if (currentCaptionText) currentCaptionText = currentCaptionText.toUpperCase();
                break;
            case CaptionAppearanceStyle.MODERN_CLEAN:
                currentFontFamily = MODERN_CLEAN_FONT_FAMILY;
                currentTextColor = MODERN_CLEAN_TEXT_COLOR;
                ctx.shadowColor = MODERN_CLEAN_SHADOW_COLOR;
                ctx.shadowBlur = MODERN_CLEAN_SHADOW_BLUR;
                ctx.shadowOffsetY = MODERN_CLEAN_SHADOW_OFFSET_Y;
                currentStrokeColor = MODERN_CLEAN_STROKE_COLOR; 
                currentStrokeWidthSetting = 0;
                currentFontWeight = MODERN_CLEAN_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.MODERN_MINIMALIST:
                currentFontFamily = MODERN_MINIMALIST_FONT_FAMILY;
                currentTextColor = MODERN_MINIMALIST_TEXT_COLOR;
                ctx.shadowColor = MODERN_MINIMALIST_SHADOW_COLOR;
                ctx.shadowBlur = MODERN_MINIMALIST_SHADOW_BLUR;
                ctx.shadowOffsetY = MODERN_MINIMALIST_SHADOW_OFFSET_Y;
                currentStrokeColor = MODERN_MINIMALIST_STROKE_COLOR;
                currentStrokeWidthSetting = 0;
                currentFontWeight = MODERN_MINIMALIST_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.FROSTED_GLASS:
                currentFontFamily = FROSTED_GLASS_FONT_FAMILY;
                currentTextColor = FROSTED_GLASS_TEXT_COLOR;
                currentStrokeColor = "transparent"; // No text stroke for this style
                currentStrokeWidthSetting = 0;
                currentFontWeight = FROSTED_GLASS_FONT_WEIGHT;
                needsBackgroundBar = true;
                backgroundBarColor = FROSTED_GLASS_BACKGROUND_BAR_COLOR;
                // Paddings and radius will be calculated based on font size later
                break;
             case CaptionAppearanceStyle.BRIGHT_ACCENT_STROKE:
                currentFontFamily = BRIGHT_ACCENT_STROKE_FONT_FAMILY;
                currentTextColor = BRIGHT_ACCENT_STROKE_TEXT_COLOR;
                currentStrokeColor = BRIGHT_ACCENT_STROKE_STROKE_COLOR;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH * BRIGHT_ACCENT_STROKE_STROKE_WIDTH_MULTIPLIER;
                currentFontWeight = BRIGHT_ACCENT_STROKE_FONT_WEIGHT;
                break;
            case CaptionAppearanceStyle.DEFAULT:
            default:
                currentFontFamily = TEXT_FONT_FAMILY;
                currentTextColor = TEXT_COLOR;
                currentStrokeColor = TEXT_STROKE_COLOR;
                currentStrokeWidthSetting = TEXT_STROKE_WIDTH;
                currentFontWeight = DEFAULT_FONT_WEIGHT;
                break;
        }
        
        let optimalFontSize;
        if (customFontSize && customFontSize > 0) {
          optimalFontSize = Math.max(customFontSize, ABSOLUTE_MIN_FONT_SIZE_RENDER);
        } else {
          optimalFontSize = Math.min(
              scaledHeight * TEXT_FONT_SIZE_RATIO_HEIGHT,
              scaledWidth * TEXT_MAX_FONT_SIZE_WIDTH_RATIO,
              72 
          );
          optimalFontSize = Math.max(optimalFontSize, 10); 
        }

        let allLines = wrapTextInternal(currentCaptionText!, optimalFontSize, ctx, currentFontFamily, currentFontWeight);
        let currentLineHeight = optimalFontSize * TEXT_LINE_HEIGHT_MULTIPLIER;
        let totalTextBlockHeight = allLines.length * currentLineHeight;
        const maxAllowedTextBlockHeight = scaledHeight * MAX_TEXT_BLOCK_HEIGHT_RATIO;

        let attempts = 0;
        const MAX_ADJUSTMENT_ATTEMPTS = 10;
        
        while (totalTextBlockHeight > maxAllowedTextBlockHeight && optimalFontSize > ABSOLUTE_MIN_FONT_SIZE_RENDER && attempts < MAX_ADJUSTMENT_ATTEMPTS) {
            attempts++;
            optimalFontSize = Math.floor(optimalFontSize * 0.95); 
            if (optimalFontSize < ABSOLUTE_MIN_FONT_SIZE_RENDER) {
                optimalFontSize = ABSOLUTE_MIN_FONT_SIZE_RENDER;
            }
            
            allLines = wrapTextInternal(currentCaptionText!, optimalFontSize, ctx, currentFontFamily, currentFontWeight);
            if (allLines.length === 0) break; 

            currentLineHeight = optimalFontSize * TEXT_LINE_HEIGHT_MULTIPLIER;
            totalTextBlockHeight = allLines.length * currentLineHeight;
            if (optimalFontSize === ABSOLUTE_MIN_FONT_SIZE_RENDER && totalTextBlockHeight > maxAllowedTextBlockHeight) {
                 break;
            }
        }
        
        if (allLines.length > 0) {
            ctx.font = getFontString(optimalFontSize, currentFontWeight, currentFontFamily);
            ctx.fillStyle = currentTextColor;
            ctx.strokeStyle = currentStrokeColor;
            
            let dynamicStrokeWidth = Math.min(currentStrokeWidthSetting * (optimalFontSize / 30), currentStrokeWidthSetting * 2.5);
            ctx.lineWidth = Math.max(dynamicStrokeWidth, (currentStrokeWidthSetting > 0 ? 0.5 : 0) );

            if (captionAppearanceStyle === CaptionAppearanceStyle.ELEGANT_SCRIPT && ctx.lineWidth > 0) {
                 ctx.lineWidth = Math.min(ctx.lineWidth, 2); 
            }
            if (captionAppearanceStyle === CaptionAppearanceStyle.NEON_SIGN && ctx.lineWidth > 0) {
                 ctx.lineWidth = Math.min(ctx.lineWidth, 1.5);
            }

            ctx.textAlign = TEXT_ALIGN;
            
            const previousAlpha = ctx.globalAlpha;
            ctx.globalAlpha = (textOpacity ?? DEFAULT_TEXT_OPACITY) / 100;

            const paddingFromImageEdge = scaledHeight * TEXT_PADDING_RATIO_HEIGHT;
            const xText = scaledWidth / 2;

            if (needsBackgroundBar) {
                backgroundBarPaddingX = optimalFontSize * FROSTED_GLASS_BACKGROUND_BAR_PADDING_X_RATIO;
                backgroundBarPaddingY = optimalFontSize * FROSTED_GLASS_BACKGROUND_BAR_PADDING_Y_RATIO;
                backgroundBarRadius = optimalFontSize * FROSTED_GLASS_BACKGROUND_BAR_RADIUS_RATIO;
            }


            const drawTextLines = (
                linesToDraw: string[], 
                startYPos: number, 
                baseline: CanvasTextBaseline,
                blockNumber: number = 0 // For Frosted Glass with top-bottom split
            ) => {
              if (linesToDraw.length === 0) return;

              ctx.textBaseline = baseline;

              // Calculate background bar dimensions for this block of text
              if (needsBackgroundBar) {
                let maxLineWidth = 0;
                linesToDraw.forEach(line => {
                    maxLineWidth = Math.max(maxLineWidth, ctx.measureText(line).width);
                });
                
                const barWidth = maxLineWidth + 2 * backgroundBarPaddingX;
                const barHeight = linesToDraw.length * currentLineHeight + 2 * backgroundBarPaddingY - (currentLineHeight - optimalFontSize); // Adjust for better fit
                const barX = xText - barWidth / 2;
                let barY;

                if (baseline === TEXT_BASELINE) { // Bottom aligned
                    barY = startYPos - (linesToDraw.length * currentLineHeight) - backgroundBarPaddingY + (currentLineHeight - optimalFontSize) / 2;
                } else if (baseline === "middle") { // Middle aligned
                    barY = startYPos - (barHeight / 2) + (optimalFontSize*0.35) - (currentLineHeight - optimalFontSize)/2 ; // rough
                } else { // Top aligned (alphabetic)
                    barY = startYPos - optimalFontSize * 0.8 + (currentLineHeight - optimalFontSize)/2  - backgroundBarPaddingY; // Adjusted for alphabetic baseline
                }
                
                // Special handling for top-bottom-center to ensure bar aligns with text block
                if (textPosition === 'top-bottom-center') {
                   if (blockNumber === 0) { // Top block
                       barY = startYPos - (optimalFontSize * 0.8) - backgroundBarPaddingY;
                   } else { // Bottom block
                        barY = startYPos - (linesToDraw.length * currentLineHeight) - backgroundBarPaddingY + (currentLineHeight - optimalFontSize*0.8);
                   }
                }


                const tempAlpha = ctx.globalAlpha;
                // Apply background bar's own potential alpha, then combine with main text opacity
                const barColorAlpha = FROSTED_GLASS_BACKGROUND_BAR_COLOR.includes('rgba') ? parseFloat(FROSTED_GLASS_BACKGROUND_BAR_COLOR.split(',')[3]) || 1 : 1;
                ctx.globalAlpha = tempAlpha * barColorAlpha;
                drawRoundedRect(ctx, barX, barY, barWidth, barHeight, backgroundBarRadius, backgroundBarColor);
                ctx.globalAlpha = tempAlpha; // Restore text opacity
              }


              for (let i = 0; i < linesToDraw.length; i++) {
                let yLine;
                if (baseline === TEXT_BASELINE) { 
                    yLine = startYPos - ((linesToDraw.length - 1 - i) * currentLineHeight);
                } else if (baseline === "middle") { 
                    const blockCenterY = startYPos + (optimalFontSize * 0.7 / 2); 
                    const lineRelativeY = (i - (linesToDraw.length -1) / 2) * currentLineHeight;
                    yLine = blockCenterY + lineRelativeY;

                } else { // alphabetic (top)
                    yLine = startYPos + (i * currentLineHeight);
                }
                
                if (ctx.lineWidth > 0 && currentStrokeColor !== 'transparent') ctx.strokeText(linesToDraw[i], xText, yLine);
                ctx.fillText(linesToDraw[i], xText, yLine);
              }
            };
            
            if (textPosition === 'top-bottom-center') {
              const midPoint = Math.ceil(allLines.length / 2);
              const topLines = allLines.slice(0, midPoint);
              const bottomLines = allLines.slice(midPoint);

              if (topLines.length > 0) {
                 const topBlockEffectiveHeight = topLines.length * currentLineHeight;
                 const topStartY = paddingFromImageEdge + optimalFontSize; 
                 drawTextLines(topLines, topStartY, "alphabetic", 0);
              }
              if (bottomLines.length > 0) {
                 const bottomBlockBaseY = scaledHeight - paddingFromImageEdge; 
                 drawTextLines(bottomLines, bottomBlockBaseY, TEXT_BASELINE, 1);
              }
            } else { 
              let startY;
              let baselineToUse: CanvasTextBaseline = "alphabetic";
              switch(textPosition) {
                case 'top-center':
                  baselineToUse = "alphabetic"; 
                  startY = paddingFromImageEdge + optimalFontSize; 
                  break;
                case 'middle-center':
                  baselineToUse = "middle";
                  // totalTextBlockHeight already accounts for all lines
                  startY = (scaledHeight / 2) - (totalTextBlockHeight / 2) + (optimalFontSize * 0.35); 
                  break;
                case 'bottom-center':
                default:
                  baselineToUse = TEXT_BASELINE; 
                  startY = scaledHeight - paddingFromImageEdge; 
                  break;
              }
              drawTextLines(allLines, startY, baselineToUse);
            }
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.globalAlpha = previousAlpha; 
        }
      }

      // Draw watermark if captionText is present
      if (captionText && captionText.trim() !== "") {
        ctx.save(); // Save current context state

        ctx.globalAlpha = WATERMARK_OPACITY;
        
        let watermarkFontSize = Math.max(scaledWidth * WATERMARK_FONT_SIZE_RATIO_WIDTH, MIN_WATERMARK_FONT_SIZE);
        // Ensure it doesn't get too big on very tall, narrow images
        watermarkFontSize = Math.min(watermarkFontSize, scaledHeight * 0.05, 30); 
        
        ctx.font = `${watermarkFontSize}px ${WATERMARK_FONT_FAMILY}`;
        ctx.fillStyle = WATERMARK_COLOR;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        // Apply shadow for watermark
        ctx.shadowColor = WATERMARK_SHADOW_COLOR;
        ctx.shadowBlur = WATERMARK_SHADOW_BLUR;
        ctx.shadowOffsetX = WATERMARK_SHADOW_OFFSET_X;
        ctx.shadowOffsetY = WATERMARK_SHADOW_OFFSET_Y;
        
        const watermarkPadding = Math.min(scaledWidth, scaledHeight) * WATERMARK_PADDING_RATIO;
        const watermarkX = scaledWidth - watermarkPadding;
        const watermarkY = scaledHeight - watermarkPadding;
        
        ctx.fillText(WATERMARK_TEXT, watermarkX, watermarkY);
        
        // Reset shadow properties specifically (could also rely on ctx.restore, but explicit reset is clearer)
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.restore(); // Restore context state (will also reset globalAlpha and shadow if not explicitly reset above)
      }

    };
    img.onerror = () => {
      setIsImageLoadingInternal(false);
      console.error("Failed to load image for canvas.");
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Error loading image", canvas.width/2, canvas.height/2);
      }
    }

  }, [
      imageUrl, captionText, textPosition, textOpacity, customFontSize, captionAppearanceStyle, 
      originalFileName
    ]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]); 

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas && imageUrl) { 
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeFileName = originalFileName ? originalFileName.replace(/[^a-z0-9_.\-]/gi, '_').toLowerCase() : 'image';
      link.download = `${safeFileName}_captioned.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!imageUrl && !isLoadingImage) {
    return (
      <div className="w-full aspect-video bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
        <p>Upload an image to see preview here</p>
      </div>
    );
  }
  
  const showSpinner = isLoadingImage || isImageLoadingInternal;

  return (
    <div className="relative w-full flex flex-col items-center space-y-4">
      {showSpinner && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center z-10 rounded-lg">
          <LoadingSpinner size="w-16 h-16" />
          <p className="mt-2 text-lg">{isLoadingImage ? 'Analyzing image...' : 'Rendering preview...'}</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={`rounded-lg shadow-lg border border-gray-700 ${showSpinner ? 'opacity-50' : ''}`}
        style={{maxWidth: '100%', height: 'auto', display: (imageUrl && canvasSize.width > 0) ? 'block' : 'none'}}
        aria-label="Image preview with caption"
      />
       {imageUrl && canvasSize.width > 0 && !showSpinner && (
        <button
          onClick={handleDownload}
          className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-green-400 focus:outline-none disabled:opacity-50"
          disabled={showSpinner || !captionText} 
          title={!captionText ? "Generate a caption to download" : "Download Image with Caption"}
          aria-disabled={showSpinner || !captionText}
        >
          <Download size={20} className="mr-2" />
          Download Image
        </button>
      )}
    </div>
  );
};

export default ImagePreview;
