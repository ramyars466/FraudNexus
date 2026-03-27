import random

def send_otp():
    otp = random.randint(100000, 999999)
    print(f"OTP sent to user: {otp}")
    return otp


def verify_otp(correct_otp):

    user_input = int(input("Enter OTP: "))

    if user_input == correct_otp:
        print("OTP verified. Transaction Approved.")
        return True

    else:
        print("Incorrect OTP. Transaction Blocked.")
        return False