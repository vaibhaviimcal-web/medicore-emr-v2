import axios from 'axios'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export class AIService {
  // Clinical decision support
  static async getClinicalSuggestions(symptoms: string[], patientHistory?: any) {
    try {
      const prompt = `As a medical AI assistant, analyze the following symptoms and provide clinical insights:

Symptoms: ${symptoms.join(', ')}
${patientHistory ? `Patient History: ${JSON.stringify(patientHistory)}` : ''}

Please provide:
1. Possible diagnoses (differential diagnosis)
2. Recommended tests/investigations
3. General treatment approach
4. Red flags to watch for

Note: This is for clinical decision support only. Final diagnosis should be made by a qualified physician.`

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a medical AI assistant providing clinical decision support. Always emphasize that final decisions should be made by qualified physicians.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: response.data.choices[0].message.content
      }
    } catch (error: any) {
      console.error('AI Service Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Drug interaction checker
  static async checkDrugInteractions(medications: string[]) {
    try {
      const prompt = `Check for potential drug interactions between the following medications:

Medications: ${medications.join(', ')}

Please provide:
1. Any known drug-drug interactions
2. Severity level (mild, moderate, severe)
3. Clinical significance
4. Recommendations

Be specific and cite medical sources where possible.`

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a pharmaceutical AI assistant specializing in drug interactions. Provide accurate, evidence-based information.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 800
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: response.data.choices[0].message.content
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate prescription summary
  static async generatePrescriptionSummary(prescriptionData: any) {
    try {
      const prompt = `Generate a patient-friendly summary of this prescription:

Diagnosis: ${prescriptionData.diagnosis}
Medications: ${JSON.stringify(prescriptionData.medications)}
Instructions: ${prescriptionData.instructions || 'None'}

Create a clear, easy-to-understand summary for the patient including:
1. What the medications are for
2. How to take them
3. Important precautions
4. When to follow up`

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a medical communication assistant. Create clear, patient-friendly explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 600
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: response.data.choices[0].message.content
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Medical transcription (voice to text processing)
  static async processTranscription(transcription: string) {
    try {
      const prompt = `Process this medical transcription and extract structured information:

Transcription: "${transcription}"

Extract and format:
1. Chief Complaint
2. History of Present Illness
3. Physical Examination findings
4. Assessment/Diagnosis
5. Plan/Treatment

Format as structured medical notes.`

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a medical transcription AI. Extract and structure clinical information accurately.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: response.data.choices[0].message.content
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}
