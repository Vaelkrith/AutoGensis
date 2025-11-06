import streamlit as st
import pandas as pd
from datetime import datetime
import time
import winsound #For Windows notification; replace with platform-specific solution for other OS

st.title("FocusFlow: Find your flow, one pomodoro at a time.")

if 'work_time' not in st.session_state:
    st.session_state.work_time = 25
if 'break_time' not in st.session_state:
    st.session_state.break_time = 5
if 'session_data' not in st.session_state:
    st.session_state.session_data = []
if 'timer_running' not in st.session_state:
    st.session_state.timer_running = False
if 'current_time' not in st.session_state:
    st.session_state.current_time = 0
if 'current_session_type' not in st.session_state:
    st.session_state.current_session_type = "work"
if 'notification_enabled' not in st.session_state:
    st.session_state.notification_enabled = False


with st.form("timer_settings"):
    st.number_input("Work Time (minutes):", value=st.session_state.work_time, key="work_time")
    st.number_input("Break Time (minutes):", value=st.session_state.break_time, key="break_time")
    st.checkbox("Enable Notifications", value=st.session_state.notification_enabled, key="notification_enabled")
    submitted = st.form_submit_button("Set Timer")

def play_notification():
    if st.session_state.notification_enabled:
        winsound.PlaySound("SystemExclamation", winsound.SND_ALIAS)


def start_timer():
    st.session_state.timer_running = True
    st.session_state.current_time = st.session_state.work_time * 60 if st.session_state.current_session_type == "work" else st.session_state.break_time * 60
    

def pause_timer():
    st.session_state.timer_running = False

def reset_timer():
    st.session_state.timer_running = False
    st.session_state.current_time = 0
    st.session_state.current_session_type = "work"

def end_session():
    if st.session_state.current_session_type == "work":
        st.session_state.session_data.append({"start_time": datetime.now(), "session_type": "work", "duration": st.session_state.work_time})
    else:
        st.session_state.session_data.append({"start_time": datetime.now(), "session_type": "break", "duration": st.session_state.break_time})
    reset_timer()


if st.session_state.timer_running:
    if st.session_state.current_time > 0:
        st.session_state.current_time -= 1
        time.sleep(1)
        progress = (st.session_state.current_time / (st.session_state.work_time * 60 if st.session_state.current_session_type == "work" else st.session_state.break_time * 60)) * 100
        st.progress(progress)
        st.markdown(f"Time remaining: {st.session_state.current_time // 60}:{st.session_state.current_time % 60:02}")
    else:
        play_notification()
        if st.session_state.current_session_type == "work":
            st.session_state.current_session_type = "break"
        else:
            st.session_state.current_session_type = "work"
        end_session()
        start_timer()

col1, col2, col3 = st.columns(3)
with col1:
    if st.button("Start"):
        start_timer()
with col2:
    if st.button("Pause"):
        pause_timer()
with col3:
    if st.button("Reset"):
        reset_timer()


df = pd.DataFrame(st.session_state.session_data)
st.dataframe(df)