
import React, { useState, useCallback, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';
import CaptionControls from '../../components/CaptionControls';
import ImagePreview from '../../components/ImagePreview';
import LoadingSpinner from '../../components/LoadingSpinner';
import { describeImage, generateCaption } from '../../services/geminiService';
import { CaptionLength, CaptionStyle, CaptionAppearanceStyle, EmojiCount } from '../../types';
import { 
  APP_TITLE, DEFAULT_CAPTION_LENGTH, DEFAULT_CAPTION_STYLE, DEFAULT_TEXT_POSITION, 
  DEFAULT_TEXT_OPACITY, DEFAULT_CUSTOM_FONT_SIZE, DEFAULT_CAPTION_APPEARANCE_STYLE,
  DEFAULT_EMOJI_COUNT
} from '../../constants';
import { AlertTriangle, CheckCircle2, Info, MessageSquare } from 'lucide-react';

const CaptionTool: React.FC = () => {
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  
  const [captionLength, setCaptionLength] = useState<CaptionLength>(DEFAULT_CAPTION_LENGTH);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>(DEFAULT_CAPTION_STYLE);
  const [emojiCount, setEmojiCount] = useState<EmojiCount>(DEFAULT_EMOJI_COUNT);
  const [inspirationText, setInspirationText] = useState<string>('');
  const [mustIncludeWords, setMustIncludeWords] = useState<string>('');
  const [textPosition, setTextPosition] = useState<string>(DEFAULT_TEXT_POSITION);
  const [textOpacity, setTextOpacity] = useState<number>(DEFAULT_TEXT_OPACITY);
  const [customFontSize, setCustomFontSize] = useState<number | null>(DEFAULT_CUSTOM_FONT_SIZE);
  const [captionAppearanceStyle, setCaptionAppearanceStyle] = useState<CaptionAppearanceStyle>(DEFAULT_CAPTION_APPEARANCE_STYLE);
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);

  const [isLoadingImageDescription, setIsLoadingImageDescription] = useState(false);
  const [isLoadingCaption, setIsLoadingCaption] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissingError, setApiKeyMissingError] = useState<string | null>(null);
  const [showSpicyImageMessage, setShowSpicyImageMessage] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissingError("Gemini API Key (process.env.API_KEY) is not configured. Please set it up to use AI features.");
    }
  }, []);

  const clearAll = () => {
    setUploadedImageFile(null);
    setImageBase64(null);
    setImageDescription(null);
    setGeneratedCaption(null);
    setError(null);
    setInspirationText(''); 
    setMustIncludeWords('');
    setShowSpicyImageMessage(false);
    // Reset control defaults
    setCaptionLength(DEFAULT_CAPTION_LENGTH);
    setCaptionStyle(DEFAULT_CAPTION_STYLE);
    setEmojiCount(DEFAULT_EMOJI_COUNT);
    setTextPosition(DEFAULT_TEXT_POSITION);
    setTextOpacity(DEFAULT_TEXT_OPACITY);
    setCustomFontSize(DEFAULT_CUSTOM_FONT_SIZE);
    setCaptionAppearanceStyle(DEFAULT_CAPTION_APPEARANCE_STYLE);
    
    setIsLoadingImageDescription(false);
    setIsLoadingCaption(false);
  };
  
  const handleImageUpload = useCallback(async (file: File, base64: string) => {
    clearAll(); 
    setUploadedImageFile(file);
    setImageBase64(base64);
    
    if (apiKeyMissingError) {
      setError(apiKeyMissingError);
      setShowSpicyImageMessage(false); // Ensure it's false if API key is missing
      return;
    }

    setIsLoadingImageDescription(true);
    setError(null);
    // showSpicyImageMessage is reset in clearAll, will be set true below if needed
    try {
      const description = await describeImage(base64, file.type);
      setImageDescription(description);
      setShowSpicyImageMessage(false); // Image analysis successful, not spicy
    } catch (e: any) {
      console.warn("Image description failed (possibly NSFW or API issue):", e.message);
      setImageDescription(null); 
      setShowSpicyImageMessage(true); // Image analysis failed, assume spicy
    } finally {
      setIsLoadingImageDescription(false);
    }
  }, [apiKeyMissingError]);

  const handleGenerateCaption = useCallback(async () => {
    if (apiKeyMissingError) {
      setError(apiKeyMissingError);
      return;
    }
    // Check if we have a valid source for caption generation
    const hasValidInputForCaption = 
        (imageDescription && imageDescription.trim() !== '') || 
        (showSpicyImageMessage && inspirationText.trim() !== '');

    if (!hasValidInputForCaption) {
      setError("Cannot generate caption. Either image analysis failed (and no inspiration text was provided for a 'spicy' image) or required input is missing. Please upload an image or provide inspiration text if the image is 'too spicy'.");
      return;
    }

    setIsLoadingCaption(true);
    setError(null);
    setGeneratedCaption(null); 
    try {
      const caption = await generateCaption(
        imageDescription, 
        captionLength, 
        captionStyle, 
        inspirationText, 
        mustIncludeWords,
        emojiCount
      );
      setGeneratedCaption(caption);
      // DO NOT reset showSpicyImageMessage here. It should reflect the image's analysis status.
    } catch (e: any) {
      console.error("Error in handleGenerateCaption:", e);
      setError(e.message || "Failed to generate caption. Check console for details.");
    } finally {
      setIsLoadingCaption(false);
    }
  }, [imageDescription, captionLength, captionStyle, inspirationText, mustIncludeWords, emojiCount, apiKeyMissingError, showSpicyImageMessage]);

  const handleClearImage = () => {
    clearAll();
  };

  const MessageComponent: React.FC<{ type: 'error' | 'success' | 'info', message: string, onDismiss?: () => void }> = ({ type, message, onDismiss }) => {
    const Icon = type === 'error' ? AlertTriangle : type === 'success' ? CheckCircle2 : Info;
    const bgColor = type === 'error' ? 'bg-red-800' : type === 'success' ? 'bg-green-800' : 'bg-blue-800';
    const borderColor = type === 'error' ? 'border-red-600' : type === 'success' ? 'border-green-600' : 'border-blue-600';
    const textColor = type === 'error' ? 'text-red-100' : type === 'success' ? 'text-green-100' : 'text-blue-100';

    return (
      <div className={`p-4 mb-4 rounded-lg border ${borderColor} ${bgColor} ${textColor} flex items-start shadow-lg`}>
        <Icon size={24} className="mr-3 flex-shrink-0 mt-0.5" />
        <p className="flex-grow">{message}</p>
        {onDismiss && <button onClick={onDismiss} className="ml-auto -mx-1.5 -my-1.5 bg-transparent p-1.5 rounded-lg focus:ring-2 focus:ring-red-400 hover:bg-red-700 inline-flex h-8 w-8 text-red-200" aria-label="Dismiss">X</button>}
      </div>
    );
  };

  const isGenerateButtonDisabled = 
    !imageBase64 || 
    isLoadingImageDescription || 
    isLoadingCaption || 
    !( // Negation: button is disabled if NOT ( (description exists) OR (is spicy AND inspiration exists) )
      (imageDescription && imageDescription.trim() !== '') ||
      (showSpicyImageMessage && inspirationText.trim() !== '')
    );

  let captionHelperMessage = "";
  if (isLoadingImageDescription && imageBase64) {
    captionHelperMessage = "Analyzing image... this may take a moment.";
  } else if (showSpicyImageMessage && imageBase64 && !isLoadingCaption && inspirationText.trim() === '' && !imageDescription) {
    captionHelperMessage = "This image is too spicy for AI! Please describe it in the 'Inspiration' field above to enable caption generation.";
  } else if (imageBase64 && !isLoadingImageDescription && !imageDescription && !showSpicyImageMessage && !isLoadingCaption && inspirationText.trim() === '') {
    // This condition means: image uploaded, not loading, no AI desc, not marked spicy, not loading caption, AND no inspiration.
    // This could happen if analysis failed for non-spicy reasons (rare, but possible) or API key error prevented analysis.
    captionHelperMessage = "Image analysis may have failed or is incomplete. If the image is complex or potentially problematic, try describing it in 'Inspiration'.";
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            {APP_TITLE}
          </h1>
          <MessageSquare className="ml-2 md:ml-3 h-7 w-7 md:h-9 md:w-9 text-sky-400" />
        </div>
        <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl mx-auto">
          Upload an image, let AI describe it (or describe it yourself if it's too spicy!), then generate a unique caption and overlay it perfectly.
        </p>
      </header>

      {apiKeyMissingError && !error && <MessageComponent type="error" message={apiKeyMissingError} />}
      {error && <MessageComponent type="error" message={error} onDismiss={() => setError(null)}/>}
      
      {/* Managed "Spicy Image" message: shown when image is spicy AND no error is currently displayed */}
      {showSpicyImageMessage && !error && (
         <div className={`p-4 mb-4 rounded-lg border border-green-600 bg-green-800 bg-opacity-80 text-green-100 flex items-start shadow-lg backdrop-blur-sm`}
              role="alert" aria-live="polite">
          <Info size={24} className="mr-3 flex-shrink-0 mt-0.5 text-green-300" />
          <p className="flex-grow">This image is too spicy for AI! Please describe it in the 'Inspiration' tab below.</p>
        </div>
      )}
      {/* Success message: shown when caption is generated, no error, and not a spicy image message currently */}
      {!error && !showSpicyImageMessage && generatedCaption && !isLoadingCaption && <MessageComponent type="success" message="Caption generated successfully!" />}
      
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="p-6 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400 border-b-2 border-gray-700 pb-2">1. Upload Your Image</h2>
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              disabled={isLoadingImageDescription || isLoadingCaption}
              currentImageUrl={imageBase64}
              onClearImage={handleClearImage}
            />
             {isLoadingImageDescription && (
                <div className="mt-4 flex items-center justify-center text-gray-400">
                  <LoadingSpinner />
                  <span className="ml-2">Analyzing image... this may take a moment.</span>
                </div>
              )}
              {imageDescription && !isLoadingImageDescription && !error && !showSpicyImageMessage && (
                <div className="mt-4 p-3 bg-gray-700 rounded-md">
                  <h4 className="font-semibold text-sm text-green-400">Image Analysis Complete:</h4>
                  <p className="text-xs text-gray-300 italic truncate hover:whitespace-normal focus:whitespace-normal" tabIndex={0} title={imageDescription}>{imageDescription}</p>
                </div>
              )}
          </section>

          <section>
             <h2 className="text-2xl font-semibold mb-4 text-purple-400 border-b-2 border-gray-700 pb-2 ml-6 lg:ml-0">2. Craft Your Caption</h2>
            <CaptionControls
              length={captionLength}
              onLengthChange={setCaptionLength}
              style={captionStyle}
              onStyleChange={setCaptionStyle}
              emojiCount={emojiCount}
              onEmojiCountChange={setEmojiCount}
              inspirationText={inspirationText}
              onInspirationTextChange={setInspirationText}
              mustIncludeWords={mustIncludeWords}
              onMustIncludeWordsChange={setMustIncludeWords}
              textPosition={textPosition}
              onTextPositionChange={setTextPosition}
              textOpacity={textOpacity}
              onTextOpacityChange={setTextOpacity}
              customFontSize={customFontSize}
              onCustomFontSizeChange={setCustomFontSize}
              captionAppearanceStyle={captionAppearanceStyle}
              onCaptionAppearanceStyleChange={setCaptionAppearanceStyle}

              onGenerateCaption={handleGenerateCaption}
              isGenerating={isLoadingCaption}
              imageUploaded={!!imageBase64}
              generateButtonDisabled={isGenerateButtonDisabled}
              captionHelperText={captionHelperMessage}
            />
          </section>
        </div>

        <section className="p-6 bg-gray-800 rounded-lg shadow-xl lg:sticky lg:top-8 lg:self-start">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400 border-b-2 border-gray-700 pb-2">3. Preview & Download</h2>
          <ImagePreview
            imageUrl={imageBase64}
            captionText={generatedCaption}
            originalFileName={uploadedImageFile?.name}
            textPosition={textPosition}
            textOpacity={textOpacity}
            customFontSize={customFontSize}
            captionAppearanceStyle={captionAppearanceStyle}
            isLoadingImage={isLoadingImageDescription} 
          />
        </section>
      </main>
      <footer className="text-center mt-12 py-6 border-t border-gray-700">
        {/* Footer content removed as per user request */}
      </footer>
    </div>
  );
};

export default CaptionTool;
;
