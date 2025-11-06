import streamlit as st
import pandas as pd
from datetime import datetime

st.set_page_config(page_title="Rajpura Medics", page_icon="⚕️")

st.title("Rajpura Medics")
st.subheader("Your neighborhood pharmacy in Rajpura.")

if "prescription_data" not in st.session_state:
    st.session_state.prescription_data = []

if "otc_data" not in st.session_state:
    st.session_state.otc_data = []

if "healthcare_data" not in st.session_state:
    st.session_state.healthcare_data = []


with st.sidebar:
    st.header("Features")
    
    prescription_dispense = st.expander("Prescription Dispensing")
    with prescription_dispense:
        selected_medicine = st.selectbox("Select Medicine", ["Medicine A", "Medicine B", "Medicine C"])
        if st.button("Add to Prescription"):
            st.session_state.prescription_data.append({"medicine": selected_medicine, "date": datetime.now().strftime("%Y-%m-%d")})

    otc_meds = st.expander("Over-the-Counter Medication")
    with otc_meds:
        selected_otc = st.multiselect("Select OTC Medications", ["Paracetamol", "Aspirin", "Ibuprofen"])
        quantity = st.slider("Quantity", 1, 10, 1)
        if st.button("Add OTC"):
            for med in selected_otc:
                st.session_state.otc_data.append({"medicine": med, "quantity": quantity, "date": datetime.now().strftime("%Y-%m-%d")})

    healthcare_products = st.expander("Basic Healthcare Products")
    with healthcare_products:
        selected_product = st.checkbox("Bandages")
        notes = st.text_input("Additional Notes")
        if st.button("Add Product"):
            st.session_state.healthcare_data.append({"product": "Bandages" if selected_product else None, "notes": notes, "date": datetime.now().strftime("%Y-%m-%d")})


st.header("Order Summary")

if st.session_state.prescription_data:
    prescription_df = pd.DataFrame(st.session_state.prescription_data)
    st.subheader("Prescriptions")
    st.dataframe(prescription_df)

if st.session_state.otc_data:
    otc_df = pd.DataFrame(st.session_state.otc_data)
    st.subheader("Over-the-Counter Medications")
    st.dataframe(otc_df)

if st.session_state.healthcare_data:
    healthcare_df = pd.DataFrame(st.session_state.healthcare_data)
    st.subheader("Healthcare Products")
    st.dataframe(healthcare_df)