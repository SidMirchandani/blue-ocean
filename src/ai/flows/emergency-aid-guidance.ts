'use server';
/**
 * @fileOverview PathoScan AI Analysis Flow.
 * Handles conversational safety guidance and hazard identification with full history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({
    text: z.string().optional(),
    media: z.object({
      url: z.string(),
      contentType: z.string().optional()
    }).optional()
  }))
});

const PathoScanInputSchema = z.object({
  message: z.string().optional().describe("User's text input or question."),
  photoDataUri: z.string().optional().describe("A photo of the situation as a data URI."),
  history: z.array(MessageSchema).optional().describe("Conversation history.")
});
export type PathoScanInput = z.infer<typeof PathoScanInputSchema>;

const PathoScanOutputSchema = z.object({
  reply: z.string().describe("The conversational response to the user."),
  hasStructuredGuidance: z.boolean().describe("Whether structured first-aid steps follow."),
  title: z.string().optional().describe("A concise title for the protocol if applicable."),
  instructions: z.array(z.string()).optional().describe("Step-by-step first-aid instructions if applicable."),
  warning: z.string().optional().describe("Critical safety warnings.")
});
export type PathoScanOutput = z.infer<typeof PathoScanOutputSchema>;

export async function pathoScanAnalysis(input: PathoScanInput): Promise<PathoScanOutput> {
  return pathoScanFlow(input);
}

const pathoScanFlow = ai.defineFlow(
  {
    name: 'pathoScanFlow',
    inputSchema: PathoScanInputSchema,
    outputSchema: PathoScanOutputSchema,
  },
  async (input) => {
    const {output} = await ai.generate({
      history: input.history || [],
      prompt: [
        { text: `You are PathoScan AI, a safety assistant.
Guidelines:
1. If the user just says "Hi" or asks general questions, be conversational.
2. If the user describes an emergency, injury, or hazard, provide safety advice.
3. When providing advice, set 'hasStructuredGuidance' to true and fill 'instructions'.
4. Prioritize life. Remind them to call emergency services if critical.
5. You must output a JSON object matching the defined schema.` },
        ...(input.photoDataUri ? [{ media: { url: input.photoDataUri, contentType: 'image/jpeg' } }] : []),
        { text: input.message || "Analyze the current situation." }
      ],
      output: { schema: PathoScanOutputSchema }
    });
    
    return output!;
  }
);
