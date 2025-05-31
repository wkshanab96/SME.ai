// N8N Webhook Service for SME.AI
export interface N8NChatRequest {
  userMessage: string;
  attachments?: File[];
  settings: {
    useInternet: boolean;
    useCloud: boolean;
    specialty: string;
    documentType: string;
  };
  userId: string;
  projectId?: string;
  chatId: string;
}

export interface N8NResponse {
  success: boolean;
  message?: string;
  response?: string;
  error?: string;
  rawResponse?: any; // For debugging purposes
}

class N8NService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
    
    if (!this.webhookUrl) {
      console.warn('N8N webhook URL not configured');
    }
  }

  /**
   * Send chat request to N8N webhook
   */
  async sendChatRequest(data: N8NChatRequest): Promise<N8NResponse> {
    if (!this.webhookUrl) {
      throw new Error('N8N webhook URL not configured');
    }    try {
      console.log('N8N Service: Preparing request to webhook:', this.webhookUrl);
      
      // Create FormData to handle both text and file uploads
      const formData = new FormData();
      
      // Add text data
      formData.append('userMessage', data.userMessage);
      formData.append('useInternet', data.settings.useInternet.toString());
      formData.append('useCloud', data.settings.useCloud.toString());
      formData.append('specialty', data.settings.specialty);
      formData.append('documentType', data.settings.documentType);
      formData.append('userId', data.userId);
      formData.append('chatId', data.chatId);
      
      if (data.projectId) {
        formData.append('projectId', data.projectId);
      }

      // Add attachments if any
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file, file.name);
        });
        formData.append('attachmentCount', data.attachments.length.toString());
      }

      console.log('N8N Service: Sending FormData with keys:', Array.from(formData.keys()));

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      console.log('N8N Service: Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('N8N Service: HTTP error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }      const rawResponseText = await response.text();
      console.log('N8N Service: Raw response text:', rawResponseText);

      let result;
      try {
        result = JSON.parse(rawResponseText);
      } catch (parseError) {
        console.error('N8N Service: Failed to parse JSON response:', parseError);
        // If it's not JSON, treat the entire response as the message
        result = { message: rawResponseText };
      }
      
      // Log the actual response for debugging
      console.log('N8N Webhook Response:', result);
      
      // Try to extract the response text from various possible fields
      let responseText = '';
      if (result.response) {
        responseText = result.response;
      } else if (result.message) {
        responseText = result.message;
      } else if (result.reply) {
        responseText = result.reply;
      } else if (result.text) {
        responseText = result.text;
      } else if (result.content) {
        responseText = result.content;
      } else if (result.output) {
        responseText = result.output;
      } else if (typeof result === 'string') {
        responseText = result;
      } else if (result.data && typeof result.data === 'string') {
        responseText = result.data;
      } else {
        // If no recognizable response field, use the entire result as JSON string
        responseText = JSON.stringify(result, null, 2);
      }
      
      return {
        success: true,
        response: responseText,
        rawResponse: result
      };

    } catch (error) {
      console.error('Error sending request to N8N:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  /**
   * Check if N8N service is configured and available
   */
  isConfigured(): boolean {
    return Boolean(this.webhookUrl);
  }

  /**
   * Test webhook connectivity (for debugging)
   */
  async testWebhook(): Promise<{ success: boolean; message: string }> {
    if (!this.webhookUrl) {
      return { success: false, message: 'N8N webhook URL not configured' };
    }

    try {
      const testData = new FormData();
      testData.append('test', 'connection');
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: testData,
      });

      if (response.ok) {
        const text = await response.text();
        return { 
          success: true, 
          message: `Webhook reachable (status: ${response.status}). Response: ${text.substring(0, 100)}...` 
        };
      } else {
        return { 
          success: false, 
          message: `Webhook returned status: ${response.status} ${response.statusText}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to reach webhook: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Get webhook URL (for debugging purposes)
   */
  getWebhookUrl(): string {
    return this.webhookUrl;
  }
}

export default new N8NService();
