'use server';
/**
 * @fileOverview An AI agent providing emergency first-aid or safety guidance.
 * Supports both text descriptions and visual inputs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyAidGuidanceInputSchema = z.object({
  situationDescription: z.string().optional().describe("A natural language description of the medical emergency."),
  photoDataUri: z.string().optional().describe("A photo of the injury or situation as a data URI.")
});
export type EmergencyAidGuidanceInput = z.infer<typeof EmergencyAidGuidanceInputSchema>;

const EmergencyAidGuidanceOutputSchema = z.object({
  title: z.string().describe("A concise title for the protocol."),
  instructions: z.array(z.string()).describe("Step-by-step first-aid instructions."),
  warning: z.string().optional().describe("Critical safety warnings.")
});
export type EmergencyAidGuidanceOutput = z.infer<typeof EmergencyAidGuidanceOutputSchema>;

export async function emergencyAidGuidance(input: EmergencyAidGuidanceInput): Promise<EmergencyAidGuidanceOutput> {
  return emergencyAidGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emergencyAidGuidancePrompt',
  input: {schema: EmergencyAidGuidanceInputSchema},
  output: {schema: EmergencyAidGuidanceOutputSchema},
  prompt: `You are an expert emergency medical assistant. Provide clear, immediate first-aid instructions based on the input.
  
{{#if situationDescription}}
Description: {{{situationDescription}}}
{{/if}}

{{#if photoDataUri}}
Visual Input: {{media url=photoDataUri}}
{{/if}}

Prioritize life-saving actions. If a photo is provided, identify visible injuries and provide specific care steps.`,
});

const emergencyAidGuidanceFlow = ai.defineFlow(
  {
    name: 'emergencyAidGuidanceFlow',
    inputSchema: EmergencyAidGuidanceInputSchema,
    outputSchema: EmergencyAidGuidanceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
