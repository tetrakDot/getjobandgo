import json
import io
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.permissions import AllowAny

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    import docx
except ImportError:
    docx = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None

from django.conf import settings

logger = logging.getLogger(__name__)

class EvaluateResumeView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        job_description = request.data.get('job_description')
        resume_file = request.FILES.get('resume')

        if not job_description or not resume_file:
            return Response(
                {"error": "Both job description and resume file are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 1. Extract text from resume
            resume_text = self._extract_text(resume_file)
            
            if not resume_text or len(resume_text.strip()) < 20:
                 return Response(
                    {"error": "Could not extract sufficient text from the resume. Please ensure it is a valid PDF or DOCX file."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 2. Perform AI Evaluation
            evaluation_results = self._evaluate_with_ai(job_description, resume_text)
            
            return Response(evaluation_results, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Evaluation error: {str(e)}")
            return Response(
                {"error": f"Internal Evaluation Error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _extract_text(self, file):
        filename = file.name.lower()
        text = ""
        
        try:
            # Important: Read binary content for PDF/Docx
            file_content = file.read()
            
            if filename.endswith('.pdf'):
                if PyPDF2:
                    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                    for page in pdf_reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + " "
                else:
                    raise Exception("PDF processing library (PyPDF2) is not installed on the server.")
            elif filename.endswith('.docx'):
                if docx:
                    doc = docx.Document(io.BytesIO(file_content))
                    for para in doc.paragraphs:
                        text += para.text + "\n"
                else:
                    raise Exception("Docx processing library (python-docx) is not installed on the server.")
            else:
                # Try decoding as text
                try:
                    text = file_content.decode('utf-8')
                except:
                    text = file_content.decode('latin-1', errors='ignore')
        except Exception as e:
            logger.error(f"Text extraction error: {str(e)}")
            # Don't return the error as text, raise it so the view handles it
            raise e
            
        return text

    def _evaluate_with_ai(self, jd, resume):
        """
        Main Business Logic: Tries to use Gemini AI if available, 
        otherwise falls back to a realistic local evaluator.
        """
        # Strict pre-check for nonsense or insufficient input
        jd_clean = jd.strip()
        resume_clean = resume.strip()
        
        if len(jd_clean) < 10 or len(resume_clean) < 10:
             return self._generate_empty_result("Insufficient input data to perform evaluation. Please provide a full job description and resume.")

        api_key = getattr(settings, 'GEMINI_API_KEY', None)
        
        if api_key and genai:
            try:
                return self._evaluate_with_gemini(api_key, jd_clean, resume_clean)
            except Exception as e:
                logger.error(f"Gemini evaluation failed: {str(e)}")
        
        return self._evaluate_locally(jd_clean, resume_clean)

    def _evaluate_with_gemini(self, api_key, jd, resume):
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        system_instructions = """
        You are 2eX – an advanced AI Resume Evaluation and Job Matching System.
        You act as a professional HR recruiter and ATS (Applicant Tracking System).
        Your task is to evaluate how well a candidate's resume matches a given job description and generate a structured, analytical report.

        IMPORTANT:
        - The resume text is extracted plain text.
        - Evaluate strictly based on the provided text.
        - Do NOT assume missing information. If something is not mentioned, treat it as "Not Mentioned".
        - Be objective and analytical. Maintain professional HR tone.
        - Deliver structured, enterprise-level output.
        
        MATCHING LOGIC:
        - Skill Match (40%): Required vs Resume technical stack.
        - Experience Match (25%): Tenure, seniority, and domain relevance.
        - Education Match (10%): Qualification relevance.
        - Keyword & Role Alignment (25%): Tool usage, domain focus, and project depth.

        CLASSIFICATION:
        90–100 → Excellent Match 🟢
        75–89 → Strong Match 🟢
        60–74 → Moderate Match 🟡
        40–59 → Weak Match 🟠
        Below 40 → Poor Match 🔴
        """

        prompt = f"""
        {system_instructions}

        INPUT DATA:
        Job Role Description: 
        {jd}

        Resume Text: 
        {resume}

        Return a JSON response with the following EXACT structure:
        {{
            "overall": number,
            "classification": string (Match name + 🟢/🟡/🟠/🔴),
            "breakdown": {{
                "skillMatch": number,
                "experienceMatch": number,
                "educationMatch": number,
                "keywordRelevance": number
            }},
            "matchedSkills": [string],
            "missingSkills": [string],
            "gapAnalysis": "Clear analytical explanation of mismatches",
            "strengthAreas": [string],
            "riskFactors": [string],
            "improvementSuggestions": [string],
            "recommendation": "Strongly Recommend" | "Recommend" | "Consider with Caution" | "Not Recommended",
            "justification": "Short, objective justification for the recommendation"
        }}
        Only return the raw JSON. No markdown backticks.
        """
        
        response = model.generate_content(prompt)
        try:
            text = response.text.strip()
            # Remove markdown code blocks if any
            if text.startswith("```"):
                lines = text.split('\n')
                if lines[0].startswith("```json"):
                    text = '\n'.join(lines[1:-1])
                else:
                    text = '\n'.join(lines[1:-1])
            
            result = json.loads(text)
            return result
        except Exception as e:
            logger.error(f"Gemini output parsing failed: {str(e)}")
            raise Exception("AI response parsing failed")

    def _evaluate_locally(self, jd, resume):
        """
        Broadened local fallback logic with strict keyword matching to avoid false positives.
        """
        jd_lower = jd.lower()
        resume_lower = resume.lower()
        import re
        
        # Comprehensive tech keyword list
        tech_keywords = [
            # Core Languages
            "python", "javascript", "typescript", "java", "c#", "c++", "ruby", "php", "go", "rust", "swift", "kotlin", "sql",
            # Frontend
            "react", "next.js", "angular", "vue", "html", "css", "tailwind", "bootstrap", "sass", "redux", "jquery",
            # Backend & Frameworks
            "django", "flask", "fastapi", "spring", "express", "node", "laravel", "rails", "asp.net", "nest.js",
            # Database
            "mysql", "postgresql", "mongodb", "redis", "firebase", "sqlite", "oracle", "mariadb", "cassandra",
            # Cloud & DevOps
            "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "git", "github", "gitlab", "ansible", "terraform",
            # Architecture & Others
            "rest", "graphql", "microservices", "api", "websockets", "agile", "scrum", "jira", "linux", "unit testing", "selenium"
        ]

        def extract_exact_skills(text_lower, keywords):
            found = []
            for skill in keywords:
                # Use regex to ensure exact word match (handles dots like next.js)
                pattern = rf'(?<!\w){re.escape(skill)}(?!\w)'
                if re.search(pattern, text_lower):
                    found.append(skill)
            return found
        
        jd_skills = extract_exact_skills(jd_lower, tech_keywords)
        resume_skills = extract_exact_skills(resume_lower, tech_keywords)
        
        matched_skills = [skill for skill in jd_skills if skill in resume_skills]
        missing_skills = [skill for skill in jd_skills if skill not in resume_skills]
        
        # Skill Scoring
        if not jd_skills:
            skill_score = 40 if len(resume_skills) > 3 else 20
        else:
            skill_score = round((len(matched_skills) / len(jd_skills) * 100))

        # Keyword Alignment
        import re
        words_pattern = re.compile(r'\b\w{3,}\b')
        jd_words = set(words_pattern.findall(jd_lower))
        resume_words = set(words_pattern.findall(resume_lower))
        
        # Remove common stop words
        stop_words = {"this", "that", "with", "from", "their", "will", "your", "have"}
        jd_words = jd_words - stop_words
        resume_words = resume_words - stop_words
        
        intersection = jd_words.intersection(resume_words)
        
        keyword_score = round((len(intersection) / max(1, len(jd_words)) * 100))
        if skill_score > 50: keyword_score = min(100, keyword_score + 10)
        
        # 1. Experience & Seniority Match Logic
        experience_score = 0
        def extract_years(text):
            # Match 3+ years, 5 years, etc.
            matches = re.findall(r'(\d+)\s*(?:year|yr)', text)
            if matches:
                return max([int(m) for m in matches])
            return 0

        jd_years_req = extract_years(jd_lower)
        resume_years_exp = extract_years(resume_lower)
        
        # Check for internship markers
        has_internship = any(word in resume_lower for word in ["intern", "internship", "trainee"])
        
        if jd_years_req > 0:
            if resume_years_exp >= jd_years_req:
                experience_score = 100
            elif resume_years_exp > 0:
                experience_score = round((resume_years_exp / jd_years_req) * 80)
            elif has_internship:
                experience_score = 30 # Credit for internships if years are missing
            else:
                experience_score = 10 # Minimal credit for just mentioning words
        else:
            # Entry level or unspecified role
            if resume_years_exp > 2:
                experience_score = 100 # Overqualified/Experienced
            elif resume_years_exp > 0 or has_internship:
                experience_score = 80 # Good for entry level
            else:
                experience_score = 40 # Basic exposure
                
        # Seniority penalty/boost
        senior_terms = ["senior", "lead", "principal", "architect", "manager", "head"]
        resume_has_senior = any(word in resume_lower for word in senior_terms)
        jd_needs_senior = any(word in jd_lower for word in senior_terms)
        
        if jd_needs_senior and not resume_has_senior:
            experience_score = round(experience_score * 0.6) # Penalty for missing seniority
        elif resume_has_senior and not jd_needs_senior:
            experience_score = min(100, experience_score + 10) # Slight boost for being more senior

        # 2. Education match check
        education_score = 0
        edu_keywords = ["bachelor", "master", "phd", "btech", "mtech", "degree", "university", "college", "graduate"]
        if any(word in resume_lower for word in edu_keywords): 
            education_score = 60
        if any(word in resume_lower for word in ["computer science", "engineering", "information technology", "software"]): 
            education_score = 100 if education_score > 0 else 40
        
        # 3. Final Weighted Score
        overall_score = round(
            (0.40 * skill_score) + 
            (0.25 * experience_score) + 
            (0.10 * education_score) + 
            (0.25 * keyword_score)
        )
        
        if overall_score == 0 and len(resume_words) > 5:
            overall_score = 15
        
        return {
            "overall": overall_score,
            "classification": self._get_classification(overall_score),
            "breakdown": {
                "skillMatch": skill_score,
                "experienceMatch": experience_score,
                "educationMatch": education_score,
                "keywordRelevance": keyword_score
            },
            "matchedSkills": [s.title() for s in matched_skills] if matched_skills else ["Context Match Only"],
            "missingSkills": [s.title() for s in missing_skills] if missing_skills else ["Not Specified"],
            "gapAnalysis": f"The candidate has {resume_years_exp} years of detectable experience against a requirement of {jd_years_req} years." if jd_years_req > 0 else "Experience level is being matched against entry-level industry benchmarks.",
            "strengthAreas": ["Internship Exposure"] if has_internship else ["Foundational Knowledge"],
            "riskFactors": ["Years of experience gap"] if jd_years_req > resume_years_exp else ["Technical depth verification required"],
            "improvementSuggestions": ["Quantify experience in years", "Highlight seniority in previous roles if applicable"],
            "recommendation": "Recommend" if overall_score > 70 else ("Consider with Caution" if overall_score > 50 else "Not Recommended"),
            "justification": f"Profile shows {resume_years_exp} years of experience with {skill_score}% skill alignment."
        }

    def _generate_empty_result(self, message):
        return {
            "overall": 0,
            "classification": "Poor Match 🔴",
            "breakdown": {"skillMatch": 0, "experienceMatch": 0, "educationMatch": 0, "keywordRelevance": 0},
            "matchedSkills": [], 
            "missingSkills": [],
            "gapAnalysis": message,
            "strengthAreas": [], 
            "riskFactors": ["Nonsense or Insufficient Input Data"],
            "improvementSuggestions": ["Provide a detailed job description and a comprehensive resume text."],
            "recommendation": "Not Recommended",
            "justification": "Input data is too brief to correlate for a professional evaluation."
        }

    def _get_classification(self, score):
        if score >= 90: return "Excellent Match 🟢"
        if score >= 75: return "Strong Match 🟢"
        if score >= 60: return "Moderate Match 🟡"
        if score >= 40: return "Weak Match 🟠"
        return "Poor Match 🔴"

