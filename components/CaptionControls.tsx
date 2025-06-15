
import React from 'react';
import { CaptionLength, CaptionStyle, CaptionAppearanceStyle, EmojiCount } from '../types';
import { 
  CAPTION_LENGTH_OPTIONS, CAPTION_STYLE_OPTIONS, TEXT_POSITION_OPTIONS, 
  MIN_USER_FONT_SIZE, MAX_USER_FONT_SIZE, DEFAULT_FALLBACK_SLIDER_FONT_SIZE,
  CAPTION_APPEARANCE_STYLE_OPTIONS, EMOJI_COUNT_OPTIONS
} from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { Sparkles, Palette, Settings2, Eye, Lightbulb, ListPlus, Type, Film, AlignCenter, Smile } from 'lucide-react';

interface CaptionControlsProps {
  length: CaptionLength;
  onLengthChange: (length: CaptionLength) => void;
  style: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
  emojiCount: EmojiCount;
  onEmojiCountChange: (count: EmojiCount) => void;
  inspirationText: string;
  onInspirationTextChange: (text: string) => void;
  mustIncludeWords: string;
  onMustIncludeWordsChange: (text: string) => void;
  textPosition: string;
  onTextPositionChange: (position: string) => void;
  textOpacity: number;
  onTextOpacityChange: (opacity: number) => void;
  customFontSize: number | null;
  onCustomFontSizeChange: (size: number | null) => void;
  captionAppearanceStyle: CaptionAppearanceStyle;
  onCaptionAppearanceStyleChange: (style: CaptionAppearanceStyle) => void;

  onGenerateCaption: () => void;
  isGenerating: boolean; // Represents isLoadingCaption
  imageUploaded: boolean;
  generateButtonDisabled: boolean;
  captionHelperText?: string;
}

const CaptionControls: React.FC<CaptionControlsProps> = ({
  length, onLengthChange, style, onStyleChange, emojiCount, onEmojiCountChange,
  inspirationText, onInspirationTextChange, mustIncludeWords, onMustIncludeWordsChange, 
  textPosition, onTextPositionChange, textOpacity, onTextOpacityChange, 
  customFontSize, onCustomFontSizeChange, captionAppearanceStyle, onCaptionAppearanceStyleChange,
  onGenerateCaption, isGenerating, imageUploaded, generateButtonDisabled, captionHelperText
}) => {

  const commonInputClasses = "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const commonLabelClasses = "block mb-2 text-sm font-medium text-gray-300";
  const commonSliderClasses = "w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400";
  const commonCheckboxLabelClasses = "flex items-center text-sm font-medium text-gray-300 cursor-pointer";
  const commonCheckboxClasses = "w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-800 focus:ring-2 disabled:opacity-50";

  const handleAutoSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onCustomFontSizeChange(null); 
    } else {
      onCustomFontSizeChange(DEFAULT_FALLBACK_SLIDER_FONT_SIZE); 
    }
  };

  const isAutoSize = customFontSize === null;
  const controlsDisabled = !imageUploaded || isGenerating;

  return (
    <div className="space-y-6 p-6 bg-gray-800 rounded-lg shadow-xl">
      <div>
        <h3 className="text-lg font-semibold text-pink-400 mb-3 flex items-center">
          <Settings2 size={20} className="mr-2" /> 
          Craft Your Caption & Overlay
        </h3>
        {!imageUploaded && (
           <p className="text-sm text-yellow-400 bg-yellow-900 bg-opacity-50 p-3 rounded-md">
            Upload an image first to enable controls.
          </p>
        )}
      </div>

      {/* Caption Content Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="captionLength" className={commonLabelClasses}>
            <Sparkles size={16} className="inline mr-1 mb-0.5" /> Caption Length
          </label>
          <select id="captionLength" value={length} onChange={(e) => onLengthChange(e.target.value as CaptionLength)} disabled={controlsDisabled} className={commonInputClasses} aria-label="Select caption length">
            {CAPTION_LENGTH_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="captionStyle" className={commonLabelClasses}>
            <Palette size={16} className="inline mr-1 mb-0.5" /> Caption Style
          </label>
          <select id="captionStyle" value={style} onChange={(e) => onStyleChange(e.target.value as CaptionStyle)} disabled={controlsDisabled} className={commonInputClasses} aria-label="Select caption style">
            {CAPTION_STYLE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="emojiCount" className={commonLabelClasses}>
                <Smile size={16} className="inline mr-1 mb-0.5" /> Emoji Count
            </label>
            <select id="emojiCount" value={emojiCount} onChange={(e) => onEmojiCountChange(e.target.value as EmojiCount)} disabled={controlsDisabled} className={commonInputClasses} aria-label="Select emoji count">
                {EMOJI_COUNT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
        </div>
      </div>

      <div>
        <label htmlFor="inspirationText" className={commonLabelClasses}>
          <Lightbulb size={16} className="inline mr-1 mb-0.5" /> Inspiration (Optional, or Required if image is "too spicy")
        </label>
        <textarea id="inspirationText" value={inspirationText} onChange={(e) => onInspirationTextChange(e.target.value)} disabled={controlsDisabled} className={`${commonInputClasses} min-h-[80px] resize-y`} placeholder="Describe the scenario, who the people involved are, which pov to use, names, inspirations,..." aria-label="Enter inspiration for the caption" rows={3}/>
      </div>
      <div>
        <label htmlFor="mustIncludeWords" className={commonLabelClasses}>
          <ListPlus size={16} className="inline mr-1 mb-0.5" /> Words you want used (Optional, comma-separated)
        </label>
        <textarea id="mustIncludeWords" value={mustIncludeWords} onChange={(e) => onMustIncludeWordsChange(e.target.value)} disabled={controlsDisabled} className={`${commonInputClasses} min-h-[60px] resize-y`} placeholder="e.g., 'names, actions,...'" aria-label="Enter specific words or phrases to include in the caption, separated by commas" rows={2}/>
      </div>
        
      {/* Overlay Appearance Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
            <label htmlFor="captionAppearanceStyle" className={commonLabelClasses}>
              <Film size={16} className="inline mr-1 mb-0.5" /> Caption Appearance
            </label>
            <select id="captionAppearanceStyle" value={captionAppearanceStyle} onChange={(e) => onCaptionAppearanceStyleChange(e.target.value as CaptionAppearanceStyle)} disabled={controlsDisabled} className={commonInputClasses} aria-label="Select caption appearance style">
              {CAPTION_APPEARANCE_STYLE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
        </div>
        <div>
            <label htmlFor="textPosition" className={commonLabelClasses}>
              <AlignCenter size={16} className="inline mr-1 mb-0.5" /> Text Position
            </label>
            <select id="textPosition" value={textPosition} onChange={(e) => onTextPositionChange(e.target.value)} disabled={controlsDisabled} className={commonInputClasses} aria-label="Select text position on image">
              {TEXT_POSITION_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <div className={commonCheckboxLabelClasses}>
                <input type="checkbox" id="autoFontSize" checked={isAutoSize} onChange={handleAutoSizeChange} disabled={controlsDisabled} className={`${commonCheckboxClasses} mr-2`} aria-label="Toggle automatic font sizing"/>
                <label htmlFor="autoFontSize" className="cursor-pointer select-none">Auto Font Size</label>
            </div>
            <div>
                <label htmlFor="customFontSizeSlider" className={`${commonLabelClasses} flex justify-between items-center`}>
                    <span><Type size={16} className="inline mr-1 mb-0.5" /> Font Size</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full">
                        {isAutoSize ? 'Auto' : `${customFontSize}px`}
                    </span>
                </label>
                <input type="range" id="customFontSizeSlider" min={MIN_USER_FONT_SIZE} max={MAX_USER_FONT_SIZE} value={customFontSize ?? DEFAULT_FALLBACK_SLIDER_FONT_SIZE} onChange={(e) => onCustomFontSizeChange(parseInt(e.target.value, 10))} disabled={isAutoSize || controlsDisabled} className={commonSliderClasses} aria-label="Adjust font size"/>
            </div>
        </div>
         <div>
            <label htmlFor="textOpacity" className={`${commonLabelClasses} flex justify-between items-center`}>
              <span><Eye size={16} className="inline mr-1 mb-0.5" /> Text Opacity</span>
              <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full">{textOpacity}%</span>
            </label>
            <input type="range" id="textOpacity" min="0" max="100" value={textOpacity} onChange={(e) => onTextOpacityChange(parseInt(e.target.value, 10))} disabled={controlsDisabled} className={commonSliderClasses} aria-label="Adjust text opacity"/>
        </div>
      </div>

      <button onClick={onGenerateCaption} disabled={generateButtonDisabled || isGenerating} className="w-full flex items-center justify-center p-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-pink-400 focus:outline-none" aria-live="polite">
        {isGenerating ? (<><LoadingSpinner size="w-5 h-5" color="text-white" /><span className="ml-2">Generating Caption...</span></>) : (<><Sparkles size={20} className="mr-2"/>Generate Caption</>)}
      </button>
      
      {captionHelperText && (
        <p className="text-xs text-yellow-400 mt-2 text-center">
          {captionHelperText}
        </p>
      )}
    </div>
  );
};

export default CaptionControls;
