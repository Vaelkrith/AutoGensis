import streamlit as st
import pandas as pd
from datetime import datetime

st.set_page_config(page_title="PomodoroPro", page_icon=":timer:")

st.title("PomodoroPro: Focus. Flow. Finish.")
st.write("A Pomodoro timer to boost your productivity.")

if "work_interval" not in st.session_state:
    st.session_state.work_interval = 25
if "break_interval" not in st.session_state:
    st.session_state.break_interval = 5
if "running" not in st.session_state:
    st.session_state.running = False
if "data" not in st.session_state:
    st.session_state.data = []

with st.sidebar:
    st.subheader("Settings")
    st.session_state.work_interval = st.slider("Work Interval (minutes)", 5, 60, st.session_state.work_interval)
    st.session_state.break_interval = st.slider("Break Interval (minutes)", 1, 30, st.session_state.break_interval)
    sound_options = ["Beep", "Chime", "None"]
    selected_sound = st.selectbox("Notification Sound", sound_options)
    vibration = st.checkbox("Vibration")

    if st.button("Start/Pause"):
        st.session_state.running = not st.session_state.running

if st.session_state.running:
    st.write("Timer is running...")
else:
    st.write("Timer is paused.")


def add_session():
    st.session_state.data.append({"timestamp": datetime.now(), "work_interval": st.session_state.work_interval, "break_interval": st.session_state.break_interval})

if st.button("Add Session"):
    add_session()

if st.session_state.data:
    df = pd.DataFrame(st.session_state.data)
    st.dataframe(df)

selected_date = st.date_input("Select Date to view progress", datetime.now().date())
if st.session_state.data:
    df = pd.DataFrame(st.session_state.data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['date'] = df['timestamp'].dt.date
    filtered_df = df[df['date'] == selected_date]
    st.dataframe(filtered_df)