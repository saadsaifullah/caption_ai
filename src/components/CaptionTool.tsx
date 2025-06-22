import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/ImageUploader';
import CaptionControls from '../../components/CaptionControls';
import ImagePreview from '../../components/ImagePreview';
import LoadingSpinner from '../../components/LoadingSpinner';
import { describeImage, generateCaption } from '../../services/geminiService';
import {
  CaptionLength,
  CaptionStyle,
  CaptionAppearanceStyle,
  EmojiCount
} from '../../types';
import {
  APP_TITLE,
  DEFAULT_CAPTION_LENGTH,
  DEFAULT_CAPTION_STYLE,
  DEFAULT_TEXT_POSITION,
  DEFAULT_TEXT_OPACITY,
  DEFAULT_CUSTOM_FONT_SIZE,
  DEFAULT_CAPTION_APPEARANCE_STYLE,
  DEFAULT_EMOJI_COUNT
} from '../../constants';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CaptionTool: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
      setApiKeyMissingError("Gemini API Key (process.env.API_KEY) is not configured.");
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
    if (!user) {
      setError('Please log in to upload images.');
      navigate('/login');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    const userData = docSnap.exists() ? docSnap.data() : {};

    const plan = userData.plan;
    const planExpires = userData.planExpires ? new Date(userData.planExpires) : null;
    const isPlanActive = plan && planExpires && planExpires > new Date();

    const tokens = userData.tokens || 0;
    const uploadCount = userData.uploadCount || 0;

    const todayKey = new Date().toISOString().split('T')[0];
    const usageKey = `used_${todayKey}`;
    const usedToday = userData[usageKey] || 0;
    const dailyLimit = plan === 'yearly' ? 100 : 50;

    if (isPlanActive && usedToday >= dailyLimit) {
      navigate('/subscribe?limit=You%20have%20reached%20your%20daily%20generation%20limit.');
      return;
    }

    if (!isPlanActive && tokens < 10 && uploadCount >= 5) {
      navigate('/subscribe?limit=You%20have%20reached%20your%20free%20upload%20limit.');
      return;
    }

    const newData: any = {
      uploadCount: uploadCount + 1,
    };

    if (!isPlanActive && tokens >= 10) {
      newData.tokens = tokens - 10;
    }

    if (isPlanActive) {
      newData[usageKey] = usedToday + 1;
    }

    await updateDoc(userRef, newData);

    clearAll();
    setUploadedImageFile(file);
    setImageBase64(base64);

    if (apiKeyMissingError) {
      setError(apiKeyMissingError);
      return;
    }

    setIsLoadingImageDescription(true);
    try {
      const description = await describeImage(base64, file.type);
      setImageDescription(description);
      setShowSpicyImageMessage(false);
    } catch (e: any) {
      setImageDescription(null);
      setShowSpicyImageMessage(true);
    } finally {
      setIsLoadingImageDescription(false);
    }
  }, [user, apiKeyMissingError, navigate]);

  const handleGenerateCaption = useCallback(async () => {
    if (apiKeyMissingError) {
      setError(apiKeyMissingError);
      return;
    }

    const hasValidInput =
      (imageDescription && imageDescription.trim() !== '') ||
      (showSpicyImageMessage && inspirationText.trim() !== '');

    if (!hasValidInput) {
      setError("Upload an image or provide inspiration text.");
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
    } catch (e: any) {
      setError(e.message || "Failed to generate caption.");
    } finally {
      setIsLoadingCaption(false);
    }
  }, [imageDescription, captionLength, captionStyle, inspirationText, mustIncludeWords, emojiCount, apiKeyMissingError, showSpicyImageMessage]);

  const isGenerateButtonDisabled =
    !imageBase64 ||
    isLoadingImageDescription ||
    isLoadingCaption ||
    !(
      (imageDescription && imageDescription.trim() !== '') ||
      (showSpicyImageMessage && inspirationText.trim() !== '')
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">{APP_TITLE}</h1>
          <MessageSquare className="ml-2 h-7 w-7 text-sky-400" />
        </div>
        <p className="text-gray-400 mt-2 text-sm max-w-2xl mx-auto">
          Upload an image, let AI describe it (or describe it yourself), and generate a perfect caption.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="p-6 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400 border-b-2 border-gray-700 pb-2">1. Upload Your Image</h2>
            <ImageUploader
              onImageUpload={handleImageUpload}
              disabled={isLoadingImageDescription || isLoadingCaption}
              currentImageUrl={imageBase64}
              onClearImage={clearAll}
            />
            {isLoadingImageDescription && (
              <div className="mt-4 flex items-center justify-center text-gray-400">
                <LoadingSpinner />
                <span className="ml-2">Analyzing image...</span>
              </div>
            )}
            {imageDescription && !isLoadingImageDescription && !error && !showSpicyImageMessage && (
              <div className="mt-4 p-3 bg-gray-700 rounded-md">
                <h4 className="font-semibold text-sm text-green-400">Image Analysis Complete:</h4>
                <p className="text-xs text-gray-300 italic truncate hover:whitespace-normal" title={imageDescription}>{imageDescription}</p>
              </div>
            )}
          </section>

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
            captionHelperText=""
          />
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
    </div>
  );
};

export default CaptionTool;
