import streamlit as st
import pandas as pd
from datetime import datetime

st.title("StudyBuddy: Conquer your studies, one hour at a time.")

if 'study_data' not in st.session_state:
    st.session_state.study_data = []

st.sidebar.header("Features")

with st.sidebar.expander("Time Tracking"):
    study_time = st.slider("Study Time (minutes)", 0, 600, 60)
    notes = st.text_input("Notes")
    if st.button("Track Time"):
        st.session_state.study_data.append({'date': datetime.now().strftime("%Y-%m-%d"), 'time': study_time, 'notes': notes})

with st.sidebar.expander("Scheduling"):
    selected_date = st.date_input("Select Date")
    if selected_date:
        st.write(f"Selected Date: {selected_date}")

with st.sidebar.expander("Progress Visualization"):
    df = pd.DataFrame(st.session_state.study_data)
    if not df.empty:
        st.dataframe(df)
        total_study_time = df['time'].sum()
        st.progress(total_study_time / 3600) # Assuming a daily goal of 1 hour


with st.sidebar.expander("Goal Setting"):
    with st.form("goal_form"):
        daily_goal = st.text_input("Daily Study Goal (minutes)")
        if st.form_submit_button("Set Goal"):
            if daily_goal.isdigit():
                st.session_state.daily_goal = int(daily_goal)
                st.success(f"Goal set to {daily_goal} minutes")
            else:
                st.error("Please enter a valid number for your daily goal.")


with st.sidebar.expander("Simple Reminders"):
    if 'reminders' not in st.session_state:
        st.session_state.reminders = []
    reminder_text = st.text_input("Add Reminder")
    if st.button("Add Reminder"):
        if reminder_text:
            st.session_state.reminders.append(reminder_text)
    if st.session_state.reminders:
        st.write("Reminders:")
        for reminder in st.session_state.reminders:
            st.write(f"- {reminder}")