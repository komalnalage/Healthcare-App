import api from "../Manager/manager";
import { endpoints } from "../Services/endpoints";

export const login = async (login_source, email, password, lang_code, fcm_token, google_token, facebook_token, apple_auth_token, name, profile_pic,timezone) => {
  console.log(timezone,"currentTimeZonecurrentTimeZone");
  return api.post(endpoints.login, {
    login_source,
    email,
    password,
    lang_code,
    fcm_token,
    google_token,
    facebook_token,
    apple_auth_token,
    name,
    profile_pic,
    timezone
  });
};
export const register = async (data) => {
  return api.post(endpoints.register, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const verifyOtp = async (email, otp, lang_code) => {
  return api.post(endpoints.verifyOtp, {
    email,
    otp,
    lang_code
  });
};

export const resendOtp = async (email) => {
  return api.post(endpoints.resentOtp, {
    email
  });
};

export const forgot_Password = async (email) => {
  return api.post(endpoints.forgotPassword, {
    email
  });
};

export const reset_Password = async (_id, password) => {
  return api.post(endpoints.resetPassword, {
    _id,
    password
  });
};


export const get_User_Profile = async (user_token) => {
  const headers = {
    Authorization: 'Bearer ' + user_token,
  };
  return api.post(endpoints.getuserProfile, {},
    { headers: headers });
};


export const update_User_Profile = async (data, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'multipart/form-data'
  };
  return api.post(endpoints.updateUserProfile, data, {
    headers: headers
  });
};


export const change_user_password = async (old_password, new_password, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.changeUserPassword, {
    old_password,
    new_password
  }, { headers: headers }
  );
};

export const user_Logout = async (token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoints.userLogout, {},
    { headers: headers });
};

export const getspecialization = async () => {
  return api.get(endpoints.specialization,
  );
};

export const therapistSignup = async (data) => {
  return api.post(endpoints.therapistRegister, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const therapistverifyOtp = async (email, otp, lang_code) => {
  return api.post(endpoints.therapistverify_otp, {
    email,
    otp,
    lang_code
  });
};

export const therapistresendOtp = async (email, lang_code) => {
  return api.post(endpoints.therapistresend_otp, {
    email,
    lang_code
  });
};

export const therapist_forgot_Password = async (email, lang_code) => {
  return api.post(endpoints.therapistforgot_password, {
    email,
    lang_code
  });
};

export const therapist_reset_Password = async (_id, password, lang_code) => {
  return api.post(endpoints.therapistreset_password, {
    _id,
    password,
    lang_code
  });
};


export const therapist_login = async (login_source, email, password, lang_code, fcm_token, google_token, apple_auth_token, facebook_token, name, profile_pic,timezone) => {
  return api.post(endpoints.therapistlogin, {
    login_source,
    email,
    password,
    lang_code,
    fcm_token,
    google_token,
    apple_auth_token,
    facebook_token,
    name,
    profile_pic,
    timezone
  });
};


export const therapist_user_Logout = async (token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoints.therapistlogout, {},
    { headers: headers });
};

export const therapist_get_Profile = async (token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoints.therapistget_profile, {},
    { headers: headers });
};


export const therapist_get_calander_appointment = async (token,endpoint) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoint, {},
    { headers: headers });
};
export const user_get_calander_appointment = async (token,endpoint) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoint, {},
    { headers: headers });
};


export const update_Therapist_Profile = async (data, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'multipart/form-data'
  };
  return api.post(endpoints.therapistupdate_profile, data, {
    headers: headers
  });
};

export const change_Therapist_password = async (old_password, new_password, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapistchange_password, {
    old_password,
    new_password
  }, { headers: headers }
  );
};

export const addCard = async (card_token, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.useradd_card, {
    card_token
  }, { headers: headers }
  );
};

export const savedCard = async (token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoints.user_get_saved_cards, {}, { headers: headers }
  );
};

export const setDefault = async (card_token, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_set_as_default, {
    card_token
  }, { headers: headers }
  );
};

export const deleteUserCard = async (token, card_token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_delete_particular_card, {
    card_token
  }, { headers: headers }
  );
};

export const getTermsAndConditons = async () => {
  return api.post(endpoints.terms_and_condition,
  );
};

export const getPrivacyPolicy = async () => {
  return api.post(endpoints.privacy_policy,
  );
};


export const postAvailability = async (availability, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.update_avaiability, {
    availability: availability
  },
    { headers: headers });
};


export const getAvailability = async (token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoints.get_my_avaiability, {},
    { headers: headers });
};


export const searchTherapist = async (current_lat, current_long, specialization_ids, current_date_time, appointment_cost, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.search_nearby_therapist, {
    current_lat,
    current_long,
    specialization_ids,
    current_date_time,
    appointment_cost
  },
    { headers: headers });
};

export const current_appointment = async (current_date_time, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.get_current_appointment, {
    current_date_time,
  },
    { headers: headers });
};

export const userCurrentAppointment = async (current_date_time, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_current_appointment, {
    current_date_time,
  },
    { headers: headers });
};


export const therapistAcceptCall = async (current_date_time, appointment_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_accept_call_request, {
    current_date_time,
    appointment_id,
  },
    { headers: headers });
};

export const userCompleteCall = async (current_date_time, appointment_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_complete_appointment_call, {
    current_date_time,
    appointment_id,
  },
    { headers: headers });
};


export const therapistCompleteCall = async (current_date_time, appointment_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_complete_appointment_call, {
    current_date_time,
    appointment_id,
  },
    { headers: headers });
};

export const therapistPastAppointment = async (current_date_time, page, limit, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_get_past_appointments, {
    current_date_time,
    page,
    limit,
  },
    { headers: headers });
};

export const userPastAppointment = async (current_date_time, page, limit, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_get_past_appointments, {
    current_date_time,
    page,
    limit,
  },
    { headers: headers });
};


export const userPostFeedback = async (appointment_id, rating, feedback, token) => {
  console.log(appointment_id,"appointmentID");
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_give_appointment_feedback, {
    appointment_id,
    rating,
    feedback,
  },
    { headers: headers });
};


export const therapistRejectCall = async (current_date_time, appointment_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_reject_call_request, {
    current_date_time,
    appointment_id,
  },
    { headers: headers });
};


export const userCancelledAppointment = async (current_date_time, appointment_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_cancel_call_appointment, {
    current_date_time,
    appointment_id,
  },
    { headers: headers });
};


export const getTherapistDetail = async (therapist_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_get_therapist_detail, {
    therapist_id
  },
    { headers: headers });
};


export const contactUs = async (name, email, message, _id, user_type) => {
  let obj = {
    name, email, message, user_type
  }
  if (user_type == "user") {
    obj.user_id = _id
  } else if (user_type == "therapist") {
    obj.therapist_id = _id
  }
  return api.post(endpoints.common_contact_us, obj);
};


export const therapistcurrentAppointment = async (current_date_time, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_get_current_appointment, {
    current_date_time,
  },
    { headers: headers });
};

export const usercurrentAppointment = async (current_date_time, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_get_current_appointment, {
    current_date_time,
  },
    { headers: headers });
};


export const getTimeSlot = async (data, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_get_therapist_slot, data, {
    headers: headers
  });
};


export const scheduleAppointment = async (data, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.schedule_appointment, data, {
    headers: headers
  });
};

export const userUpcomingAppointment = async (current_date_time, page, limit, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_get_upcoming_appointments, {
    current_date_time,
    page,
    limit,
  },
    { headers: headers });
};


export const Update_onlineStatus = async (data, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_update_online_status, data,
    { headers: headers });
};


export const therapistUpcomingAppointment = async (current_date_time, page, limit, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_get_upcoming_appointments, {
    current_date_time,
    page,
    limit,
  },
    { headers: headers });
};

export const userCancelAppointment = async (current_date_time, appointment_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.user_cancel_call_appointment, {
    current_date_time,
    appointment_id,
  },
    { headers: headers });
};

export const therapistCancelAppointment = async (current_date_time, appointment_id, token) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.post(endpoints.therapist_cancel_call_appointment, {
    current_date_time,
    appointment_id,
  },
    { headers: headers });
};

export const get_my_feedbacks = async (token) => {
  const headers = {
    Authorization: 'Bearer ' + token,

  };
  return api.get(endpoints.therapist_get_Myfeedback, {},
    { headers: headers });
};

export const getNotificationsList = async (token,endpoint) => {
  const headers = {
    Authorization: 'Bearer ' + token,
  };
  return api.get(endpoint, {},
    { headers: headers });
};