from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)




# Initialize the model
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=os.getenv("GOOGLE_API_KEY"))

# Define a comprehensive prompt template
prompt_template = ChatPromptTemplate.from_messages([
    ("system", """
        Act as a medical coding expert specializing in ICD-10 classification. 
        Your task is to provide accurate and detailed ICD-10 codes for medical conditions.
        Always reference the latest classification from https://www.icd10data.com/.
        Include all relevant main codes and subcategories to ensure comprehensive coverage.
        For each code, provide:
        1. The full ICD-10 code
        2. The official description
        3. Any inclusion or exclusion notes if applicable
        4. Relevant coding guidelines when appropriate
    """),
    ("human", """
        Please provide specific and detailed ICD-10 codes for: {feedback}
        
        Include all relevant subcategories and ensure accuracy in your response.
        Format your response as HTML with proper headings, lists, and emphasis for key points.
        also don't add title "html" amd " ``` "
    """)
])

# Create the chain
chain = prompt_template | model | StrOutputParser()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify API is running"""
    return jsonify({"status": "healthy", "message": "ICD-10 Code API is operational"})

@app.route('/api/process-feedback', methods=['POST'])
def process_feedback():
    """Process medical text and return relevant ICD-10 codes"""
    try:
        # Get the feedback from the request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        feedback = data.get('feedback', '')
        
        if not feedback:
            return jsonify({"error": "No feedback text provided"}), 400
            
        # Pass feedback to the chain
        result = chain.invoke({"feedback": feedback})
        
        # Return the result as JSON
        return jsonify({"response": result})
        
    except Exception as e:
        # Handle any unexpected errors
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    # Set host to '0.0.0.0' to make it accessible from other machines
    port = int(os.environ.get("PORT", 4000))
    app.run(host='0.0.0.0', port=port, debug=False)