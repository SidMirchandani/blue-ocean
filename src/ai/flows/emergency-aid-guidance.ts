'use server';
/**
 * @fileOverview An AI agent providing emergency first-aid or safety guidance.
 *
 * - emergencyAidGuidance - A function that generates step-by-step first-aid instructions or safety protocols.
 * - EmergencyAidGuidanceInput - The input type for the emergencyAidGuidance function.
 * - EmergencyAidGuidanceOutput - The return type for the emergencyAidGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyAidGuidanceInputSchema = z.object({
  situationDescription: z.string().describe("A natural language description of the medical emergency or safety situation.")
});
export type EmergencyAidGuidanceInput = z.infer<typeof EmergencyAidGuidanceInputSchema>;

const EmergencyAidGuidanceOutputSchema = z.object({
  title: z.string().describe("A concise title for the emergency or situation, e.g., 'Severe Bleeding Protocol'."),
  instructions: z.array(z.string()).describe("A list of clear, step-by-step first-aid instructions or safety protocols."),
  warning: z.string().optional().describe("Any crucial safety warnings or disclaimers, if applicable.")
});
export type EmergencyAidGuidanceOutput = z.infer<typeof EmergencyAidGuidanceOutputSchema>;

export async function emergencyAidGuidance(input: EmergencyAidGuidanceInput): Promise<EmergencyAidGuidanceOutput> {
  return emergencyAidGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emergencyAidGuidancePrompt',
  input: {schema: EmergencyAidGuidanceInputSchema},
  output: {schema: EmergencyAidAidGuidanceOutputSchema},
  prompt: `You are an expert in first aid and safety protocols, designed to provide clear, actionable, and step-by-step guidance in emergency situations.
Your goal is to analyze the user's description of a medical emergency or safety situation and generate immediate, practical instructions.
Prioritize safety, clarity, and ease of understanding.

When responding, adhere to the following guidelines:
1.  **Title**: Provide a concise and descriptive title for the emergency protocol.
2.  **Instructions**: Break down the guidance into numbered, step-by-step instructions. Each step should be clear, concise, and easy to follow.
3.  **Warning (Optional)**: Include any critical warnings or disclaimers, such as advising to call emergency services, not to move an injured person, or to seek professional medical attention.

Input Situation: {{{situationDescription}}}`,
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
