from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

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
        Format your response as a fragment of HTML, without <html>, <head>, or <body> tags.
        Use proper headings (<h3>, <h4>), lists (<ul>, <li>), and emphasis (<strong>, <em>) for key points.
        Do not wrap the response in any code blocks (e.g., ```), and do not add extra tags outside the HTML content.
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
    """Process medical text and stream relevant ICD-10 codes"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        feedback = data.get('feedback', '')
        if not feedback:
            return jsonify({"error": "No feedback text provided"}), 400

        def generate():
            for chunk in chain.stream({"feedback": feedback}):
                yield chunk

        return Response(stream_with_context(generate()), content_type='text/plain')

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4000))
    app.run(host='0.0.0.0', port=port, debug=False)