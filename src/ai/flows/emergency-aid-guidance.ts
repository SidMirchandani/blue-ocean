'use server';
/**
 * @fileOverview PathoScan AI Analysis Flow.
 * Handles conversational safety guidance and hazard identification.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PathoScanInputSchema = z.object({
  message: z.string().optional().describe("User's text input or question."),
  photoDataUri: z.string().optional().describe("A photo of the situation as a data URI.")
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

const prompt = ai.definePrompt({
  name: 'pathoScanPrompt',
  input: {schema: PathoScanInputSchema},
  output: {schema: PathoScanOutputSchema},
  prompt: `You are PathoScan AI, a sophisticated safety and first-aid assistant.

Guidelines:
1. If the user just says "Hi" or asks a general question, be friendly and conversational.
2. If the user describes an emergency, injury, or provides a photo of a hazard (mold, insects, plants, wounds), provide immediate safety advice.
3. When providing medical/safety advice, set 'hasStructuredGuidance' to true and fill the 'instructions' array.
4. Keep the 'reply' field conversational and reassuring.

Input:
{{#if message}}Text: {{{message}}}{{/if}}
{{#if photoDataUri}}Photo: {{media url=photoDataUri}}{{/if}}

Always prioritize human life. If it seems critical, remind them to call 911 immediately in the 'warning' or 'reply'.`,
});

const pathoScanFlow = ai.defineFlow(
  {
    name: 'pathoScanFlow',
    inputSchema: PathoScanInputSchema,
    outputSchema: PathoScanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);