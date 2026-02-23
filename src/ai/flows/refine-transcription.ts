'use server';
/**
 * @fileOverview Transcription Refinement Flow.
 * Polishes raw voice-to-text output into clear, grammatically correct sentences.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineInputSchema = z.object({
  text: z.string().describe("The raw transcription text to refine.")
});
export type RefineInput = z.infer<typeof RefineInputSchema>;

const RefineOutputSchema = z.object({
  refinedText: z.string().describe("The polished, grammatically correct text.")
});
export type RefineOutput = z.infer<typeof RefineOutputSchema>;

export async function refineTranscription(input: RefineInput): Promise<RefineOutput> {
  return refineTranscriptionFlow(input);
}

const refineTranscriptionFlow = ai.defineFlow(
  {
    name: 'refineTranscriptionFlow',
    inputSchema: RefineInputSchema,
    outputSchema: RefineOutputSchema,
  },
  async (input) => {
    const {output} = await ai.generate({
      prompt: `You are a professional transcription assistant. 
Your task is to take the following raw speech-to-text input and fix grammar, punctuation, and formatting while preserving the original meaning. 
If the input is short or incomplete, do your best to make it a natural sentence.

Raw Text: "${input.text}"

Output only the refined text.`,
      output: { schema: RefineOutputSchema }
    });
    
    return output!;
  }
);
