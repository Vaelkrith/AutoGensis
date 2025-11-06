# # --------------------------------------------------------------------------
# # AutoGenesis: Core Agentic Pipeline (Phase 1 - Library)
# #
# # This file now acts as the core logic library for AutoGenesis.
# # The EvoCore™ orchestrator can be imported and used by other scripts,
# # like our new API server.
# # --------------------------------------------------------------------------

# import os
# import json
# from datetime import datetime
# from dotenv import load_dotenv

# # --- Imports for our Agents ---
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.prompts import PromptTemplate
# from langchain.output_parsers import StructuredOutputParser, ResponseSchema
# from langchain_core.output_parsers import StrOutputParser

# # This function is now separate so it can be called without loading the LLM
# def load_environment():
#     print("▶️ Loading environment...")
#     load_dotenv()

# load_environment()

# # --- Initialize the LLM ---
# print("▶️ Initializing Large Language Model...")
# llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)

# # --- Agent Definition: Product Agent ---
# def product_agent(idea: str) -> dict:
#     """
#     Module 1: Product Agent
#     Takes a startup idea and creates a structured product plan.
#     """
#     print("▶️ [Product Agent] Activated. Analyzing idea...")

#     response_schemas = [
#         ResponseSchema(name="product_name", description="A catchy, brandable name for the startup."),
#         ResponseSchema(name="tagline", description="A short, memorable tagline for the product."),
#         ResponseSchema(name="target_audience", description="A description of the ideal user persona."),
#         ResponseSchema(name="mvp_features", description="An array of strings, where each string is a core feature for the Minimum Viable Product. Provide 3-5 features."),
#     ]
#     parser = StructuredOutputParser.from_response_schemas(response_schemas)
#     format_instructions = parser.get_format_instructions()

#     prompt = PromptTemplate(
#         template="""You are a world-class Product Manager. Your task is to analyze the following startup idea and create a concise product plan.
#         The plan must be structured, realistic, and focused on a minimal viable product.

#         Startup Idea: "{idea}"

#         Your output must be a JSON object that strictly follows this format:
#         {format_instructions}
#         """,
#         input_variables=["idea"],
#         partial_variables={"format_instructions": format_instructions}
#     )

#     chain = prompt | llm | parser
#     product_plan = chain.invoke({"idea": idea})
    
#     print("✅ [Product Agent] Product plan generated.")
#     return product_plan

# # --- Agent Definition: Design Agent ---
# def design_agent(mvp_features: list[str]) -> dict:
#     """
#     Module 2: Design Agent
#     Takes a list of features and suggests a UI layout for a Streamlit app.
#     """
#     print("▶️ [Design Agent] Activated. Designing UI structure...")

#     response_schemas = [
#         ResponseSchema(name="app_layout", description="Describe the overall layout style. Should be either 'sidebar' for navigation or 'top-down' for a simple single page."),
#         ResponseSchema(
#             name="feature_designs",
#             description="A list of dictionaries. Each dictionary must represent one feature and have two keys: 'feature' (the original feature text) and 'components' (a list of the specific Streamlit UI components required to implement that feature, e.g., ['st.text_input', 'st.button']).",
#         )
#     ]
#     parser = StructuredOutputParser.from_response_schemas(response_schemas)
#     format_instructions = parser.get_format_instructions()

#     prompt = PromptTemplate(
#         template="""You are an expert UI/UX Designer specializing in rapid prototyping with Streamlit.
#         Based on the following list of features, design a simple UI structure.

#         MVP Features:
#         {mvp_features_str}

#         Your output must be a JSON object that strictly follows this format:
#         {format_instructions}
#         """,
#         input_variables=["mvp_features_str"],
#         partial_variables={"format_instructions": format_instructions}
#     )

#     chain = prompt | llm | parser
#     design_plan = chain.invoke({"mvp_features_str": json.dumps(mvp_features)})
#     print("✅ [Design Agent] UI design plan generated.")
#     return design_plan

# # --- Agent Definition: Engineering Agent (FINAL UPGRADE) ---
# def engineering_agent(product_plan: dict, design_plan: dict) -> str:
#     """
#     Module 3: Engineering Agent
#     Takes the product and design plans and generates the complete, runnable Streamlit code.
#     """
#     print("▶️ [Engineering Agent] Activated. Writing Streamlit code...")

#     prompt = PromptTemplate.from_template(
#         """You are an expert Senior Python Developer specializing in creating robust, single-file Streamlit applications.
#         Your task is to generate the complete Python code for a Streamlit app based on the provided Product and Design plans.

#         Product Plan:
#         {product_plan_str}

#         Design Plan:
#         {design_plan_str}

#         **CRITICAL INSTRUCTIONS:**
#         1.  Your output MUST be ONLY the raw Python code for the Streamlit application.
#         2.  Do NOT include any explanations, comments outside the code, or markdown formatting like ```python.
#         3.  The code must be fully functional and runnable.
#         4.  Correctly import all necessary libraries (e.g., `import streamlit as st`, `import pandas as pd`, `from datetime import datetime`).
#         5.  Use `st.session_state` to initialize and manage all application data. Check if data exists in `st.session_state` before accessing it. For example: `if 'my_data' not in st.session_state: st.session_state.my_data = []`.
#         6.  For data handling and display, use the `pandas` library. Store data as a list of dictionaries in `st.session_state`, then convert it to a DataFrame for display with `st.dataframe`.
#         7.  The Design Plan may suggest Streamlit components that DO NOT EXIST (e.g., 'st.calendar'). You MUST use your knowledge to replace any non-existent components with valid, working alternatives. For example, to show data for a specific day, use `st.date_input` to select a date, then filter your pandas DataFrame to show data for that date.
#         8.  Ensure all `on_click` callback functions are defined and correctly handle the logic of updating `st.session_state`.
#         9.  **IMPORTANT STREAMLIT RULE:** If you use `st.form`, you MUST use `st.form_submit_button` to submit the form. Do NOT use `st.button` inside a form.
#         10. Re-evaluate each and every word of code before generating the output.
        
#         """
#     )
    
#     output_parser = StrOutputParser()

#     chain = prompt | llm | output_parser
    
#     code = chain.invoke({
#         "product_plan_str": json.dumps(product_plan),
#         "design_plan_str": json.dumps(design_plan)
#     })
    
#     if code.strip().startswith("```python"):
#         code = code.strip()[9:]
#     if code.strip().endswith("```"):
#         code = code.strip()[:-3]
    
#     print("✅ [Engineering Agent] Streamlit code generated and cleaned.")
#     return code.strip()

# # --- Agent Definition: Merger Agent ---
# def merger_agent(product_plan: dict, design_plan: dict, code: str, idea: str):
#     """
#     Module 4: Merger Agent
#     Assembles the final project files and saves them to a directory.
#     """
#     print("▶️ [Merger Agent] Activated. Assembling project files...")
    
#     project_name = product_plan['product_name'].replace(' ', '_').lower()
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     output_dir = f"output/{project_name}_{timestamp}"
    
#     os.makedirs(output_dir, exist_ok=True)

#     with open(os.path.join(output_dir, "app.py"), "w") as f:
#         f.write(code)

#     readme_content = f"# {product_plan['product_name']}\n\n**Tagline:** {product_plan['tagline']}\n\nThis MVP was generated by AutoGenesis."
#     with open(os.path.join(output_dir, "README.md"), "w") as f:
#         f.write(readme_content)

#     memory_log = {
#         "idea": idea,
#         "timestamp": datetime.now().isoformat(),
#         "product_plan": product_plan,
#         "design_plan": design_plan,
#     }
#     with open(os.path.join(output_dir, "evocore_memory.json"), "w") as f:
#         json.dump(memory_log, f, indent=4)
        
#     print(f"✅ [Merger Agent] Project assembled in: {output_dir}")
#     return output_dir


# def evocore_orchestrator(idea: str) -> str:
#     """
#     The core orchestrator that manages the agentic workflow from idea to MVP.
#     It now returns the path to the output directory.
#     """
#     print("\n🚀 --- AutoGenesis Initializing --- 🚀")
#     print(f"Received Idea: \"{idea}\"")
    
#     start_time = datetime.now()
    
#     # --- Agent Workflow ---
#     product_plan = product_agent(idea)
#     design_plan = design_agent(product_plan['mvp_features'])
#     streamlit_code = engineering_agent(product_plan, design_plan)
#     output_dir = merger_agent(product_plan, design_plan, streamlit_code, idea)
    
#     end_time = datetime.now()
#     duration = end_time - start_time
    
#     print(f"\n🏁 --- AutoGenesis Task Complete --- 🏁")
#     print(f"⏱️ Total time taken: {duration.total_seconds():.2f} seconds.")
    
#     return output_dir

# # This block is now for testing the library directly.
# if __name__ == "__main__":
#     print("🧪 Running AutoGenesis in direct test mode...")
#     startup_idea = "A cafe shop in Chandigarh."
#     output = evocore_orchestrator(startup_idea)
#     print(f"✅ Test complete. Output generated in: {output}")


# --------------------------------------------------------------------------
# AutoGenesis: Core Agentic Pipeline (Phase 1 - Library)
#
# This file now acts as the core logic library for AutoGenesis.
# The EvoCore™ orchestrator can be imported and used by other scripts,
# like our new API server.
# --------------------------------------------------------------------------

import os
import json
import re
from datetime import datetime
from dotenv import load_dotenv

# --- Imports for our Agents ---
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field # Import Pydantic for structured output

# This function is now separate so it can be called without loading the LLM
def load_environment():
    print("▶️ Loading environment...")
    load_dotenv()

load_environment()

# --- Initialize the LLM ---
print("▶️ Initializing Large Language Model...")
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# --- Pydantic Schemas for Structured Output ---

class ProductPlan(BaseModel):
    """A structured product plan for a startup idea."""
    product_name: str = Field(description="A catchy, brandable name for the startup.")
    tagline: str = Field(description="A short, memorable tagline for the product.")
    target_audience: str = Field(description="A description of the ideal user persona.")
    mvp_features: list[str] = Field(description="A list of 3-5 core features for the Minimum Viable Product.")

class FeatureDesign(BaseModel):
    """Describes the UI components for a single feature."""
    feature: str = Field(description="The original feature text.")
    components: list[str] = Field(description="A list of specific Streamlit UI components for the feature.")

class UIDesignPlan(BaseModel):
    """The overall UI design plan for the Streamlit application."""
    app_layout: str = Field(description="Overall layout style: 'sidebar' or 'top-down'.")
    feature_designs: list[FeatureDesign] = Field(description="A list of designs for each feature.")


# --- Agent Definition: Product Agent (UPGRADED) ---
def product_agent(idea: str) -> dict:
    """
    Module 1: Product Agent
    Takes a startup idea and creates a structured product plan.
    """
    print("▶️ [Product Agent] Activated. Analyzing idea...")

    # The prompt is simplified as formatting is handled by the model
    prompt = PromptTemplate(
        template="""You are a world-class Product Manager. Your task is to analyze the following startup idea and create a concise product plan.
        The plan must be structured, realistic, and focused on a minimal viable product.

        Startup Idea: "{idea}"
        """,
        input_variables=["idea"],
    )

    # Use the model's structured output capability
    structured_llm = llm.with_structured_output(ProductPlan)
    chain = prompt | structured_llm
    
    # Invoke the chain and convert the Pydantic object to a dictionary
    product_plan_obj = chain.invoke({"idea": idea})
    
    print("✅ [Product Agent] Product plan generated.")
    return product_plan_obj.dict()

# --- Agent Definition: Design Agent (UPGRADED) ---
def design_agent(mvp_features: list[str]) -> dict:
    """
    Module 2: Design Agent
    Takes a list of features and suggests a UI layout for a Streamlit app.
    """
    print("▶️ [Design Agent] Activated. Designing UI structure...")

    # The prompt is simplified
    prompt = PromptTemplate(
        template="""You are an expert UI/UX Designer specializing in rapid prototyping with Streamlit.
        Based on the following list of features, design a simple UI structure.

        MVP Features:
        {mvp_features_str}

        Generate a UI design plan based on these features.
        """,
        input_variables=["mvp_features_str"],
    )

    # Use the model's structured output capability
    structured_llm = llm.with_structured_output(UIDesignPlan)
    chain = prompt | structured_llm

    # Invoke the chain and convert the Pydantic object to a dictionary
    design_plan_obj = chain.invoke({"mvp_features_str": json.dumps(mvp_features)})
    
    print("✅ [Design Agent] UI design plan generated.")
    return design_plan_obj.dict()

# --- Agent Definition: Engineering Agent (FINAL UPGRADE) ---
def engineering_agent(product_plan: dict, design_plan: dict) -> str:
    """
    Module 3: Engineering Agent
    Takes the product and design plans and generates the complete, runnable Streamlit code.
    """
    print("▶️ [Engineering Agent] Activated. Writing Streamlit code...")

    prompt = PromptTemplate.from_template(
        """You are an expert Senior Python Developer specializing in creating robust, single-file Streamlit applications.
        Your task is to generate the complete Python code for a Streamlit app based on the provided Product and Design plans.

        Product Plan:
        {product_plan_str}

        Design Plan:
        {design_plan_str}

        **CRITICAL INSTRUCTIONS:**
        1.  Your output MUST be ONLY the raw Python code for the Streamlit application.
        2.  Do NOT include any explanations, comments outside the code, or markdown formatting like ```python.
        3.  The code must be fully functional and runnable.
        4.  Correctly import all necessary libraries (e.g., `import streamlit as st`, `import pandas as pd`, `from datetime import datetime`).
        5.  Use `st.session_state` to initialize and manage all application data. Check if data exists in `st.session_state` before accessing it. For example: `if 'my_data' not in st.session_state: st.session_state.my_data = []`.
        6.  For data handling and display, use the `pandas` library. Store data as a list of dictionaries in `st.session_state`, then convert it to a DataFrame for display with `st.dataframe`.
        7.  The Design Plan may suggest Streamlit components that DO NOT EXIST (e.g., 'st.calendar'). You MUST use your knowledge to replace any non-existent components with valid, working alternatives. For example, to show data for a specific day, use `st.date_input` to select a date, then filter your pandas DataFrame to show data for that date.
        8.  Ensure all `on_click` callback functions are defined and correctly handle the logic of updating `st.session_state`.
        9.  **IMPORTANT STREAMLIT RULE:** If you use `st.form`, you MUST use `st.form_submit_button` to submit the form. Do NOT use `st.button` inside a form.
        10. Re-evaluate each and every word of code before generating the output.
        """
    )
    
    output_parser = StrOutputParser()

    chain = prompt | llm | output_parser
    
    code = chain.invoke({
        "product_plan_str": json.dumps(product_plan),
        "design_plan_str": json.dumps(design_plan)
    })
    
    # Clean up markdown fences just in case the model adds them
    match = re.search(r"```(python)?(.*)```", code, re.DOTALL)
    if match:
        code = match.group(2).strip()
    
    print("✅ [Engineering Agent] Streamlit code generated and cleaned.")
    return code.strip()

# --- Agent Definition: Merger Agent ---
def merger_agent(product_plan: dict, design_plan: dict, code: str, idea: str):
    """
    Module 4: Merger Agent
    Assembles the final project files and saves them to a directory.
    """
    print("▶️ [Merger Agent] Activated. Assembling project files...")
    
    project_name = product_plan['product_name'].replace(' ', '_').lower()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = f"output/{project_name}_{timestamp}"
    
    os.makedirs(output_dir, exist_ok=True)

    with open(os.path.join(output_dir, "app.py"), "w", encoding="utf-8") as f:
        f.write(code)

    readme_content = f"# {product_plan['product_name']}\n\n**Tagline:** {product_plan['tagline']}\n\nThis MVP was generated by AutoGenesis."
    with open(os.path.join(output_dir, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme_content)

    memory_log = {
        "idea": idea,
        "timestamp": datetime.now().isoformat(),
        "product_plan": product_plan,
        "design_plan": design_plan,
    }
    with open(os.path.join(output_dir, "evocore_memory.json"), "w", encoding="utf-8") as f:
        json.dump(memory_log, f, indent=4)
        
    print(f"✅ [Merger Agent] Project assembled in: {output_dir}")
    return output_dir


def evocore_orchestrator(idea: str) -> str:
    """
    The core orchestrator that manages the agentic workflow from idea to MVP.
    It now returns the path to the output directory.
    """
    print("\n🚀 --- AutoGenesis Initializing --- 🚀")
    print(f"Received Idea: \"{idea}\"")
    
    start_time = datetime.now()
    
    # --- Agent Workflow ---
    product_plan = product_agent(idea)
    design_plan = design_agent(product_plan['mvp_features'])
    streamlit_code = engineering_agent(product_plan, design_plan)
    output_dir = merger_agent(product_plan, design_plan, streamlit_code, idea)
    
    end_time = datetime.now()
    duration = end_time - start_time
    
    print(f"\n🏁 --- AutoGenesis Task Complete --- 🏁")
    print(f"⏱️ Total time taken: {duration.total_seconds():.2f} seconds.")
    
    return output_dir

# This block is now for testing the library directly.
if __name__ == "__main__":
    print("🧪 Running AutoGenesis in direct test mode...")
    startup_idea = "a drugstore in rajpura punjab"
    output = evocore_orchestrator(startup_idea)
    print(f"✅ Test complete. Output generated in: {output}")