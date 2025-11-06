import streamlit as st
import pandas as pd
from datetime import date

st.set_page_config(page_title="Medishop Chandigarh", page_icon="⚕️")

st.title("Medishop Chandigarh - Your Health, Our Priority")

if "orders" not in st.session_state:
    st.session_state.orders = []

if "medications" not in st.session_state:
    st.session_state.medications = ["Paracetamol", "Aspirin", "Ibuprofen"]

with st.sidebar:
    st.header("Features")
    online_ordering = st.checkbox("Online Ordering and Delivery")
    medication_selection = st.checkbox("Wide Selection of Common Medications")
    in_store_pickup = st.checkbox("In-store Pickup Option")
    prescription_refills = st.checkbox("Prescription Refills")


if online_ordering:
    st.header("Online Ordering and Delivery")
    selected_medication = st.selectbox("Select Medication", st.session_state.medications)
    if 'map_data' not in st.session_state:
        st.session_state.map_data = {'lat':30.7333,'lon':76.7794}
    st.map(pd.DataFrame({'lat':[st.session_state.map_data['lat']],'lon':[st.session_state.map_data['lon']]}))
    if st.button("Place Order"):
        st.session_state.orders.append({"medication": selected_medication, "delivery": True, "date": date.today()})

if medication_selection:
    st.header("Wide Selection of Common Medications")
    selected_medications = st.multiselect("Select Medications", st.session_state.medications)
    search_term = st.text_input("Search Medications")
    filtered_medications = [med for med in st.session_state.medications if search_term.lower() in med.lower()]
    st.write(f"Filtered Medications: {filtered_medications}")

if in_store_pickup:
    st.header("In-store Pickup Option")
    pickup_date = st.date_input("Select Pickup Date", date.today())
    if st.button("Confirm Pickup"):
        st.session_state.orders.append({"medication": "In-Store Pickup", "pickup_date": pickup_date})

if prescription_refills:
    st.header("Integration with Local Doctors for Prescription Refills")
    prescription_details = st.text_input("Enter Prescription Details")
    if st.button("Request Refill"):
        st.session_state.orders.append({"prescription": prescription_details, "refill": True})

st.header("Your Orders")
orders_df = pd.DataFrame(st.session_state.orders)
st.dataframe(orders_df)