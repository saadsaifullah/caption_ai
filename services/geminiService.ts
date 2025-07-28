
import { GoogleGenAI, GenerateContentResponse, Part, FinishReason, BlockedReason } from "@google/genai";
import { CaptionLength, CaptionStyle, EmojiCount } from '../types';
import { GEMINI_MULTIMODAL_MODEL, GEMINI_TEXT_MODEL, CAPTION_STYLE_OPTIONS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

export const describeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
  if (!API_KEY) return Promise.reject(new Error("Gemini API Key is not configured."));
  const operationType = "Image description";

  const base64Data = imageBase64.split(',')[1];
  if (!base64Data) {
    return Promise.reject(new Error("Invalid image data for API."));
  }

  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const textPart: Part = {
    text: "You are an expert image analyst. Describe the key elements, subjects, mood, and context of this image in a concise paragraph. This description will be used to generate a creative caption. Focus on visual details relevant to human interactions, expressions, and attire if present. If multiple people are present, describe their interactions or relationships if discernible."
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MULTIMODAL_MODEL,
      contents: [{ parts: [imagePart, textPart] }],
    });
    
    if (response && typeof response.text === 'string' && response.text.trim() !== '') {
        return response.text.trim();
    } else {
        const finishReason = response?.candidates?.[0]?.finishReason;
        const safetyRatings = response?.candidates?.[0]?.safetyRatings;
        const promptFeedback = response?.promptFeedback;
        const blockReason = promptFeedback?.blockReason;
        const blockReasonMessage = promptFeedback?.blockReasonMessage;

        console.error(`${operationType} failed: AI did not return valid text.`, {
            finishReason,
            hasTextProperty: response && response.hasOwnProperty('text'),
            textValue: response?.text,
            safetyRatings,
            promptFeedback,
            candidates: response?.candidates, 
        });

        let specificReason = "";
        if (blockReason) {
            specificReason = `Prompt blocked due to ${blockReason}`;
            if (blockReasonMessage) {
                specificReason += `: "${blockReasonMessage}"`;
            }
            if (finishReason && finishReason.toString() !== blockReason.toString() && finishReason !== FinishReason.FINISH_REASON_UNSPECIFIED) {
                specificReason += ` (final API reason: ${finishReason})`;
            }
        } else if (finishReason) {
            switch (finishReason) {
                case FinishReason.SAFETY:
                    specificReason = `Request blocked due to safety policies.`;
                    if (safetyRatings && safetyRatings.length > 0) {
                        specificReason += ` Details: ${JSON.stringify(safetyRatings)}`;
                    }
                    break;
                case FinishReason.RECITATION:
                    specificReason = `Request blocked due to recitation policy.`;
                    break;
                case FinishReason.OTHER:
                    specificReason = `Request failed due to an unspecified model issue.`;
                    break;
                default:
                    specificReason = `Request finished with reason: ${finishReason}.`;
                    break;
            }
        }

        if (!specificReason) {
            specificReason = "AI returned an empty or invalid response without a specific reason.";
        }
        
        throw new Error(`${operationType} failed: ${specificReason}`);
    }
  } catch (error) {
    console.error(`Error during ${operationType.toLowerCase()} API call:`, error);
    if (error instanceof Error) {
        const errorMessageLower = error.message.toLowerCase();
        if (errorMessageLower.includes("503") || errorMessageLower.includes("unavailable")) {
            throw new Error(`The AI service for ${operationType.toLowerCase()} is temporarily unavailable (503). Please try again shortly.`);
        }
        // Re-throw the error if it's already one of our structured messages or a new one from pre-API call validation
        // Or wrap it if it's a generic Error from the SDK/network before our specific handling
        if (error.message.startsWith(`${operationType} failed:`)) throw error;
        throw new Error(`${operationType} failed: ${error.message}`);
    }
    throw new Error(`${operationType} failed: An unexpected error occurred - ${String(error)}`);
  }
};

export const generateCaption = async (
  imageDescription: string | null, 
  length: CaptionLength,
  style: CaptionStyle,
  inspirationText?: string,
  mustIncludeWords?: string,
  emojiCount?: EmojiCount
): Promise<string> => {
  if (!API_KEY) return Promise.reject(new Error("Gemini API Key is not configured."));
  const operationType = "Caption generation";

  let currentStyle = style;
  if (style === CaptionStyle.RANDOM) {
    const availableStyles = CAPTION_STYLE_OPTIONS.filter(s => s.value !== CaptionStyle.RANDOM).map(s => s.value as CaptionStyle);
    currentStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)];
  }
  
  let descriptionContext = "";
  if (imageDescription && imageDescription.trim() !== "") {
    descriptionContext = `AI Analysis of Image: "${imageDescription}"`;
    if (inspirationText && inspirationText.trim() !== "") {
      descriptionContext += `\nUser's Additional Guidance: "${inspirationText}"`;
    }
  } else if (inspirationText && inspirationText.trim() !== "") {
    descriptionContext = `User-Provided Image Description/Context: "${inspirationText}" (This is the primary information to use for the caption as AI analysis was not available or was overridden).`;
  } else {
    return Promise.reject(new Error("Cannot generate caption without either AI image description or user-provided inspiration."));
  }

  let prompt = `You are an expert adult-themed caption writer for images. Create a caption based on the following information:
${descriptionContext}
Desired Caption Length: ${length}.
Chosen Style: ${currentStyle}.
`;

  switch (currentStyle) {
    case CaptionStyle.HOTWIFE:
      prompt += `Hotwife Theme: The caption should be teasing and naughty, celebrating an open and consensual hotwife lifestyle. It should be playful and sexy but always respectful and never degrading. Focus on the woman's confidence, sexuality, and the thrill of the lifestyle from her or her partner's perspective.`;
      break;
    case CaptionStyle.HOTWIFE_PLUS:
      prompt += `Hotwife+ (Explicit) Theme: Similar to Hotwife, but much more explicit. Use NSFW language and describe sexy scenarios in a very direct and vulgar way. The tone is still about consensual fun and empowerment, not degradation. Be very descriptive and use strong adult terminology.`;
      break;
    case CaptionStyle.CUCKOLD:
      prompt += `Cuckold Theme: The caption should reflect a cuckold dynamic. Emphasize a power imbalance where the woman is in charge and enjoys sexual freedom, perhaps with other men, while her male partner is submissive or watches. The tone can be somewhat mean or degrading towards the male partner, highlighting his submission and her dominance.`;
      break;
    case CaptionStyle.CUCKOLD_PLUS:
      prompt += `Cuckold+ (Explicit) Theme: This is a more intense and vulgar cuckold caption. Use very explicit and potentially crude language. The tone should be more condescending and humiliating towards the male partner, focusing on his inadequacy or humiliation and the woman's complete control and enjoyment with others. Be direct and graphic.`;
      break;
    case CaptionStyle.CHEATING:
      prompt += `Cheating Theme: The caption should be about infidelity or being unfaithful. It can range from teasing and descriptive of a secret affair to showing pride in the act, or even reluctance and sadness. The perspective can be of the cheater or the one being cheated on, or an observer. Focus on the thrill, secrecy, or emotional conflict.`;
      break;
    case CaptionStyle.ESCORT:
      prompt += `Escort/Paid Encounters Theme: The caption should relate to being paid for sex, OnlyFans work, or meeting strangers for pay. It can be from the perspective of the worker or the client. The tone could be business-like, detached, empowered, or purely descriptive of the transaction or encounter.`;
      break;
    case CaptionStyle.SHY:
      prompt += `Shy/Reluctant Theme: The caption should portray a character who is shy, hesitant, or not entirely comfortable with a sexual situation they are in or are about to be in. It might show internal conflict, nervousness, or a sense of being overwhelmed or pressured, subtly.`;
      break;
    case CaptionStyle.BULLY:
      prompt += `Bully (Degrading) Theme: The caption should be extremely mean, dominant, and degrading. Treat the subject (implicitly the viewer or a male character associated with the image subject) as an inferior "beta loser." Use humiliating language and assert superiority. The tone is one of contempt and dominance.`;
      break;
    case CaptionStyle.SPH:
      prompt += `SPH (Small Penis Humiliation) Theme: The caption must focus on making the subject (implicitly a male viewer or character) feel inadequate due to the perceived smallness of their penis. Use language that is mocking, belittling, and emphasizes how small and unsatisfying it is. Be direct and explicit in the humiliation.`;
      break;
    case CaptionStyle.JOI:
      prompt += `JOI (Jerk Off Instructions) Theme: The caption should provide explicit, step-by-step instructions for the viewer/subject on how to jerk off. Dictate the pace, what to think about, how to touch themselves, and when/how to cum. Be very descriptive, dominant, and arousing in a commanding way.`;
      break;
    case CaptionStyle.HOTWIFE_CHALLENGES:
      prompt += `Hotwife Challenge Prompt: You are crafting an adult-themed challenge for a 'hotwife'.
Your first step is to make a truly random choice for the difficulty level.
1. **Crucial First Step: Randomly and impartially select ONE challenge difficulty level from the following options: "Easy", "Medium", "Hard". Ensure your selection is truly random for each request.**
2. Based *only* on the difficulty level you randomly selected in Step 1, devise a challenge description. The challenge should reflect the "Hotwife+" style: explicit, consensual, empowering, focusing on the woman's confidence and sexuality.
   - Easy challenge examples: "She has to wear a very revealing outfit on a date night with her partner and subtly flirt with the waiter.", "She must send a series of increasingly teasing photos to her partner while he's at work."
   - Medium challenge examples: "She must go to a bar alone (or with her partner watching from afar) and get a stranger to buy her a drink and dance with her.", "She has to initiate a threesome with her partner and another person of her choosing."
   - Hard challenge examples: "She is challenged to go on a 'blind' date with a new man, arranged by her partner, and share all the explicit details afterwards, including photos or videos if she's daring.", "She must spend a weekend exploring her sexuality with a new lover, completely separate from her partner, and only report back the highlights."
3. Create a prefix string formatted as "Selected Difficulty from Step 1 Hotwife Challenge:". For example, if "Easy" was selected in Step 1, the prefix is "Easy Hotwife Challenge:".
4. You MUST format your output response string *exactly* as follows:
   The prefix string you created in step 3 immediately followed by a single newline character (\\n) immediately followed by The challenge description you devised in step 2.

   For example, if the prefix is "Easy Hotwife Challenge:" and the challenge description is "She has to wear a very revealing outfit.", your output string must be:
   "Easy Hotwife Challenge:She has to wear a very revealing outfit."

   There should be no characters before the prefix. There should be no characters after the challenge description.
The final output string must strictly adhere to this "PREFIX\\nCHALLENGE_DESCRIPTION" format, using the difficulty you randomly chose in Step 1.`;
      break;
    case CaptionStyle.CUCKOLD_CHALLENGES:
      prompt += `Cuckold Challenge Prompt: You are crafting an adult-themed challenge for a 'cuckold' scenario.
This scenario involves a dominant woman and a submissive male partner.
Your first step is to make a truly random choice for the difficulty level.
1. **Crucial First Step: Randomly and impartially select ONE challenge difficulty level from the following options: "Easy", "Medium", "Hard". Ensure your selection is truly random for each request.**
2. Based *only* on the difficulty level you randomly selected in Step 1, devise a challenge description. The challenge should reflect the "Cuckold+" style: explicit, focusing on power dynamics, consensual humiliation for the male partner, and the female partner's sexual autonomy and enjoyment with other men.
   - Easy challenge examples: "He has to write a detailed, humiliating fantasy about his partner with another, more dominant man, and read it to her while she's getting ready for a date.", "He must compliment his partner's lover on his prowess after she describes their encounter."
   - Medium challenge examples: "He must watch his partner get ready for a date with another man, including helping her choose her sexiest lingerie and applying her makeup, while being taunted about his inadequacy.", "He is tasked with cleaning up after his partner and her lover, finding and describing any 'evidence' of their passion."
   - Hard challenge examples: "He must remain locked in chastity while his partner enjoys an overnight getaway with her chosen companion. His only release will come later, entirely at her discretion and only after she's shared every tantalizing detail of her adventure.", "He must act as a perfect host and attendant, diligently serving dinner and drinks to his partner and her special guest for the evening. He will be courteously dismissed before their private time begins, left only with the sounds from the other room and his own imagination."
3. Create a prefix string formatted as "Selected Difficulty from Step 1 Cuckold Challenge:". For example, if "Easy" was selected in Step 1, the prefix is "Easy Cuckold Challenge:".
4. You MUST format your output response string *exactly* as follows:
   The prefix string you created in step 3 immediately followed by a single newline character (\\n) immediately followed by The challenge description you devised in step 2.

   For example, if the prefix is "Easy Cuckold Challenge:" and the challenge description is "He has to write a detailed fantasy.", your output string must be:
   "Easy Cuckold Challenge:\\nHe has to write a detailed fantasy."

   There should be no characters before the prefix. There should be no characters after the challenge description.
The final output string must strictly adhere to this "PREFIX\\nCHALLENGE_DESCRIPTION" format, using the difficulty you randomly chose in Step 1.`;
      break;
    default:
      prompt += `Generate a creative caption fitting the general theme of ${currentStyle}.`;
      break;
  }

  if (mustIncludeWords && mustIncludeWords.trim() !== '') {
    const words = mustIncludeWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
    if (words.length > 0) {
      prompt += `\nMandatory words/phrases to include (try to integrate naturally): ${words.join(', ')}.`;
    }
  }
  if (emojiCount && emojiCount !== EmojiCount.NONE) {
    let emojiInstruction = "";
    switch (emojiCount) {
        case EmojiCount.ONE: 
            emojiInstruction = "Include exactly one relevant emoji at the very end of the caption."; 
            break;
        case EmojiCount.FEW: 
            emojiInstruction = "Include 2 or 3 relevant emojis. Spread them out naturally within the caption text where they make sense."; 
            break;
        case EmojiCount.MANY: 
            emojiInstruction = "Include 4 or 5 relevant emojis. Spread them out naturally within the caption text where they make sense."; 
            break;
    }
    prompt += `\n${emojiInstruction}`;
  }

  prompt += "\nGenerate ONLY the caption text as a response. Do not add any other explanations or text around it.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt, 
    });

    if (response && typeof response.text === 'string' && response.text.trim() !== '') {
      return response.text.trim();
    } else {
        const finishReason = response?.candidates?.[0]?.finishReason;
        const safetyRatings = response?.candidates?.[0]?.safetyRatings;
        const promptFeedback = response?.promptFeedback;
        const blockReason = promptFeedback?.blockReason;
        const blockReasonMessage = promptFeedback?.blockReasonMessage;

        console.error(`${operationType} failed: AI did not return valid text.`, {
            finishReason,
            hasTextProperty: response && response.hasOwnProperty('text'),
            textValue: response?.text,
            safetyRatings,
            promptFeedback,
            candidates: response?.candidates,
        });
        
        let specificReason = "";
        if (blockReason) {
            specificReason = `Prompt blocked due to ${blockReason}`;
            if (blockReasonMessage) {
                specificReason += `: "${blockReasonMessage}"`;
            }
            if (finishReason && finishReason.toString() !== blockReason.toString() && finishReason !== FinishReason.FINISH_REASON_UNSPECIFIED) {
                specificReason += ` (final API reason: ${finishReason})`;
            }
        } else if (finishReason) {
            switch (finishReason) {
                case FinishReason.SAFETY:
                    specificReason = `Request blocked due to safety policies.`;
                    if (safetyRatings && safetyRatings.length > 0) {
                        specificReason += ` Details: ${JSON.stringify(safetyRatings)}`;
                    }
                    break;
                case FinishReason.RECITATION:
                    specificReason = `Request blocked due to recitation policy.`;
                    break;
                case FinishReason.OTHER:
                    specificReason = `Request failed due to an unspecified model issue. The AI model might not have been able to fulfill the complex request for this style.`;
                    break;
                default:
                    specificReason = `Request finished with reason: ${finishReason}.`;
                    break;
            }
        }

        if (!specificReason) {
            specificReason = "AI returned an empty or invalid response without a specific reason.";
        }
        
        throw new Error(`${operationType} failed: ${specificReason}`);
    }
  } catch (error) {
    console.error(`Error during ${operationType.toLowerCase()} API call:`, error);
    if (error instanceof Error) {
        const errorMessageLower = error.message.toLowerCase();
        if (errorMessageLower.includes("503") || errorMessageLower.includes("unavailable")) {
            let friendlyMsg = `The AI service for ${operationType.toLowerCase()} is temporarily unavailable (503). Please try again shortly.`;
            if (operationType === "Caption generation") {
                friendlyMsg += ` If the problem persists for complex styles, consider trying a simpler one once the service is restored.`;
            }
            throw new Error(friendlyMsg);
        }
        if (error.message.startsWith(`${operationType} failed:`)) throw error;
        throw new Error(`${operationType} failed: ${error.message}`);
    }
    throw new Error(`${operationType} failed: An unexpected error occurred - ${String(error)}`);
  }
};
