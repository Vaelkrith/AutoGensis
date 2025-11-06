import streamlit as st
import pandas as pd
from datetime import datetime

st.set_page_config(page_title="MedXpress Chandigarh", page_icon="⚕️")

st.title("MedXpress Chandigarh - Your Pharmacy, Delivered.")

if "orders" not in st.session_state:
    st.session_state.orders = []

with st.sidebar:
    st.header("Order Medications")
    with st.form("order_form"):
        medication = st.text_input("Medication Name")
        quantity = st.number_input("Quantity", min_value=1)
        insurance = st.selectbox("Insurance Provider", ["None", "Provider A", "Provider B"])
        payment = st.text_input("Payment Method")
        submit_button = st.form_submit_button("Place Order")
        if submit_button:
            new_order = {
                "Medication": medication,
                "Quantity": quantity,
                "Insurance": insurance,
                "Payment": payment,
                "Order Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            st.session_state.orders.append(new_order)

    st.header("Order Tracking")
    selected_date = st.date_input("Select Date")
    if selected_date:
        df = pd.DataFrame(st.session_state.orders)
        if not df.empty:
            df['Order Date'] = pd.to_datetime(df['Order Date'])
            filtered_df = df[df['Order Date'].dt.date == selected_date]
            st.dataframe(filtered_df)
    else:
        st.write("Select a date to view orders.")


    st.header("Customer Support")
    message = st.text_area("Enter your message")
    send_button = st.button("Send")
    if send_button:
        st.write("Message sent!")